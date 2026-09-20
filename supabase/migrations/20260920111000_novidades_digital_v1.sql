-- Novidades Digital v1: orders, entitlements, protected content and private assets.

create extension if not exists pgcrypto;

create table if not exists public.digital_orders (
  id uuid primary key default gen_random_uuid(),
  checkout_session_id uuid unique,
  reference text not null unique,
  product_slug text not null,
  sku text not null,
  customer_email text not null,
  customer_name text,
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'BRL',
  status text not null default 'pending' check (status in ('pending','processing','succeeded','failed','canceled','refunded')),
  xpayments_transaction_id text,
  payment_method text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.digital_entitlements (
  id uuid primary key default gen_random_uuid(),
  token uuid not null unique default gen_random_uuid(),
  order_id uuid not null unique references public.digital_orders(id) on delete cascade,
  checkout_session_id uuid,
  product_slug text not null,
  sku text not null,
  customer_email text not null,
  payment_reference text not null,
  status text not null default 'active' check (status in ('active','revoked','refunded')),
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

create table if not exists public.digital_assets (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  label text not null,
  description text,
  version text not null default '1.0',
  storage_path text not null,
  download_name text,
  mime_type text,
  sort_order integer not null default 100,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(product_slug, storage_path)
);

create table if not exists public.digital_content_blocks (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  module_no integer not null,
  block_no integer not null,
  heading text not null,
  body text not null,
  kind text not null default 'lesson' check (kind in ('lesson','framework','exercise','library','checklist')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(product_slug,module_no,block_no)
);

create index if not exists digital_orders_email_idx on public.digital_orders(customer_email);
create index if not exists digital_orders_product_idx on public.digital_orders(product_slug,status);
create index if not exists digital_entitlements_email_idx on public.digital_entitlements(customer_email,status);
create index if not exists digital_content_product_idx on public.digital_content_blocks(product_slug,module_no,block_no);

alter table public.digital_orders enable row level security;
alter table public.digital_entitlements enable row level security;
alter table public.digital_assets enable row level security;
alter table public.digital_content_blocks enable row level security;

revoke all on public.digital_orders from anon, authenticated;
revoke all on public.digital_entitlements from anon, authenticated;
revoke all on public.digital_assets from anon, authenticated;
revoke all on public.digital_content_blocks from anon, authenticated;

grant all on public.digital_orders to service_role;
grant all on public.digital_entitlements to service_role;
grant all on public.digital_assets to service_role;
grant all on public.digital_content_blocks to service_role;

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values (
  'novidades-digital-assets',
  'novidades-digital-assets',
  false,
  104857600,
  array[
    'application/pdf',
    'application/zip',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'application/json'
  ]
)
on conflict (id) do update set
  public=false,
  file_size_limit=excluded.file_size_limit,
  allowed_mime_types=excluded.allowed_mime_types;
