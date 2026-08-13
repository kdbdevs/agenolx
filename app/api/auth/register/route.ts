import bcrypt from "bcryptjs";
import { NextResponse, type NextRequest } from "next/server";
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

function redirectWithError(request: NextRequest, message: string) {
  void request;
  return redirectRelative(withSearchParam("/register", "error", message));
}

function makeReferralCode(username: string) {
  const prefix = username.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase() || "AGEN";
  return `${prefix}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
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

    let userId = 0;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const referralCode = makeReferralCode(input.username);
      try {
        const [result] = await connection.execute(
          `insert into users (username, email, phone, password_hash, referral_code, status, locale)
           values (?, ?, ?, ?, ?, 'active', 'id')`,
          [
            input.username,
            input.email || null,
            input.phone || null,
            passwordHash,
            referralCode
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
    referralCode: field(formData, "referralCode")
  });

  if (!parsed.success) {
    return redirectWithError(request, parsed.error.issues[0]?.message ?? "Data register tidak valid");
  }

  try {
    const userId = await insertUser(parsed.data);
    const response = redirectRelative("/");
    const token = await createSessionToken({ userId, username: parsed.data.username }, true);
    setAuthCookie(response, token, true);
    return response;
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "ER_DUP_ENTRY") {
      return redirectWithError(request, "Username atau email sudah terdaftar");
    }
    if ((error as Error).message === "INVALID_PAYMENT_PROVIDER") {
      return redirectWithError(request, "Bank atau e-money tidak valid");
    }
    console.error(error);
    return redirectWithError(request, "Register gagal diproses");
  }
}
