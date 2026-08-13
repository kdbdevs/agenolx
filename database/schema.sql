create table if not exists users (
  id bigint unsigned not null auto_increment primary key,
  username varchar(50) not null,
  email varchar(255) null,
  phone varchar(32) null,
  password_hash varchar(255) not null,
  referral_code varchar(32) not null,
  status enum('active', 'locked', 'suspended') not null default 'active',
  locale varchar(8) not null default 'id',
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  unique key users_username_unique (username),
  unique key users_referral_code_unique (referral_code),
  unique key users_email_unique (email)
);

create table if not exists banks (
  id bigint unsigned not null auto_increment primary key,
  code varchar(32) not null,
  name varchar(120) not null,
  type enum('bank', 'e_money') not null default 'bank',
  logo_url varchar(500) null,
  is_active boolean not null default true,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  unique key banks_code_unique (code)
);

alter table banks
  add column type enum('bank', 'e_money') not null default 'bank' after name;

create table if not exists user_bank_accounts (
  id bigint unsigned not null auto_increment primary key,
  user_id bigint unsigned not null,
  bank_id bigint unsigned not null,
  account_name varchar(160) not null,
  account_number varchar(80) not null,
  status enum('pending', 'verified', 'rejected') not null default 'pending',
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  key user_bank_accounts_user_idx (user_id)
);

create table if not exists wallets (
  id bigint unsigned not null auto_increment primary key,
  user_id bigint unsigned not null,
  currency varchar(8) not null default 'IDR',
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  unique key wallets_user_currency_unique (user_id, currency)
);

create table if not exists wallet_ledger_entries (
  id bigint unsigned not null auto_increment primary key,
  wallet_id bigint unsigned not null,
  direction enum('credit', 'debit') not null,
  amount decimal(18,2) not null,
  source_type varchar(64) not null,
  source_id varchar(120) not null,
  idempotency_key varchar(160) not null,
  metadata json null,
  created_at timestamp not null default current_timestamp,
  unique key wallet_ledger_idempotency_unique (idempotency_key),
  key wallet_ledger_wallet_idx (wallet_id)
);

create table if not exists deposits (
  id bigint unsigned not null auto_increment primary key,
  user_id bigint unsigned not null,
  method enum('bank_transfer', 'qris', 'qris_automatic') not null,
  amount decimal(18,2) not null,
  status enum('pending', 'approved', 'rejected', 'expired') not null default 'pending',
  reference varchar(160) null,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  key deposits_user_status_idx (user_id, status)
);

create table if not exists game_providers (
  id bigint unsigned not null auto_increment primary key,
  slug varchar(120) not null,
  name varchar(160) not null,
  category varchar(64) not null,
  logo_url varchar(500) null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  unique key game_providers_slug_unique (slug)
);

create table if not exists games (
  id bigint unsigned not null auto_increment primary key,
  provider_id bigint unsigned null,
  slug varchar(160) not null,
  title varchar(200) not null,
  category varchar(64) not null,
  image_url varchar(500) null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  unique key games_slug_unique (slug),
  key games_category_idx (category)
);

create table if not exists promotions (
  id bigint unsigned not null auto_increment primary key,
  slug varchar(160) not null,
  title varchar(255) not null,
  category varchar(64) not null,
  teaser varchar(1000) null,
  image_url varchar(500) null,
  is_active boolean not null default true,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  unique key promotions_slug_unique (slug)
);
