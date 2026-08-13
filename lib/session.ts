import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { pool } from "@/lib/db";

export type AuthenticatedUser = {
  id: number;
  username: string;
  email: string | null;
  phone: string | null;
  balance: number;
  balanceFormatted: string;
  inboxCount: number;
};

type CurrentUserRow = {
  id: number;
  username: string;
  email: string | null;
  phone: string | null;
  status: "active" | "locked" | "suspended";
  balance: string | number | null;
};

export function formatIdr(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session) return null;

  const [rows] = await pool.execute(
    `select
       u.id,
       u.username,
       u.email,
       u.phone,
       u.status,
       coalesce(sum(case
         when wle.direction = 'credit' then wle.amount
         when wle.direction = 'debit' then -wle.amount
         else 0
       end), 0) as balance
     from users u
     left join wallets w on w.user_id = u.id and w.currency = 'IDR'
     left join wallet_ledger_entries wle on wle.wallet_id = w.id
     where u.id = ?
     group by u.id, u.username, u.email, u.phone, u.status
     limit 1`,
    [session.userId]
  );

  const user = (rows as CurrentUserRow[])[0];
  if (!user || user.status !== "active") return null;

  const balance = Number(user.balance ?? 0);

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    balance,
    balanceFormatted: formatIdr(balance),
    inboxCount: 9
  };
}
