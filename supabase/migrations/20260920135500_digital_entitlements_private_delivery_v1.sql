-- Novidades Digital — entitlement and private delivery core v1

create table if not exists public.digital_checkout_intents (
  reference text primary key,
  session_id text unique,
  product_sku text not null,
  product_slug text not null,
  customer_email text not null,
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  status text not null default 'creating'
    check (status in ('creating','pending','processing','succeeded','failed','canceled','expired')),
  transaction_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.digital_entitlements (
  id uuid primary key default gen_random_uuid(),
  product_sku text not null,
  customer_email text not null,
  xpayments_reference text not null references public.digital_checkout_intents(reference) on delete restrict,
  transaction_id text,
  status text not null default 'active'
    check (status in ('active','revoked','refunded','expired')),
  granted_at timestamptz not null default now(),
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(product_sku, xpayments_reference)
);

create index if not exists digital_entitlements_email_idx
  on public.digital_entitlements (lower(customer_email), status);

create table if not exists public.digital_assets (
  id uuid primary key default gen_random_uuid(),
  product_sku text not null,
  version text not null,
  display_name text not null,
  bucket_id text not null default 'novidades-digital',
  object_path text not null,
  content_type text,
  active boolean not null default false,
  sort_order integer not null default 100,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(bucket_id, object_path)
);

create index if not exists digital_assets_product_idx
  on public.digital_assets(product_sku, active, sort_order);

create table if not exists public.digital_webhook_config (
  store_code text primary key,
  signing_secret text not null default encode(gen_random_bytes(32), 'hex'),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.digital_webhook_config(store_code)
values ('NOVIDADES-BRL')
on conflict (store_code) do nothing;

alter table public.digital_checkout_intents enable row level security;
alter table public.digital_entitlements enable row level security;
alter table public.digital_assets enable row level security;
alter table public.digital_webhook_config enable row level security;

revoke all on public.digital_checkout_intents from anon, authenticated;
revoke all on public.digital_entitlements from anon, authenticated;
revoke all on public.digital_assets from anon, authenticated;
revoke all on public.digital_webhook_config from anon, authenticated;

grant all on public.digital_checkout_intents to service_role;
grant all on public.digital_entitlements to service_role;
grant all on public.digital_assets to service_role;
grant all on public.digital_webhook_config to service_role;

insert into storage.buckets(
  id,name,public,file_size_limit,allowed_mime_types
)
values (
  'novidades-digital',
  'novidades-digital',
  false,
  104857600,
  array[
    'application/pdf',
    'application/zip',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]::text[]
)
on conflict (id) do update set
  public=false,
  file_size_limit=excluded.file_size_limit,
  allowed_mime_types=excluded.allowed_mime_types,
  updated_at=now();

insert into public.digital_assets(product_sku,version,display_name,object_path,content_type,active,sort_order)
values
 ('DIGITAL-CCOS-001','1.0','00 — Read Me First','dp-001/v1.0/00_READ-ME-FIRST_Conversion-Content-OS_v1.0.pdf','application/pdf',false,10),
 ('DIGITAL-CCOS-001','1.0','01 — Conversion Content OS Guide','dp-001/v1.0/01_Conversion-Content-OS_Guide_v1.0.pdf','application/pdf',false,20),
 ('DIGITAL-CCOS-001','1.0','02 — Conversion Workbook','dp-001/v1.0/02_Conversion-Workbook_v1.0.pdf','application/pdf',false,30),
 ('DIGITAL-CCOS-001','1.0','03 — Hook Library — 300 Structures','dp-001/v1.0/03_Hook-Library_300-Structures_v1.0.pdf','application/pdf',false,40),
 ('DIGITAL-CCOS-001','1.0','04 — Prompt Library','dp-001/v1.0/04_Prompt-Library_v1.0.pdf','application/pdf',false,50),
 ('DIGITAL-CCOS-001','1.0','05 — CTA & Offer Swipe File','dp-001/v1.0/05_CTA-Offer-Swipe-File_v1.0.pdf','application/pdf',false,60),
 ('DIGITAL-CCOS-001','1.0','06 — Content Repurposing Matrix','dp-001/v1.0/06_Content-Repurposing-Matrix_v1.0.pdf','application/pdf',false,70),
 ('DIGITAL-CCOS-001','1.0','07 — Customer License & Terms','dp-001/v1.0/07_Customer-License-Terms_v1.0.pdf','application/pdf',false,80)
on conflict (bucket_id,object_path) do update set
  display_name=excluded.display_name,
  content_type=excluded.content_type,
  version=excluded.version,
  sort_order=excluded.sort_order,
  updated_at=now();
