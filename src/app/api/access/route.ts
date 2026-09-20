import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  getActiveAssets,
  getCheckoutIntent,
  hasActiveEntitlement,
  signAsset,
} from "@/lib/commerce-admin";

export const runtime = "nodejs";

function matchesClaim(rawClaim: string, storedHash: string | null) {
  if (!storedHash || !/^[a-f0-9]{64}$/i.test(storedHash)) return false;
  const computed = createHash("sha256").update(rawClaim).digest("hex");
  const a = Buffer.from(computed, "hex");
  const b = Buffer.from(storedHash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  try {
    const reference = String(request.nextUrl.searchParams.get("reference") || "").trim();
    const claim = String(request.nextUrl.searchParams.get("claim") || "").trim();

    if (!reference || !claim) {
      return NextResponse.json({ message: "Credenciais de acesso em falta." }, { status: 400 });
    }

    const intent = await getCheckoutIntent(reference);
    if (!intent || !matchesClaim(claim, intent.claim_token_hash)) {
      return NextResponse.json({ message: "Acesso inválido." }, { status: 403 });
    }

    if (intent.claim_expires_at && new Date(intent.claim_expires_at).getTime() <= Date.now()) {
      return NextResponse.json({ message: "Link de acesso expirado." }, { status: 410 });
    }

    const entitled = await hasActiveEntitlement(reference);
    if (!entitled) {
      return NextResponse.json({ paid: false, status: intent.status, files: [] }, { status: 202 });
    }

    const assets = await getActiveAssets(intent.product_sku);
    const files = await Promise.all(
      assets.map(async (asset) => ({
        id: asset.id,
        name: asset.display_name,
        version: asset.version,
        url: await signAsset(asset, 300),
        expiresIn: 300,
      })),
    );

    return NextResponse.json({
      paid: true,
      status: "succeeded",
      deliveryReady: files.length > 0,
      files,
    });
  } catch (error) {
    console.error("[digital-access]", error);
    return NextResponse.json({ message: "Não foi possível validar o acesso." }, { status: 500 });
  }
}
