import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { pool } from "@/lib/db";
import { redirectRelative, withSearchParam } from "@/lib/redirect";

const depositSchema = z.object({
  method: z.enum(["bank_transfer", "qris"]),
  amount: z.coerce.number().int().min(50000, "Minimal deposit Rp 50.000").max(100000000, "Jumlah deposit terlalu besar"),
  bankCode: z.string().trim().max(32).optional(),
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
    bankCode: field(formData, "bankCode"),
    note: field(formData, "note")
  });

  const method = field(formData, "method") === "qris" ? "qris" : "bank-transfer";
  const returnPath = `/deposit/${method}`;

  if (!parsed.success) {
    return redirectWithStatus(request, returnPath, "error", parsed.error.issues[0]?.message ?? "Deposit tidak valid");
  }

  const reference = `DEP-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  await pool.execute(
    `insert into deposits (user_id, method, amount, status, reference)
     values (?, ?, ?, 'pending', ?)`,
    [session.userId, parsed.data.method, parsed.data.amount, reference]
  );

  return redirectWithStatus(request, returnPath, "success", `Deposit ${reference} berhasil dibuat dan menunggu proses`);
}
