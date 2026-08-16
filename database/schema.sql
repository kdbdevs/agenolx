create table if not exists users (
  id bigint unsigned not null auto_increment primary key,
  username varchar(50) not null,
  email varchar(255) null,
  phone varchar(32) null,
  password_hash varchar(255) not null,
  referral_code varchar(32) not null,
  referrer_user_id bigint unsigned null,
  referral_link_id bigint unsigned null,
  status enum('active', 'locked', 'suspended') not null default 'active',
  locale varchar(8) not null default 'id',
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  unique key users_username_unique (username),
  unique key users_referral_code_unique (referral_code),
  unique key users_email_unique (email)
);

alter table users
  add column referrer_user_id bigint unsigned null after referral_code;

alter table users
  add column referral_link_id bigint unsigned null after referrer_user_id;

create table if not exists referral_links (
  id bigint unsigned not null auto_increment primary key,
  code varchar(32) not null,
  owner_user_id bigint unsigned not null,
  label varchar(160) null,
  status enum('active', 'disabled') not null default 'active',
  created_by bigint unsigned null,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  unique key referral_links_code_unique (code),
  key referral_links_owner_idx (owner_user_id),
  key referral_links_status_idx (status)
);

create table if not exists banks (
  id bigint unsigned not null auto_increment primary key,
  code varchar(32) not null,
  name varchar(120) not null,
  type enum('bank', 'e_money') not null default 'bank',
  logo_url varchar(500) null,
  deposit_account_name varchar(160) null,
  deposit_account_number varchar(80) null,
  is_active boolean not null default true,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  unique key banks_code_unique (code)
);

alter table banks
  add column type enum('bank', 'e_money') not null default 'bank' after name;

alter table banks
  add column deposit_account_name varchar(160) null after logo_url;

alter table banks
  add column deposit_account_number varchar(80) null after deposit_account_name;

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
  bank_id bigint unsigned null,
  amount decimal(18,2) not null,
  status enum('pending', 'approved', 'rejected', 'expired') not null default 'pending',
  reference varchar(160) null,
  note varchar(500) null,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  key deposits_user_status_idx (user_id, status)
);

alter table deposits
  add column bank_id bigint unsigned null after method;

alter table deposits
  add column note varchar(500) null after reference;

alter table deposits
  add column reviewed_by bigint unsigned null after reference;

alter table deposits
  add column reviewed_at timestamp null after reviewed_by;

alter table deposits
  add column admin_notes varchar(1000) null after reviewed_at;

create table if not exists withdrawals (
  id bigint unsigned not null auto_increment primary key,
  user_id bigint unsigned not null,
  user_bank_account_id bigint unsigned null,
  amount decimal(18,2) not null,
  status enum('pending', 'approved', 'rejected', 'cancelled') not null default 'pending',
  reference varchar(160) null,
  admin_notes varchar(1000) null,
  reviewed_by bigint unsigned null,
  reviewed_at timestamp null,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  key withdrawals_user_status_idx (user_id, status)
);

create table if not exists admin_users (
  id bigint unsigned not null auto_increment primary key,
  username varchar(80) not null,
  password_hash varchar(255) not null,
  display_name varchar(160) null,
  role enum('owner', 'manager', 'finance') not null default 'owner',
  status enum('active', 'disabled') not null default 'active',
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  unique key admin_users_username_unique (username)
);

create table if not exists audit_logs (
  id bigint unsigned not null auto_increment primary key,
  actor_admin_id bigint unsigned null,
  action varchar(120) not null,
  entity_type varchar(80) not null,
  entity_id varchar(120) not null,
  metadata json null,
  created_at timestamp not null default current_timestamp,
  key audit_logs_entity_idx (entity_type, entity_id),
  key audit_logs_actor_idx (actor_admin_id)
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
