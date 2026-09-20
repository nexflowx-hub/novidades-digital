alter table public.digital_checkout_intents
  add column if not exists claim_token_hash text,
  add column if not exists claim_expires_at timestamptz;

create unique index if not exists digital_checkout_intents_claim_hash_uq
  on public.digital_checkout_intents(claim_token_hash)
  where claim_token_hash is not null;
