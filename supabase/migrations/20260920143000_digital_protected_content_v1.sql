create table if not exists public.digital_content_blocks (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  module_no integer not null,
  block_no integer not null,
  heading text not null,
  body text not null,
  kind text not null default 'lesson'
    check (kind in ('lesson','framework','exercise','library','checklist')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(product_slug,module_no,block_no)
);

create index if not exists digital_content_product_idx
  on public.digital_content_blocks(product_slug,module_no,block_no);

alter table public.digital_content_blocks enable row level security;
revoke all on public.digital_content_blocks from anon, authenticated;
grant all on public.digital_content_blocks to service_role;
