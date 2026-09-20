import "server-only";

export interface CheckoutIntent {
  reference: string;
  session_id: string | null;
  product_sku: string;
  product_slug: string;
  customer_email: string;
  amount_minor: number;
  currency: string;
  status: string;
  transaction_id: string | null;
  claim_token_hash: string | null;
  claim_expires_at: string | null;
  metadata: Record<string, unknown>;
}

export interface DigitalAsset {
  id: string;
  product_sku: string;
  version: string;
  display_name: string;
  bucket_id: string;
  object_path: string;
  content_type: string | null;
  sort_order: number;
}

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("DIGITAL_COMMERCE_NOT_CONFIGURED");
  return { url: url.replace(/\/$/, ""), key };
}

async function rest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = config();
  const response = await fetch(url + "/rest/v1/" + path, {
    ...init,
    headers: {
      apikey: key,
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error("COMMERCE_REST_" + response.status + ": " + body.slice(0, 240));
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

export async function createCheckoutIntent(input: {
  reference: string;
  productSku: string;
  productSlug: string;
  customerEmail: string;
  amountMinor: number;
  currency: string;
  claimTokenHash: string;
  claimExpiresAt: string;
  metadata?: Record<string, unknown>;
}) {
  await rest("digital_checkout_intents", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      reference: input.reference,
      product_sku: input.productSku,
      product_slug: input.productSlug,
      customer_email: input.customerEmail.toLowerCase(),
      amount_minor: input.amountMinor,
      currency: input.currency.toUpperCase(),
      status: "creating",
      claim_token_hash: input.claimTokenHash,
      claim_expires_at: input.claimExpiresAt,
      metadata: input.metadata ?? {},
    }),
  });
}

export async function updateCheckoutIntent(reference: string, patch: Record<string, unknown>) {
  await rest("digital_checkout_intents?reference=eq." + encodeURIComponent(reference), {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
  });
}

export async function getCheckoutIntent(reference: string): Promise<CheckoutIntent | null> {
  const rows = await rest<CheckoutIntent[]>(
    "digital_checkout_intents?select=*&reference=eq." + encodeURIComponent(reference) + "&limit=1",
  );
  return rows[0] ?? null;
}

export async function getWebhookSecret(storeCode = "NOVIDADES-BRL"): Promise<string> {
  const rows = await rest<Array<{ signing_secret: string }>>(
    "digital_webhook_config?select=signing_secret&active=eq.true&store_code=eq." +
      encodeURIComponent(storeCode) +
      "&limit=1",
  );
  if (!rows[0]?.signing_secret) throw new Error("WEBHOOK_SECRET_NOT_CONFIGURED");
  return rows[0].signing_secret;
}

export async function grantEntitlement(intent: CheckoutIntent, transactionId: string | null) {
  await rest("digital_entitlements?on_conflict=product_sku,xpayments_reference", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      product_sku: intent.product_sku,
      customer_email: intent.customer_email,
      xpayments_reference: intent.reference,
      transaction_id: transactionId,
      status: "active",
      granted_at: new Date().toISOString(),
      metadata: { source: "xpayments-webhook" },
      updated_at: new Date().toISOString(),
    }),
  });
}

export async function hasActiveEntitlement(reference: string): Promise<boolean> {
  const rows = await rest<Array<{ id: string }>>(
    "digital_entitlements?select=id&status=eq.active&xpayments_reference=eq." +
      encodeURIComponent(reference) +
      "&limit=1",
  );
  return Boolean(rows[0]?.id);
}

export async function getActiveAssets(productSku: string): Promise<DigitalAsset[]> {
  return rest<DigitalAsset[]>(
    "digital_assets?select=id,product_sku,version,display_name,bucket_id,object_path,content_type,sort_order" +
      "&active=eq.true&product_sku=eq." +
      encodeURIComponent(productSku) +
      "&order=sort_order.asc",
  );
}

export async function signAsset(asset: DigitalAsset, expiresIn = 300): Promise<string> {
  const { url, key } = config();
  const path = asset.object_path.split("/").map(encodeURIComponent).join("/");
  const response = await fetch(
    url + "/storage/v1/object/sign/" + encodeURIComponent(asset.bucket_id) + "/" + path,
    {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: "Bearer " + key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expiresIn }),
      cache: "no-store",
    },
  );

  if (!response.ok) throw new Error("STORAGE_SIGN_FAILED_" + response.status);
  const data = await response.json();
  const signed = data.signedURL || data.signedUrl || data.signed_url;
  if (!signed) throw new Error("STORAGE_SIGN_URL_MISSING");
  return String(signed).startsWith("http") ? String(signed) : url + "/storage/v1" + signed;
}


export interface DigitalContentBlock {
  id: string;
  product_slug: string;
  module_no: number;
  block_no: number;
  heading: string;
  body: string;
  kind: "lesson" | "framework" | "exercise" | "library" | "checklist";
}

export async function hasActiveContent(productSlug: string): Promise<boolean> {
  const rows = await rest<Array<{ id: string }>>(
    "digital_content_blocks?select=id&active=eq.true&product_slug=eq." +
      encodeURIComponent(productSlug) +
      "&limit=1",
  );
  return Boolean(rows[0]?.id);
}

export async function getActiveContent(productSlug: string): Promise<DigitalContentBlock[]> {
  return rest<DigitalContentBlock[]>(
    "digital_content_blocks?select=id,product_slug,module_no,block_no,heading,body,kind" +
      "&active=eq.true&product_slug=eq." +
      encodeURIComponent(productSlug) +
      "&order=module_no.asc,block_no.asc",
  );
}
