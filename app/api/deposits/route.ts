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
        `select id
         from banks
         where id = ? and type = 'bank' and is_active = true
           and deposit_account_name is not null and deposit_account_name <> ''
           and deposit_account_number is not null and deposit_account_number <> ''
         limit 1`,
        [parsed.data.bankId]
      );
      bankId = Number((bankRows as Array<{ id: number }>)[0]?.id) || null;
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
