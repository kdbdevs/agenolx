import { pool } from "@/lib/db";
import { formatIdr } from "@/lib/session";

export type AdminFilter = {
  q?: string;
  status?: string;
};

export type ReferralAdminFilter = {
  q?: string;
  status?: string;
  range?: "today" | "week" | "month" | "custom";
  dateFrom: string;
  dateTo: string;
  affiliateSort: "username" | "downlines" | "links" | "approvedDeposits" | "createdAt";
  affiliateDir: "asc" | "desc";
  depositSort: "affiliate" | "downlines" | "depositCount" | "approvedAmount" | "pendingAmount" | "lastDeposit";
  depositDir: "asc" | "desc";
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
  depositAccountName: string | null;
  depositAccountNumber: string | null;
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
  bankName: string | null;
  depositAccountName: string | null;
  depositAccountNumber: string | null;
  note: string | null;
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

export type ReferralLinkRow = {
  id: number;
  code: string;
  label: string | null;
  status: "active" | "disabled";
  ownerUserId: number;
  ownerUsername: string;
  downlineCount: number;
  approvedDepositAmount: number;
  createdAt: string;
  updatedAt: string;
};

export type AffiliateRow = {
  id: number;
  username: string;
  referralCode: string;
  status: "active" | "locked" | "suspended";
  linkCount: number;
  downlineCount: number;
  approvedDepositAmount: number;
  lastDownlineAt: string | null;
  createdAt: string;
};

export type AffiliateDepositReportRow = {
  id: number;
  username: string;
  referralCode: string;
  downlineCount: number;
  depositCount: number;
  approvedDepositAmount: number;
  pendingDepositAmount: number;
  lastDepositAt: string | null;
};

export type AffiliateDepositDetail = {
  affiliate: {
    id: number;
    username: string;
    referralCode: string;
    status: "active" | "locked" | "suspended";
    createdAt: string;
  } | null;
  rows: AffiliateDownlineDepositRow[];
  totals: {
    downlines: number;
    deposits: number;
    approvedAmount: number;
    pendingAmount: number;
  };
};

export type AffiliateDownlineDepositRow = {
  downlineId: number;
  downlineUsername: string;
  downlineCreatedAt: string;
  depositId: number | null;
  reference: string | null;
  method: "bank_transfer" | "qris" | "qris_automatic" | null;
  amount: number;
  status: "pending" | "approved" | "rejected" | "expired" | null;
  bankName: string | null;
  depositCreatedAt: string | null;
  reviewedAt: string | null;
};

export type ReferralUserOption = {
  id: number;
  username: string;
  referralCode: string;
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

function isoDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

function parseDateInput(value: string | undefined) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined;
}

function defaultReferralDateRange(range: ReferralAdminFilter["range"] | undefined) {
  const today = new Date();
  if (range === "today") {
    const date = isoDate(today);
    return { dateFrom: date, dateTo: date };
  }
  if (range === "week") {
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);
    return { dateFrom: isoDate(weekAgo), dateTo: isoDate(today) };
  }
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  return { dateFrom: isoDate(firstDay), dateTo: isoDate(today) };
}

function sortDir(value: string | undefined): "asc" | "desc" {
  return value === "asc" ? "asc" : "desc";
}

export function parseAdminFilter(query: Record<string, string | string[] | undefined>): AdminFilter {
  return {
    q: text(query.q)?.trim() || undefined,
    status: text(query.status)?.trim() || undefined
  };
}

export function parseReferralAdminFilter(query: Record<string, string | string[] | undefined>): ReferralAdminFilter {
  const rangeValue = text(query.range);
  const range = rangeValue === "today" || rangeValue === "week" || rangeValue === "month" || rangeValue === "custom"
    ? rangeValue
    : "month";
  const defaults = defaultReferralDateRange(range);
  const affiliateSortValue = text(query.affiliateSort);
  const depositSortValue = text(query.depositSort);

  return {
    q: text(query.q)?.trim() || undefined,
    status: text(query.status)?.trim() || undefined,
    range,
    dateFrom: parseDateInput(text(query.dateFrom)) ?? defaults.dateFrom,
    dateTo: parseDateInput(text(query.dateTo)) ?? defaults.dateTo,
    affiliateSort:
      affiliateSortValue === "username" ||
      affiliateSortValue === "downlines" ||
      affiliateSortValue === "links" ||
      affiliateSortValue === "approvedDeposits" ||
      affiliateSortValue === "createdAt"
        ? affiliateSortValue
        : "approvedDeposits",
    affiliateDir: sortDir(text(query.affiliateDir)),
    depositSort:
      depositSortValue === "affiliate" ||
      depositSortValue === "downlines" ||
      depositSortValue === "depositCount" ||
      depositSortValue === "approvedAmount" ||
      depositSortValue === "pendingAmount" ||
      depositSortValue === "lastDeposit"
        ? depositSortValue
        : "approvedAmount",
    depositDir: sortDir(text(query.depositDir))
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
    `select id, code, name, type, logo_url as logoUrl,
       deposit_account_name as depositAccountName,
       deposit_account_number as depositAccountNumber,
       is_active as isActive, created_at as createdAt
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
    `select d.id, u.username, d.method, d.amount, d.status, d.reference,
       b.name as bankName,
       b.deposit_account_name as depositAccountName,
       b.deposit_account_number as depositAccountNumber,
       d.note,
       d.admin_notes as adminNotes,
       d.created_at as createdAt, d.updated_at as updatedAt
     from deposits d
     join users u on u.id = d.user_id
     left join banks b on b.id = d.bank_id
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

export async function getReferralUserOptions() {
  const [rows] = await pool.query(
    `select id, username, referral_code as referralCode
     from users
     where status = 'active'
     order by username
     limit 500`
  );
  return rows as ReferralUserOption[];
}

export async function getReferralLinks(filter: ReferralAdminFilter) {
  const where: string[] = [];
  const params: SqlParam[] = [];
  if (filter.status && ["active", "disabled"].includes(filter.status)) {
    where.push("rl.status = ?");
    params.push(filter.status);
  }
  if (filter.q) {
    where.push("(rl.code like ? or rl.label like ? or u.username like ?)");
    const like = `%${filter.q}%`;
    params.push(like, like, like);
  }

  const [rows] = await pool.execute(
    `select
       rl.id,
       rl.code,
       rl.label,
       rl.status,
       rl.owner_user_id as ownerUserId,
       u.username as ownerUsername,
       count(distinct child.id) as downlineCount,
       coalesce(sum(case when d.status = 'approved' then d.amount else 0 end), 0) as approvedDepositAmount,
       rl.created_at as createdAt,
       rl.updated_at as updatedAt
     from referral_links rl
     join users u on u.id = rl.owner_user_id
     left join users child on child.referral_link_id = rl.id
     left join deposits d on d.user_id = child.id
     ${where.length ? `where ${where.join(" and ")}` : ""}
     group by rl.id, rl.code, rl.label, rl.status, rl.owner_user_id, u.username, rl.created_at, rl.updated_at
     order by rl.id desc
     limit 200`,
    params
  );

  return (rows as Array<
    Omit<ReferralLinkRow, "downlineCount" | "approvedDepositAmount" | "createdAt" | "updatedAt"> & {
      downlineCount: string | number;
      approvedDepositAmount: string | number;
      createdAt: string | Date;
      updatedAt: string | Date;
    }
  >).map((row) => ({
    ...row,
    downlineCount: num(row.downlineCount),
    approvedDepositAmount: num(row.approvedDepositAmount),
    createdAt: dateValue(row.createdAt),
    updatedAt: dateValue(row.updatedAt)
  }));
}

export async function getAffiliateRows(filter: ReferralAdminFilter) {
  const where: string[] = [];
  const params: SqlParam[] = [];
  if (filter.status && ["active", "locked", "suspended"].includes(filter.status)) {
    where.push("u.status = ?");
    params.push(filter.status);
  }
  if (filter.q) {
    where.push("(u.username like ? or u.referral_code like ? or rl.code like ?)");
    const like = `%${filter.q}%`;
    params.push(like, like, like);
  }

  const sortMap = {
    username: "u.username",
    downlines: "downlineCount",
    links: "linkCount",
    approvedDeposits: "approvedDepositAmount",
    createdAt: "u.created_at"
  } satisfies Record<ReferralAdminFilter["affiliateSort"], string>;
  const orderBy = `${sortMap[filter.affiliateSort]} ${filter.affiliateDir}`;

  const [rows] = await pool.execute(
    `select
       u.id,
       u.username,
       u.referral_code as referralCode,
       u.status,
       count(distinct rl.id) as linkCount,
       count(distinct child.id) as downlineCount,
       coalesce(sum(case when d.status = 'approved' then d.amount else 0 end), 0) as approvedDepositAmount,
       max(child.created_at) as lastDownlineAt,
       u.created_at as createdAt
     from users u
     left join referral_links rl on rl.owner_user_id = u.id
     left join users child on child.referrer_user_id = u.id
     left join deposits d on d.user_id = child.id
     ${where.length ? `where ${where.join(" and ")}` : ""}
     group by u.id, u.username, u.referral_code, u.status, u.created_at
     order by ${orderBy}, u.id desc
     limit 300`,
    params
  );

  return (rows as Array<
    Omit<AffiliateRow, "linkCount" | "downlineCount" | "approvedDepositAmount" | "lastDownlineAt" | "createdAt"> & {
      linkCount: string | number;
      downlineCount: string | number;
      approvedDepositAmount: string | number;
      lastDownlineAt: string | Date | null;
      createdAt: string | Date;
    }
  >).map((row) => ({
    ...row,
    linkCount: num(row.linkCount),
    downlineCount: num(row.downlineCount),
    approvedDepositAmount: num(row.approvedDepositAmount),
    lastDownlineAt: row.lastDownlineAt ? dateValue(row.lastDownlineAt) : null,
    createdAt: dateValue(row.createdAt)
  }));
}

export async function getAffiliateDepositReportRows(filter: ReferralAdminFilter) {
  const where: string[] = [];
  const params: SqlParam[] = [filter.dateFrom, filter.dateTo];
  if (filter.status && ["active", "locked", "suspended"].includes(filter.status)) {
    where.push("u.status = ?");
    params.push(filter.status);
  }
  if (filter.q) {
    where.push("(u.username like ? or u.referral_code like ?)");
    const like = `%${filter.q}%`;
    params.push(like, like);
  }

  const sortMap = {
    affiliate: "u.username",
    downlines: "downlineCount",
    depositCount: "depositCount",
    approvedAmount: "approvedDepositAmount",
    pendingAmount: "pendingDepositAmount",
    lastDeposit: "lastDepositAt"
  } satisfies Record<ReferralAdminFilter["depositSort"], string>;
  const orderBy = `${sortMap[filter.depositSort]} ${filter.depositDir}`;

  const [rows] = await pool.execute(
    `select
       u.id,
       u.username,
       u.referral_code as referralCode,
       count(distinct child.id) as downlineCount,
       count(distinct d.id) as depositCount,
       coalesce(sum(case when d.status = 'approved' then d.amount else 0 end), 0) as approvedDepositAmount,
       coalesce(sum(case when d.status = 'pending' then d.amount else 0 end), 0) as pendingDepositAmount,
       max(d.created_at) as lastDepositAt
     from users u
     left join users child on child.referrer_user_id = u.id
     left join deposits d on d.user_id = child.id
       and d.created_at >= ?
       and d.created_at < date_add(?, interval 1 day)
     ${where.length ? `where ${where.join(" and ")}` : ""}
     group by u.id, u.username, u.referral_code
     order by ${orderBy}, u.id desc
     limit 300`,
    params
  );

  return (rows as Array<
    Omit<
      AffiliateDepositReportRow,
      "downlineCount" | "depositCount" | "approvedDepositAmount" | "pendingDepositAmount" | "lastDepositAt"
    > & {
      downlineCount: string | number;
      depositCount: string | number;
      approvedDepositAmount: string | number;
      pendingDepositAmount: string | number;
      lastDepositAt: string | Date | null;
    }
  >).map((row) => ({
    ...row,
    downlineCount: num(row.downlineCount),
    depositCount: num(row.depositCount),
    approvedDepositAmount: num(row.approvedDepositAmount),
    pendingDepositAmount: num(row.pendingDepositAmount),
    lastDepositAt: row.lastDepositAt ? dateValue(row.lastDepositAt) : null
  }));
}

export async function getAffiliateDepositDetail(
  affiliateId: number,
  filter: ReferralAdminFilter
): Promise<AffiliateDepositDetail> {
  const [affiliateRows] = await pool.execute(
    `select id, username, referral_code as referralCode, status, created_at as createdAt
     from users
     where id = ?
     limit 1`,
    [affiliateId]
  );
  const affiliate = (affiliateRows as Array<{
    id: number;
    username: string;
    referralCode: string;
    status: "active" | "locked" | "suspended";
    createdAt: string | Date;
  }>)[0];

  if (!affiliate) {
    return {
      affiliate: null,
      rows: [],
      totals: {
        downlines: 0,
        deposits: 0,
        approvedAmount: 0,
        pendingAmount: 0
      }
    };
  }

  const where: string[] = ["child.referrer_user_id = ?"];
  const whereParams: SqlParam[] = [affiliateId];
  if (filter.q) {
    where.push("(child.username like ? or child.referral_code like ? or d.reference like ?)");
    const like = `%${filter.q}%`;
    whereParams.push(like, like, like);
  }
  const params: SqlParam[] = [filter.dateFrom, filter.dateTo, ...whereParams];

  const [rows] = await pool.execute(
    `select
       child.id as downlineId,
       child.username as downlineUsername,
       child.created_at as downlineCreatedAt,
       d.id as depositId,
       d.reference,
       d.method,
       d.amount,
       d.status,
       b.name as bankName,
       d.created_at as depositCreatedAt,
       d.reviewed_at as reviewedAt
     from users child
     left join deposits d on d.user_id = child.id
       and d.created_at >= ?
       and d.created_at < date_add(?, interval 1 day)
     left join banks b on b.id = d.bank_id
     where ${where.join(" and ")}
     order by child.created_at desc, d.created_at desc, child.id desc
     limit 500`,
    params
  );

  const mappedRows = (rows as Array<
    Omit<AffiliateDownlineDepositRow, "amount" | "downlineCreatedAt" | "depositCreatedAt" | "reviewedAt"> & {
      amount: string | number | null;
      downlineCreatedAt: string | Date;
      depositCreatedAt: string | Date | null;
      reviewedAt: string | Date | null;
    }
  >).map((row) => ({
    ...row,
    amount: num(row.amount),
    downlineCreatedAt: dateValue(row.downlineCreatedAt),
    depositCreatedAt: row.depositCreatedAt ? dateValue(row.depositCreatedAt) : null,
    reviewedAt: row.reviewedAt ? dateValue(row.reviewedAt) : null
  }));

  return {
    affiliate: {
      ...affiliate,
      createdAt: dateValue(affiliate.createdAt)
    },
    rows: mappedRows,
    totals: {
      downlines: new Set(mappedRows.map((row) => row.downlineId)).size,
      deposits: mappedRows.filter((row) => row.depositId).length,
      approvedAmount: mappedRows.reduce((total, row) => total + (row.status === "approved" ? row.amount : 0), 0),
      pendingAmount: mappedRows.reduce((total, row) => total + (row.status === "pending" ? row.amount : 0), 0)
    }
  };
}
