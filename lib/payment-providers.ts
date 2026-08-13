export type PaymentMethod = "bank" | "e-money";

export type PaymentProvider = {
  code: string;
  name: string;
  method: PaymentMethod;
};

export const BANK_PROVIDERS = [
  { code: "54", name: "BCA", method: "bank" },
  { code: "40", name: "BRI", method: "bank" },
  { code: "39", name: "BNI", method: "bank" },
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
