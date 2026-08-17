import bcrypt from "bcryptjs";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { pool } from "@/lib/db";
import { createSessionToken, setAuthCookie } from "@/lib/auth";
import { paymentMethodToProviderType } from "@/lib/payment-providers";
import { redirectRelative, withSearchParam } from "@/lib/redirect";

const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username minimal 3 karakter")
      .max(50, "Username maksimal 50 karakter")
      .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[a-zA-Z]/, "Password wajib memiliki huruf")
      .regex(/[0-9]/, "Password wajib memiliki angka"),
    passwordConfirm: z.string(),
    email: z.string().trim().email("Email tidak valid").optional().or(z.literal("")),
    phone: z.string().trim().max(32).optional().or(z.literal("")),
    paymentMethod: z.enum(["bank", "e-money"], { message: "Metode pembayaran wajib dipilih" }),
    bankCode: z.string().trim().optional().or(z.literal("")),
    eMoneyCode: z.string().trim().optional().or(z.literal("")),
    accountName: z.string().trim().min(2, "Nama rekening wajib diisi").max(160, "Nama rekening terlalu panjang"),
    accountNumber: z
      .string()
      .trim()
      .min(5, "Nomor rekening wajib diisi")
      .max(80, "Nomor rekening terlalu panjang")
      .regex(/^[0-9+\-\s.]+$/, "Nomor rekening hanya boleh angka dan simbol umum"),
    referralCode: z.string().trim().max(32).optional().or(z.literal(""))
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Konfirmasi password tidak sama",
    path: ["passwordConfirm"]
  })
  .refine((data) => Boolean(data.paymentMethod === "bank" ? data.bankCode : data.eMoneyCode), {
    message: "Bank atau e-money wajib dipilih",
    path: ["paymentMethod"]
  });

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function redirectWithError(request: NextRequest, message: string, fieldName?: string, referralCode?: string) {
  void request;
  let target = "/register";
  if (referralCode) {
    target = withSearchParam(target, "ref", referralCode);
  }
  target = withSearchParam(target, "error", message);
  if (fieldName) {
    target = withSearchParam(target, "field", fieldName);
  }
  return redirectRelative(target);
}

function makeReferralCode(username: string) {
  const prefix = username.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase() || "AGEN";
  return `${prefix}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

type ReferralTarget = {
  referrerUserId: number;
  referralLinkId: number | null;
};

async function usernameExists(username: string) {
  const [rows] = await pool.execute("select id from users where username = ? limit 1", [username]);
  return Boolean((rows as Array<{ id: number }>)[0]);
}

function duplicateField(error: unknown) {
  const message = `${(error as { message?: string; sqlMessage?: string }).message ?? ""} ${
    (error as { sqlMessage?: string }).sqlMessage ?? ""
  }`;
  if (/users_username_unique|username/i.test(message)) return "username";
  if (/users_email_unique|email/i.test(message)) return "email";
  return undefined;
}

async function resolveReferralTarget(
  connection: Awaited<ReturnType<typeof pool.getConnection>>,
  referralCode: string
): Promise<ReferralTarget | null> {
  const code = referralCode.trim();
  if (!code) return null;

  const [linkRows] = await connection.execute(
    `select rl.id as referralLinkId, rl.owner_user_id as referrerUserId
     from referral_links rl
     join users u on u.id = rl.owner_user_id
     where rl.code = ? and rl.status = 'active' and u.status = 'active'
     limit 1`,
    [code]
  );
  const link = (linkRows as Array<{ referralLinkId: number; referrerUserId: number }>)[0];
  if (link) {
    return {
      referrerUserId: Number(link.referrerUserId),
      referralLinkId: Number(link.referralLinkId)
    };
  }

  const [userRows] = await connection.execute(
    "select id as referrerUserId from users where referral_code = ? and status = 'active' limit 1",
    [code]
  );
  const user = (userRows as Array<{ referrerUserId: number }>)[0];
  if (!user) return null;

  return {
    referrerUserId: Number(user.referrerUserId),
    referralLinkId: null
  };
}

async function insertUser(input: z.infer<typeof registerSchema>) {
  const passwordHash = await bcrypt.hash(input.password, 12);
  const connection = await pool.getConnection();
  const providerCode = input.paymentMethod === "bank" ? input.bankCode : input.eMoneyCode;
  const providerType = paymentMethodToProviderType(input.paymentMethod);

  if (!providerCode) {
    throw new Error("INVALID_PAYMENT_PROVIDER");
  }

  try {
    await connection.beginTransaction();

    const [providerRows] = await connection.execute(
      "select id from banks where code = ? and type = ? and is_active = true limit 1",
      [providerCode, providerType]
    );
    const bankId = Number((providerRows as Array<{ id: number }>)[0]?.id);
    if (!bankId) {
      throw new Error("INVALID_PAYMENT_PROVIDER");
    }

    const referralTarget = await resolveReferralTarget(connection, input.referralCode ?? "");
    if (input.referralCode && !referralTarget) {
      throw new Error("INVALID_REFERRAL_CODE");
    }

    let userId = 0;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const referralCode = makeReferralCode(input.username);
      try {
        const [result] = await connection.execute(
          `insert into users
             (username, email, phone, password_hash, referral_code, referrer_user_id, referral_link_id, status, locale)
           values (?, ?, ?, ?, ?, ?, ?, 'active', 'id')`,
          [
            input.username,
            input.email || null,
            input.phone || null,
            passwordHash,
            referralCode,
            referralTarget?.referrerUserId ?? null,
            referralTarget?.referralLinkId ?? null
          ]
        );
        userId = Number((result as { insertId: number }).insertId);
        break;
      } catch (error) {
        const code = (error as { code?: string }).code;
        if (code === "ER_DUP_ENTRY" && attempt < 4) continue;
        throw error;
      }
    }

    if (!userId) {
      throw new Error("Gagal membuat user");
    }

    await connection.execute(
      `insert into user_bank_accounts (user_id, bank_id, account_name, account_number, status)
       values (?, ?, ?, ?, 'pending')`,
      [userId, bankId, input.accountName, input.accountNumber]
    );
    await connection.execute("insert into wallets (user_id, currency) values (?, 'IDR')", [userId]);
    await connection.commit();
    return userId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const referralCode = field(formData, "referralCode");
  const parsed = registerSchema.safeParse({
    username: field(formData, "username"),
    password: field(formData, "password"),
    passwordConfirm: field(formData, "passwordConfirm"),
    email: field(formData, "email"),
    phone: field(formData, "phone"),
    paymentMethod: field(formData, "paymentMethod"),
    bankCode: field(formData, "bankCode"),
    eMoneyCode: field(formData, "eMoneyCode"),
    accountName: field(formData, "accountName"),
    accountNumber: field(formData, "accountNumber"),
    referralCode
  });

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return redirectWithError(
      request,
      issue?.message ?? "Data register tidak valid",
      String(issue?.path[0] ?? ""),
      referralCode
    );
  }

  try {
    if (await usernameExists(parsed.data.username)) {
      return redirectWithError(
        request,
        "Username sudah digunakan. Silahkan gunakan username lain.",
        "username",
        parsed.data.referralCode
      );
    }
    const userId = await insertUser(parsed.data);
    const response = redirectRelative("/");
    const token = await createSessionToken({ userId, username: parsed.data.username }, true);
    setAuthCookie(response, token, true);
    return response;
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "ER_DUP_ENTRY") {
      const fieldName = duplicateField(error);
      if (fieldName === "username") {
        return redirectWithError(
          request,
          "Username sudah digunakan. Silahkan gunakan username lain.",
          "username",
          parsed.data.referralCode
        );
      }
      if (fieldName === "email") {
        return redirectWithError(request, "Email sudah terdaftar.", "email", parsed.data.referralCode);
      }
      return redirectWithError(request, "Username atau email sudah terdaftar", undefined, parsed.data.referralCode);
    }
    if ((error as Error).message === "INVALID_PAYMENT_PROVIDER") {
      return redirectWithError(request, "Bank atau e-money tidak valid", "paymentMethod", parsed.data.referralCode);
    }
    if ((error as Error).message === "INVALID_REFERRAL_CODE") {
      return redirectWithError(request, "Kode referral tidak valid atau sudah tidak aktif", "referralCode", parsed.data.referralCode);
    }
    console.error(error);
    return redirectWithError(request, "Register gagal diproses", undefined, parsed.data.referralCode);
  }
}
