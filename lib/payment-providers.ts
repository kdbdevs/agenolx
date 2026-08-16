import { pool } from "./db";

export type PaymentMethod = "bank" | "e-money";
export type PaymentProviderType = "bank" | "e_money";

export type PaymentProvider = {
  code: string;
  name: string;
  method: PaymentMethod;
  logoUrl?: string;
};

export type DepositPaymentTarget = {
  id: number;
  code: string;
  name: string;
  method: PaymentMethod;
  logoUrl: string | null;
  depositAccountName: string | null;
  depositAccountNumber: string | null;
};

export const BANK_PROVIDERS = [
  { code: "54", name: "BCA", method: "bank", logoUrl: "/all_files/BCA.svg" },
  { code: "40", name: "BRI", method: "bank", logoUrl: "/all_files/BRI.svg" },
  { code: "39", name: "BNI", method: "bank", logoUrl: "/all_files/BNI.svg" },
  { code: "38", name: "Mandiri", method: "bank" },
  { code: "63", name: "Jago", method: "bank" },
  { code: "53", name: "HSBC", method: "bank" },
  { code: "65", name: "Seabank", method: "bank" },
  { code: "55", name: "BSI", method: "bank" },
  { code: "47", name: "Danamon", method: "bank" },
  { code: "41", name: "Permata", method: "bank" },
  { code: "46", name: "CIMB", method: "bank" },
  { code: "43", name: "Panin", method: "bank" },
  { code: "66", name: "BANK ALADIN", method: "bank" },
  { code: "67", name: "BANK ALLO", method: "bank" },
  { code: "68", name: "BANK BTN", method: "bank" },
  { code: "73", name: "BCA DIGITAL", method: "bank" },
  { code: "69", name: "BANK DKI", method: "bank" },
  { code: "51", name: "Sinarmas", method: "bank" },
  { code: "70", name: "BANK MUAMALAT", method: "bank" },
  { code: "72", name: "BANK UOB", method: "bank" },
  { code: "74", name: "Other Banks", method: "bank" },
  { code: "42", name: "Maybank", method: "bank" },
  { code: "44", name: "BII", method: "bank" }
] as const satisfies readonly PaymentProvider[];

export const E_MONEY_PROVIDERS = [
  { code: "57", name: "DANA", method: "e-money" },
  { code: "56", name: "OVO", method: "e-money" },
  { code: "59", name: "Gopay", method: "e-money" },
  { code: "61", name: "SAKUKU", method: "e-money" },
  { code: "58", name: "LINKAJA", method: "e-money" }
] as const satisfies readonly PaymentProvider[];

export const PAYMENT_PROVIDERS = [...BANK_PROVIDERS, ...E_MONEY_PROVIDERS] as const;

export function findPaymentProvider(method: PaymentMethod, code: string) {
  return PAYMENT_PROVIDERS.find((provider) => provider.method === method && provider.code === code);
}

export function paymentMethodToProviderType(method: PaymentMethod): PaymentProviderType {
  return method === "e-money" ? "e_money" : "bank";
}

export function providerTypeToPaymentMethod(type: PaymentProviderType): PaymentMethod {
  return type === "e_money" ? "e-money" : "bank";
}

export function splitPaymentProviders(providers: readonly PaymentProvider[]) {
  return {
    bankProviders: providers.filter((provider) => provider.method === "bank"),
    eMoneyProviders: providers.filter((provider) => provider.method === "e-money")
  };
}

export async function getActivePaymentProviders() {
  const [rows] = await pool.query(
    `select code, name, type
     from banks
     where is_active = true and type in ('bank', 'e_money')
     order by id`
  );

  return (rows as Array<{ code: string; name: string; type: PaymentProviderType }>).map((row) => ({
    code: row.code,
    name: row.name,
    method: providerTypeToPaymentMethod(row.type)
  }));
}

export async function getActiveDepositTargets(method: "bank_transfer" | "qris") {
  if (method === "qris") {
    return [
      {
        id: 0,
        code: "QRIS",
        name: "QRIS Payment",
        method: "e-money" as PaymentMethod,
        logoUrl: "/deposit_files/logo-qris.png",
        depositAccountName: null,
        depositAccountNumber: null
      }
    ] satisfies DepositPaymentTarget[];
  }

  const [rows] = await pool.query(
    `select id, code, name, type, logo_url as logoUrl,
       deposit_account_name as depositAccountName,
       deposit_account_number as depositAccountNumber
     from banks
     where is_active = true and type = 'bank'
     order by id`
  );

  return (rows as Array<{
    id: number;
    code: string;
    name: string;
    type: PaymentProviderType;
    logoUrl: string | null;
    depositAccountName: string | null;
    depositAccountNumber: string | null;
  }>).map((row) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    method: providerTypeToPaymentMethod(row.type),
    logoUrl: row.logoUrl,
    depositAccountName: row.depositAccountName,
    depositAccountNumber: row.depositAccountNumber
  }));
}
