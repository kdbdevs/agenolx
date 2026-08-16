import { pool } from "@/lib/db";

export const USER_REFERRAL_PAGE_SIZE = 10;

export type UserReferralDownline = {
  id: number;
  createdAt: string;
};

export type UserReferralHistory = {
  referralCode: string;
  downlines: UserReferralDownline[];
  totalDownlines: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
};

type ReferralOwnerRow = {
  referralCode: string;
};

type CountRow = {
  total: number | string | null;
};

type DownlineRow = {
  id: number;
  createdAt: string | Date;
};

function dateValue(value: string | Date) {
  if (value instanceof Date) return value.toISOString();
  return value;
}

export function parseReferralPage(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const page = Number(rawValue ?? "1");
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export async function getUserReferralHistory(userId: number, requestedPage: number): Promise<UserReferralHistory> {
  const pageSize = USER_REFERRAL_PAGE_SIZE;
  const [ownerRows] = await pool.execute(
    "select referral_code as referralCode from users where id = ? limit 1",
    [userId]
  );
  const owner = (ownerRows as ReferralOwnerRow[])[0];

  const [countRows] = await pool.execute(
    "select count(*) as total from users where referrer_user_id = ?",
    [userId]
  );
  const totalDownlines = Number((countRows as CountRow[])[0]?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalDownlines / pageSize));
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const offset = (currentPage - 1) * pageSize;

  const [downlineRows] = await pool.execute(
    `select id, created_at as createdAt
     from users
     where referrer_user_id = ?
     order by created_at desc, id desc
     limit ${pageSize} offset ${offset}`,
    [userId]
  );

  return {
    referralCode: owner?.referralCode ?? "",
    downlines: (downlineRows as DownlineRow[]).map((row) => ({
      id: Number(row.id),
      createdAt: dateValue(row.createdAt)
    })),
    totalDownlines,
    currentPage,
    totalPages,
    pageSize
  };
}
