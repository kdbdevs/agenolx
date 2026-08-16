import type { NextRequest } from "next/server";
import { z } from "zod";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { pool } from "@/lib/db";
import { getPendingDepositForUser, pendingDepositMessage } from "@/lib/deposits";
import { redirectRelative, withSearchParam } from "@/lib/redirect";

const depositSchema = z.object({
  method: z.enum(["bank_transfer", "qris"]),
  amount: z.coerce.number().int().min(10000, "Minimal deposit Rp 10.000").max(100000000, "Jumlah deposit terlalu besar"),
  bankId: z.coerce.number().int().positive().optional(),
  note: z.string().trim().max(500).optional()
});

const RECOMMENDED_DEPOSIT_BANK = "MANDIRI";

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function redirectWithStatus(request: NextRequest, path: string, key: "success" | "error", message: string) {
  void request;
  return redirectRelative(withSearchParam(path, key, message));
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    return redirectWithStatus(request, "/login", "error", "Silahkan masuk terlebih dahulu");
  }

  const formData = await request.formData();
  const parsed = depositSchema.safeParse({
    method: field(formData, "method"),
    amount: field(formData, "amount"),
    bankId: field(formData, "bankId") || undefined,
    note: field(formData, "note")
  });

  const method = field(formData, "method") === "qris" ? "qris" : "bank-transfer";
  const returnPath = `/deposit/${method}`;

  if (!parsed.success) {
    return redirectWithStatus(request, returnPath, "error", parsed.error.issues[0]?.message ?? "Deposit tidak valid");
  }

  const connection = await pool.getConnection();
  let lockName: string | null = null;

  try {
    lockName = `deposit:create:${session.userId}`;
    const [lockRows] = await connection.execute("select get_lock(?, 5) as acquired", [lockName]);
    const lockAcquired = Number((lockRows as Array<{ acquired: number | string | null }>)[0]?.acquired ?? 0) === 1;
    if (!lockAcquired) {
      return redirectWithStatus(request, returnPath, "error", "Deposit Anda sedang diproses. Silahkan coba lagi beberapa detik lagi.");
    }

    const pendingDeposit = await getPendingDepositForUser(session.userId, connection);
    if (pendingDeposit) {
      return redirectWithStatus(request, returnPath, "error", pendingDepositMessage(pendingDeposit));
    }

    const reference = `DEP-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    let bankId: number | null = null;

    if (parsed.data.method === "bank_transfer") {
      if (!parsed.data.bankId) {
        return redirectWithStatus(request, returnPath, "error", "Bank tujuan deposit wajib dipilih");
      }

      const [bankRows] = await connection.execute(
        `select id, name, deposit_account_name as depositAccountName,
           deposit_account_number as depositAccountNumber
         from banks
         where id = ? and type = 'bank' and is_active = true
         limit 1`,
        [parsed.data.bankId]
      );
      const bank = (bankRows as Array<{
        id: number;
        name: string;
        depositAccountName: string | null;
        depositAccountNumber: string | null;
      }>)[0];

      if (!bank) {
        return redirectWithStatus(request, returnPath, "error", "Bank tujuan deposit tidak aktif");
      }

      if (!bank.name.toLocaleLowerCase("id-ID").includes(RECOMMENDED_DEPOSIT_BANK.toLocaleLowerCase("id-ID"))) {
        return redirectWithStatus(
          request,
          returnPath,
          "error",
          `${bank.name} sedang gangguan. Silahkan gunakan ${RECOMMENDED_DEPOSIT_BANK} untuk deposit saat ini.`
        );
      }

      if (!bank.depositAccountName || !bank.depositAccountNumber) {
        return redirectWithStatus(request, returnPath, "error", "Rekening MANDIRI belum tersedia. Silahkan hubungi admin.");
      }

      bankId = Number(bank.id) || null;
      if (!bankId) {
        return redirectWithStatus(request, returnPath, "error", "Rekening tujuan deposit belum tersedia");
      }
    }

    await connection.execute(
      `insert into deposits (user_id, method, bank_id, amount, status, reference, note)
       values (?, ?, ?, ?, 'pending', ?, ?)`,
      [session.userId, parsed.data.method, bankId, parsed.data.amount, reference, parsed.data.note || null]
    );

    return redirectWithStatus(request, returnPath, "success", `Deposit ${reference} berhasil dibuat dan menunggu proses`);
  } finally {
    if (lockName) {
      await connection.execute("select release_lock(?)", [lockName]).catch(() => undefined);
    }
    connection.release();
  }
}
