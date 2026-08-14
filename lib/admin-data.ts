import { pool } from "@/lib/db";
import { formatIdr } from "@/lib/session";

export type AdminFilter = {
  q?: string;
  status?: string;
};

type SqlParam = string | number | boolean | null;

export type DashboardStats = {
  users: number;
  activeUsers: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  approvedDepositAmount: number;
  approvedWithdrawalAmount: number;
  walletLiability: number;
};

export type AdminUserRow = {
  id: number;
  username: string;
  email: string | null;
  phone: string | null;
  referralCode: string;
  status: "active" | "locked" | "suspended";
  balance: number;
  createdAt: string;
  updatedAt: string;
  locale: string;
  bankAccounts: string | null;
  verifiedBankAccounts: number;
  pendingBankAccounts: number;
};

export type AdminBankRow = {
  id: number;
  code: string;
  name: string;
  type: "bank" | "e_money";
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
};

export type AdminDepositRow = {
  id: number;
  username: string;
  method: "bank_transfer" | "qris" | "qris_automatic";
  amount: number;
  status: "pending" | "approved" | "rejected" | "expired";
  reference: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminWithdrawalRow = {
  id: number;
  username: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "cancelled";
  reference: string | null;
  accountName: string | null;
  accountNumber: string | null;
  bankName: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

type CountRow = {
  users: number | string | null;
  active_users: number | string | null;
  pending_deposits: number | string | null;
  pending_withdrawals: number | string | null;
  approved_deposit_amount: number | string | null;
  approved_withdrawal_amount: number | string | null;
  wallet_liability: number | string | null;
};

function num(value: number | string | null | undefined) {
  return Number(value ?? 0);
}

function dateValue(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  return typeof value === "string" ? value : String(value ?? "");
}

function text(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseAdminFilter(query: Record<string, string | string[] | undefined>): AdminFilter {
  return {
    q: text(query.q)?.trim() || undefined,
    status: text(query.status)?.trim() || undefined
  };
}

export function money(amount: number) {
  return formatIdr(amount);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [rows] = await pool.query(`
    select
      (select count(*) from users) as users,
      (select count(*) from users where status = 'active') as active_users,
      (select count(*) from deposits where status = 'pending') as pending_deposits,
      (select count(*) from withdrawals where status = 'pending') as pending_withdrawals,
      (select coalesce(sum(amount), 0) from deposits where status = 'approved') as approved_deposit_amount,
      (select coalesce(sum(amount), 0) from withdrawals where status = 'approved') as approved_withdrawal_amount,
      (select coalesce(sum(case when direction = 'credit' then amount when direction = 'debit' then -amount else 0 end), 0)
       from wallet_ledger_entries) as wallet_liability
  `);
  const row = (rows as CountRow[])[0];
  return {
    users: num(row?.users),
    activeUsers: num(row?.active_users),
    pendingDeposits: num(row?.pending_deposits),
    pendingWithdrawals: num(row?.pending_withdrawals),
    approvedDepositAmount: num(row?.approved_deposit_amount),
    approvedWithdrawalAmount: num(row?.approved_withdrawal_amount),
    walletLiability: num(row?.wallet_liability)
  };
}

export async function getAdminUsers(filter: AdminFilter = {}) {
  const where: string[] = [];
  const params: SqlParam[] = [];

  if (filter.status && ["active", "locked", "suspended"].includes(filter.status)) {
    where.push("u.status = ?");
    params.push(filter.status);
  }
  if (filter.q) {
    where.push("(u.username like ? or u.email like ? or u.phone like ? or u.referral_code like ?)");
    const like = `%${filter.q}%`;
    params.push(like, like, like, like);
  }

  const [rows] = await pool.execute(
    `select
       u.id,
       u.username,
       u.email,
       u.phone,
       u.referral_code as referralCode,
       u.status,
       u.locale,
       u.created_at as createdAt,
       u.updated_at as updatedAt,
       coalesce(sum(case when wle.direction = 'credit' then wle.amount when wle.direction = 'debit' then -wle.amount else 0 end), 0) as balance,
       group_concat(distinct concat(b.name, ' - ', uba.account_name, ' / ', uba.account_number, ' (', uba.status, ')') separator '\\n') as bankAccounts,
       count(distinct case when uba.status = 'verified' then uba.id end) as verifiedBankAccounts,
       count(distinct case when uba.status = 'pending' then uba.id end) as pendingBankAccounts
     from users u
     left join wallets w on w.user_id = u.id and w.currency = 'IDR'
     left join wallet_ledger_entries wle on wle.wallet_id = w.id
     left join user_bank_accounts uba on uba.user_id = u.id
     left join banks b on b.id = uba.bank_id
     ${where.length ? `where ${where.join(" and ")}` : ""}
     group by u.id, u.username, u.email, u.phone, u.referral_code, u.status, u.locale, u.created_at, u.updated_at
     order by u.id desc
     limit 100`,
    params
  );

  return (rows as Array<
    Omit<AdminUserRow, "balance" | "createdAt" | "updatedAt" | "verifiedBankAccounts" | "pendingBankAccounts"> & {
      balance: string | number;
      createdAt: string | Date;
      updatedAt: string | Date;
      verifiedBankAccounts: string | number;
      pendingBankAccounts: string | number;
    }
  >).map((row) => ({
    ...row,
    balance: num(row.balance),
    createdAt: dateValue(row.createdAt),
    updatedAt: dateValue(row.updatedAt),
    verifiedBankAccounts: num(row.verifiedBankAccounts),
    pendingBankAccounts: num(row.pendingBankAccounts)
  }));
}

export async function getAdminBanks(filter: AdminFilter = {}) {
  const where: string[] = [];
  const params: SqlParam[] = [];
  if (filter.status === "active") where.push("is_active = true");
  if (filter.status === "inactive") where.push("is_active = false");
  if (filter.q) {
    where.push("(code like ? or name like ?)");
    const like = `%${filter.q}%`;
    params.push(like, like);
  }
  const [rows] = await pool.execute(
    `select id, code, name, type, logo_url as logoUrl, is_active as isActive, created_at as createdAt
     from banks
     ${where.length ? `where ${where.join(" and ")}` : ""}
     order by type, name
     limit 200`,
    params
  );
  return (rows as Array<Omit<AdminBankRow, "isActive"> & { isActive: number | boolean }>).map((row) => ({
    ...row,
    isActive: Boolean(row.isActive)
  }));
}

export async function getAdminDeposits(filter: AdminFilter = {}) {
  const where: string[] = [];
  const params: SqlParam[] = [];
  if (filter.status && ["pending", "approved", "rejected", "expired"].includes(filter.status)) {
    where.push("d.status = ?");
    params.push(filter.status);
  }
  if (filter.q) {
    where.push("(u.username like ? or d.reference like ?)");
    const like = `%${filter.q}%`;
    params.push(like, like);
  }
  const [rows] = await pool.execute(
    `select d.id, u.username, d.method, d.amount, d.status, d.reference, d.admin_notes as adminNotes,
       d.created_at as createdAt, d.updated_at as updatedAt
     from deposits d
     join users u on u.id = d.user_id
     ${where.length ? `where ${where.join(" and ")}` : ""}
     order by d.id desc
     limit 100`,
    params
  );
  return (rows as Array<Omit<AdminDepositRow, "amount"> & { amount: string | number }>).map((row) => ({
    ...row,
    amount: num(row.amount)
  }));
}

export async function getAdminWithdrawals(filter: AdminFilter = {}) {
  const where: string[] = [];
  const params: SqlParam[] = [];
  if (filter.status && ["pending", "approved", "rejected", "cancelled"].includes(filter.status)) {
    where.push("w.status = ?");
    params.push(filter.status);
  }
  if (filter.q) {
    where.push("(u.username like ? or w.reference like ? or uba.account_name like ? or uba.account_number like ?)");
    const like = `%${filter.q}%`;
    params.push(like, like, like, like);
  }
  const [rows] = await pool.execute(
    `select w.id, u.username, w.amount, w.status, w.reference, w.admin_notes as adminNotes,
       uba.account_name as accountName, uba.account_number as accountNumber, b.name as bankName,
       w.created_at as createdAt, w.updated_at as updatedAt
     from withdrawals w
     join users u on u.id = w.user_id
     left join user_bank_accounts uba on uba.id = w.user_bank_account_id
     left join banks b on b.id = uba.bank_id
     ${where.length ? `where ${where.join(" and ")}` : ""}
     order by w.id desc
     limit 100`,
    params
  );
  return (rows as Array<Omit<AdminWithdrawalRow, "amount"> & { amount: string | number }>).map((row) => ({
    ...row,
    amount: num(row.amount)
  }));
}

export async function getWithdrawalUserOptions() {
  const [rows] = await pool.query(
    `select
       u.id,
       u.username,
       uba.id as bankAccountId,
       concat(b.name, ' - ', uba.account_name, ' / ', uba.account_number) as bankLabel
     from users u
     left join user_bank_accounts uba on uba.user_id = u.id
     left join banks b on b.id = uba.bank_id
     where u.status = 'active'
     order by u.username
     limit 200`
  );
  return rows as Array<{ id: number; username: string; bankAccountId: number | null; bankLabel: string | null }>;
}
