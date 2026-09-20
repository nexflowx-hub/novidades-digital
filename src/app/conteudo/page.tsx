import { createHash, timingSafeEqual } from "node:crypto";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getActiveContent,
  getCheckoutIntent,
  hasActiveEntitlement,
} from "@/lib/commerce-admin";
import { PRODUCTS } from "@/lib/products";

function matchesClaim(rawClaim: string, storedHash: string | null) {
  if (!storedHash || !/^[a-f0-9]{64}$/i.test(storedHash)) return false;
  const computed = createHash("sha256").update(rawClaim).digest("hex");
  const a = Buffer.from(computed, "hex");
  const b = Buffer.from(storedHash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function ProtectedContentPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string | string[]; claim?: string | string[] }>;
}) {
  const params = await searchParams;
  const reference = Array.isArray(params.reference) ? params.reference[0] : params.reference;
  const claim = Array.isArray(params.claim) ? params.claim[0] : params.claim;

  if (!reference || !claim) notFound();

  const intent = await getCheckoutIntent(reference);
  if (!intent || !matchesClaim(claim, intent.claim_token_hash)) notFound();

  if (intent.claim_expires_at && new Date(intent.claim_expires_at).getTime() <= Date.now()) {
    notFound();
  }

  const entitled = await hasActiveEntitlement(reference);
  if (!entitled) notFound();

  const product = PRODUCTS.find((item) => item.slug === intent.product_slug);
  if (!product) notFound();

  const blocks = await getActiveContent(intent.product_slug);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
            Conteúdo protegido · {product.shortName}
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[-.04em] md:text-6xl">
            {product.name}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            Release web incluída no seu entitlement. O acesso é individual e vinculado à compra confirmada.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <Link
          href={"/checkout/sucesso?reference=" + encodeURIComponent(reference) + "&claim=" + encodeURIComponent(claim)}
          className="text-sm font-bold text-cyan-700"
        >
          ← Voltar ao acesso
        </Link>

        <div className="mt-6 grid gap-5">
          {blocks.map((block) => (
            <article key={block.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-700">
                Módulo {block.module_no} · {block.kind}
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-[-.03em] text-slate-950">
                {block.heading}
              </h2>
              <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {block.body}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
