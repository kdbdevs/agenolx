"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { pool } from "@/lib/db";

const userStatusSchema = z.object({
  userId: z.coerce.number().int().positive(),
  status: z.enum(["active", "locked", "suspended"])
});

const bankSchema = z.object({
  bankId: z.coerce.number().int().nonnegative().optional(),
  code: z.string().trim().min(1).max(32),
  name: z.string().trim().min(2).max(120),
  type: z.enum(["bank", "e_money"]),
  logoUrl: z.string().trim().max(500).optional().or(z.literal("")),
  depositAccountName: z.string().trim().max(160).optional().or(z.literal("")),
  depositAccountNumber: z.string().trim().max(80).optional().or(z.literal("")),
  isActive: z.boolean()
});

const referralLinkSchema = z.object({
  ownerUserId: z.coerce.number().int().positive(),
  code: z
    .string()
    .trim()
    .max(32)
    .regex(/^[a-zA-Z0-9_-]*$/, "Kode referral hanya boleh huruf, angka, underscore, dan dash")
    .optional()
    .or(z.literal("")),
  label: z.string().trim().max(160).optional().or(z.literal("")),
  isActive: z.boolean()
});

const referralLinkStatusSchema = z.object({
  referralLinkId: z.coerce.number().int().positive(),
  status: z.enum(["active", "disabled"])
});

const reviewDepositSchema = z.object({
  depositId: z.coerce.number().int().positive(),
  status: z.enum(["approved", "rejected", "expired"]),
  adminNotes: z.string().trim().max(1000).optional().or(z.literal(""))
});

const reviewWithdrawalSchema = z.object({
  withdrawalId: z.coerce.number().int().positive(),
  status: z.enum(["approved", "rejected", "cancelled"]),
  adminNotes: z.string().trim().max(1000).optional().or(z.literal(""))
});

const withdrawalSchema = z.object({
  userId: z.coerce.number().int().positive(),
  userBankAccountId: z.coerce.number().int().positive().optional(),
  amount: z.coerce.number().int().min(50000).max(100000000),
  adminNotes: z.string().trim().max(1000).optional().or(z.literal(""))
});

function value(formData: FormData, name: string) {
  const raw = formData.get(name);
  return typeof raw === "string" ? raw : "";
}

function normalizeReferralCode(code: string) {
  return code.trim().replace(/\s+/g, "").toUpperCase();
}

function makeReferralLinkCode() {
  return `REF${randomBytes(4).toString("hex").toUpperCase()}`;
}

async function audit(
  connection: Awaited<ReturnType<typeof pool.getConnection>>,
  adminId: number,
  action: string,
  entityType: string,
  entityId: string | number,
  metadata?: Record<string, unknown>
) {
  await connection.execute(
    `insert into audit_logs (actor_admin_id, action, entity_type, entity_id, metadata)
     values (?, ?, ?, ?, ?)`,
    [adminId || null, action, entityType, String(entityId), metadata ? JSON.stringify(metadata) : null]
  );
}

async function ensureWallet(connection: Awaited<ReturnType<typeof pool.getConnection>>, userId: number) {
  await connection.execute("insert ignore into wallets (user_id, currency) values (?, 'IDR')", [userId]);
  const [rows] = await connection.execute("select id from wallets where user_id = ? and currency = 'IDR' limit 1", [userId]);
  const walletId = Number((rows as Array<{ id: number }>)[0]?.id);
  if (!walletId) throw new Error("Wallet user tidak ditemukan");
  return walletId;
}

async function getWalletBalance(connection: Awaited<ReturnType<typeof pool.getConnection>>, walletId: number) {
  const [rows] = await connection.execute(
    `select coalesce(sum(case when direction = 'credit' then amount when direction = 'debit' then -amount else 0 end), 0) as balance
     from wallet_ledger_entries
     where wallet_id = ?`,
    [walletId]
  );
  return Number((rows as Array<{ balance: string | number }>)[0]?.balance ?? 0);
}

export async function updateUserStatus(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = userStatusSchema.parse({
    userId: value(formData, "userId"),
    status: value(formData, "status")
  });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute("update users set status = ? where id = ?", [parsed.status, parsed.userId]);
    await audit(connection, admin.id, "user.status.update", "user", parsed.userId, { status: parsed.status });
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function saveBank(formData: FormData) {
  const admin = await requireAdmin();
  const bankIdValue = value(formData, "bankId");
  const parsed = bankSchema.parse({
    bankId: bankIdValue ? Number(bankIdValue) : 0,
    code: value(formData, "code"),
    name: value(formData, "name"),
    type: value(formData, "type"),
    logoUrl: value(formData, "logoUrl"),
    depositAccountName: value(formData, "depositAccountName"),
    depositAccountNumber: value(formData, "depositAccountNumber"),
    isActive: formData.has("isActive")
  });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    if (parsed.bankId) {
      await connection.execute(
        `update banks
         set code = ?, name = ?, type = ?, logo_url = ?,
           deposit_account_name = ?, deposit_account_number = ?, is_active = ?
         where id = ?`,
        [
          parsed.code,
          parsed.name,
          parsed.type,
          parsed.logoUrl || null,
          parsed.depositAccountName || null,
          parsed.depositAccountNumber || null,
          parsed.isActive,
          parsed.bankId
        ]
      );
      await audit(connection, admin.id, "bank.update", "bank", parsed.bankId, parsed);
    } else {
      const [result] = await connection.execute(
        `insert into banks (code, name, type, logo_url, deposit_account_name, deposit_account_number, is_active)
         values (?, ?, ?, ?, ?, ?, ?)`,
        [
          parsed.code,
          parsed.name,
          parsed.type,
          parsed.logoUrl || null,
          parsed.depositAccountName || null,
          parsed.depositAccountNumber || null,
          parsed.isActive
        ]
      );
      await audit(connection, admin.id, "bank.create", "bank", Number((result as { insertId: number }).insertId), parsed);
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  revalidatePath("/admin/banks");
}

export async function createReferralLink(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = referralLinkSchema.parse({
    ownerUserId: value(formData, "ownerUserId"),
    code: value(formData, "code"),
    label: value(formData, "label"),
    isActive: formData.has("isActive")
  });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [ownerRows] = await connection.execute(
      "select id, username from users where id = ? and status = 'active' limit 1",
      [parsed.ownerUserId]
    );
    const owner = (ownerRows as Array<{ id: number; username: string }>)[0];
    if (!owner) throw new Error("Affiliator tidak aktif atau tidak ditemukan");

    let code = normalizeReferralCode(parsed.code || "");
    for (let attempt = 0; attempt < 6; attempt += 1) {
      if (!code) code = makeReferralLinkCode();

      const [existingRows] = await connection.execute(
        `select code from referral_links where code = ?
         union all
         select referral_code as code from users where referral_code = ?
         limit 1`,
        [code, code]
      );
      if ((existingRows as unknown[]).length === 0) break;
      if (parsed.code) throw new Error("Kode referral sudah digunakan");
      code = "";
    }

    if (!code) throw new Error("Gagal membuat kode referral unik");

    const [result] = await connection.execute(
      `insert into referral_links (code, owner_user_id, label, status, created_by)
       values (?, ?, ?, ?, ?)`,
      [code, parsed.ownerUserId, parsed.label || null, parsed.isActive ? "active" : "disabled", admin.id || null]
    );
    const referralLinkId = Number((result as { insertId: number }).insertId);
    await audit(connection, admin.id, "referral_link.create", "referral_link", referralLinkId, {
      code,
      ownerUserId: parsed.ownerUserId,
      ownerUsername: owner.username,
      status: parsed.isActive ? "active" : "disabled"
    });
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  revalidatePath("/admin/referrals");
}

export async function updateReferralLinkStatus(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = referralLinkStatusSchema.parse({
    referralLinkId: value(formData, "referralLinkId"),
    status: value(formData, "status")
  });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute("update referral_links set status = ? where id = ?", [parsed.status, parsed.referralLinkId]);
    await audit(connection, admin.id, "referral_link.status.update", "referral_link", parsed.referralLinkId, {
      status: parsed.status
    });
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  revalidatePath("/admin/referrals");
}

export async function reviewDeposit(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = reviewDepositSchema.parse({
    depositId: value(formData, "depositId"),
    status: value(formData, "status"),
    adminNotes: value(formData, "adminNotes")
  });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.execute(
      "select id, user_id, amount, status, reference from deposits where id = ? for update",
      [parsed.depositId]
    );
    const deposit = (rows as Array<{ id: number; user_id: number; amount: string | number; status: string; reference: string | null }>)[0];
    if (!deposit) throw new Error("Deposit tidak ditemukan");
    if (deposit.status !== "pending") throw new Error("Deposit sudah diproses");

    if (parsed.status === "approved") {
      const walletId = await ensureWallet(connection, deposit.user_id);
      await connection.execute(
        `insert into wallet_ledger_entries (wallet_id, direction, amount, source_type, source_id, idempotency_key, metadata)
         values (?, 'credit', ?, 'deposit', ?, ?, ?)`,
        [
          walletId,
          deposit.amount,
          String(deposit.id),
          `deposit:${deposit.id}:approved`,
          JSON.stringify({ reference: deposit.reference, reviewedBy: admin.username })
        ]
      );
    }

    await connection.execute(
      "update deposits set status = ?, reviewed_by = ?, reviewed_at = current_timestamp, admin_notes = ? where id = ?",
      [parsed.status, admin.id || null, parsed.adminNotes || null, parsed.depositId]
    );
    await audit(connection, admin.id, `deposit.${parsed.status}`, "deposit", parsed.depositId, {
      amount: Number(deposit.amount),
      reference: deposit.reference,
      notes: parsed.adminNotes || null
    });
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  revalidatePath("/admin/deposits");
  revalidatePath("/admin");
}

export async function createWithdrawal(formData: FormData) {
  const admin = await requireAdmin();
  const account = value(formData, "userBankAccountId");
  const parsed = withdrawalSchema.parse({
    userId: value(formData, "userId"),
    userBankAccountId: account ? Number(account) : undefined,
    amount: value(formData, "amount"),
    adminNotes: value(formData, "adminNotes")
  });
  const reference = `WD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    if (parsed.userBankAccountId) {
      const [accountRows] = await connection.execute(
        "select id from user_bank_accounts where id = ? and user_id = ? limit 1",
        [parsed.userBankAccountId, parsed.userId]
      );
      if ((accountRows as unknown[]).length === 0) {
        throw new Error("Rekening tidak cocok dengan user yang dipilih");
      }
    }
    const [result] = await connection.execute(
      `insert into withdrawals (user_id, user_bank_account_id, amount, status, reference, admin_notes)
       values (?, ?, ?, 'pending', ?, ?)`,
      [parsed.userId, parsed.userBankAccountId ?? null, parsed.amount, reference, parsed.adminNotes || null]
    );
    const withdrawalId = Number((result as { insertId: number }).insertId);
    await audit(connection, admin.id, "withdrawal.create", "withdrawal", withdrawalId, {
      userId: parsed.userId,
      amount: parsed.amount,
      reference
    });
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  revalidatePath("/admin/withdrawals");
  revalidatePath("/admin");
}

export async function reviewWithdrawal(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = reviewWithdrawalSchema.parse({
    withdrawalId: value(formData, "withdrawalId"),
    status: value(formData, "status"),
    adminNotes: value(formData, "adminNotes")
  });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.execute(
      "select id, user_id, amount, status, reference from withdrawals where id = ? for update",
      [parsed.withdrawalId]
    );
    const withdrawal = (rows as Array<{ id: number; user_id: number; amount: string | number; status: string; reference: string | null }>)[0];
    if (!withdrawal) throw new Error("Withdrawal tidak ditemukan");
    if (withdrawal.status !== "pending") throw new Error("Withdrawal sudah diproses");

    if (parsed.status === "approved") {
      const walletId = await ensureWallet(connection, withdrawal.user_id);
      const balance = await getWalletBalance(connection, walletId);
      const amount = Number(withdrawal.amount);
      if (balance < amount) throw new Error("Saldo user tidak cukup untuk withdrawal");

      await connection.execute(
        `insert into wallet_ledger_entries (wallet_id, direction, amount, source_type, source_id, idempotency_key, metadata)
         values (?, 'debit', ?, 'withdrawal', ?, ?, ?)`,
        [
          walletId,
          withdrawal.amount,
          String(withdrawal.id),
          `withdrawal:${withdrawal.id}:approved`,
          JSON.stringify({ reference: withdrawal.reference, reviewedBy: admin.username })
        ]
      );
    }

    await connection.execute(
      "update withdrawals set status = ?, reviewed_by = ?, reviewed_at = current_timestamp, admin_notes = ? where id = ?",
      [parsed.status, admin.id || null, parsed.adminNotes || null, parsed.withdrawalId]
    );
    await audit(connection, admin.id, `withdrawal.${parsed.status}`, "withdrawal", parsed.withdrawalId, {
      amount: Number(withdrawal.amount),
      reference: withdrawal.reference,
      notes: parsed.adminNotes || null
    });
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
  revalidatePath("/admin/withdrawals");
  revalidatePath("/admin");
}
