import {
  bigint,
  boolean,
  decimal,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/mysql-core";

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
};

export const users = mysqlTable(
  "users",
  {
    id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
    username: varchar("username", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 32 }),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    referralCode: varchar("referral_code", { length: 32 }).notNull(),
    status: mysqlEnum("status", ["active", "locked", "suspended"]).default("active").notNull(),
    locale: varchar("locale", { length: 8 }).default("id").notNull(),
    ...timestamps
  },
  (table) => [
    uniqueIndex("users_username_unique").on(table.username),
    uniqueIndex("users_referral_code_unique").on(table.referralCode),
    uniqueIndex("users_email_unique").on(table.email)
  ]
);

export const banks = mysqlTable(
  "banks",
  {
    id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
    code: varchar("code", { length: 32 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    type: mysqlEnum("type", ["bank", "e_money"]).default("bank").notNull(),
    logoUrl: varchar("logo_url", { length: 500 }),
    depositAccountName: varchar("deposit_account_name", { length: 160 }),
    depositAccountNumber: varchar("deposit_account_number", { length: 80 }),
    isActive: boolean("is_active").default(true).notNull(),
    ...timestamps
  },
  (table) => [uniqueIndex("banks_code_unique").on(table.code)]
);

export const userBankAccounts = mysqlTable(
  "user_bank_accounts",
  {
    id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
    userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
    bankId: bigint("bank_id", { mode: "number", unsigned: true }).notNull(),
    accountName: varchar("account_name", { length: 160 }).notNull(),
    accountNumber: varchar("account_number", { length: 80 }).notNull(),
    status: mysqlEnum("status", ["pending", "verified", "rejected"]).default("pending").notNull(),
    ...timestamps
  },
  (table) => [index("user_bank_accounts_user_idx").on(table.userId)]
);

export const wallets = mysqlTable(
  "wallets",
  {
    id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
    userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
    currency: varchar("currency", { length: 8 }).default("IDR").notNull(),
    ...timestamps
  },
  (table) => [uniqueIndex("wallets_user_currency_unique").on(table.userId, table.currency)]
);

export const walletLedgerEntries = mysqlTable(
  "wallet_ledger_entries",
  {
    id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
    walletId: bigint("wallet_id", { mode: "number", unsigned: true }).notNull(),
    direction: mysqlEnum("direction", ["credit", "debit"]).notNull(),
    amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
    sourceType: varchar("source_type", { length: 64 }).notNull(),
    sourceId: varchar("source_id", { length: 120 }).notNull(),
    idempotencyKey: varchar("idempotency_key", { length: 160 }).notNull(),
    metadata: json("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  (table) => [
    uniqueIndex("wallet_ledger_idempotency_unique").on(table.idempotencyKey),
    index("wallet_ledger_wallet_idx").on(table.walletId)
  ]
);

export const deposits = mysqlTable(
  "deposits",
  {
    id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
    userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
    method: mysqlEnum("method", ["bank_transfer", "qris", "qris_automatic"]).notNull(),
    bankId: bigint("bank_id", { mode: "number", unsigned: true }),
    amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
    status: mysqlEnum("status", ["pending", "approved", "rejected", "expired"]).default("pending").notNull(),
    reference: varchar("reference", { length: 160 }),
    note: varchar("note", { length: 500 }),
    ...timestamps
  },
  (table) => [index("deposits_user_status_idx").on(table.userId, table.status)]
);

export const gameProviders = mysqlTable(
  "game_providers",
  {
    id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    category: varchar("category", { length: 64 }).notNull(),
    logoUrl: varchar("logo_url", { length: 500 }),
    sortOrder: int("sort_order").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    ...timestamps
  },
  (table) => [uniqueIndex("game_providers_slug_unique").on(table.slug)]
);

export const games = mysqlTable(
  "games",
  {
    id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
    providerId: bigint("provider_id", { mode: "number", unsigned: true }),
    slug: varchar("slug", { length: 160 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    category: varchar("category", { length: 64 }).notNull(),
    imageUrl: varchar("image_url", { length: 500 }),
    sortOrder: int("sort_order").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    ...timestamps
  },
  (table) => [
    uniqueIndex("games_slug_unique").on(table.slug),
    index("games_category_idx").on(table.category)
  ]
);

export const promotionsTable = mysqlTable(
  "promotions",
  {
    id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    category: varchar("category", { length: 64 }).notNull(),
    teaser: varchar("teaser", { length: 1000 }),
    imageUrl: varchar("image_url", { length: 500 }),
    isActive: boolean("is_active").default(true).notNull(),
    ...timestamps
  },
  (table) => [uniqueIndex("promotions_slug_unique").on(table.slug)]
);
