import { pool } from "@/lib/db";
import { formatIdr } from "@/lib/session";

type DepositQueryTarget = Pick<typeof pool, "execute">;

export type PendingDeposit = {
  id: number;
  method: "bank_transfer" | "qris" | "qris_automatic";
  amount: number;
  amountFormatted: string;
  reference: string | null;
  bankName: string | null;
  createdAt: string;
};

function dateValue(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  return typeof value === "string" ? value : String(value ?? "");
}

export async function getPendingDepositForUser(userId: number, target: DepositQueryTarget = pool): Promise<PendingDeposit | null> {
  const [rows] = await target.execute(
    `select d.id, d.method, d.amount, d.reference, d.created_at as createdAt, b.name as bankName
     from deposits d
     left join banks b on b.id = d.bank_id
     where d.user_id = ? and d.status = 'pending'
     order by d.id desc
     limit 1`,
    [userId]
  );
  const deposit = (rows as Array<{
    id: number;
    method: PendingDeposit["method"];
    amount: string | number;
    reference: string | null;
    bankName: string | null;
    createdAt: string | Date;
  }>)[0];

  if (!deposit) return null;

  const amount = Number(deposit.amount);
  return {
    id: deposit.id,
    method: deposit.method,
    amount,
    amountFormatted: formatIdr(amount),
    reference: deposit.reference,
    bankName: deposit.bankName,
    createdAt: dateValue(deposit.createdAt)
  };
}

export function pendingDepositMessage(deposit: Pick<PendingDeposit, "reference">) {
  return `Deposit ${deposit.reference ?? "Anda"} masih menunggu proses. Silahkan tunggu admin memproses deposit tersebut sebelum membuat deposit baru.`;
}
