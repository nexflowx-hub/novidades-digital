import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { getProduct, formatBRL } from "@/lib/products";

export default async function ProductPage({ params }: { params: Promise<{slug:string}> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <main className="shell py-12 md:py-16">
      <Link href="/" className="text-sm text-slate-400">← Voltar</Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <section className="card p-7 md:p-10">
          <span className="pill">{product.status === "ready" ? "Release inicial" : "Pré-catálogo"}</span>
          <h1 className="mt-6 text-4xl font-black tracking-[-.045em] md:text-6xl">{product.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{product.description}</p>
          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">Inclui</p>
            <ul className="mt-4 grid gap-3">
              {product.deliverables.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-slate-200"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300"/>{item}</li>
              ))}
            </ul>
          </div>
        </section>
        <aside className="card h-fit p-7">
          <p className="text-sm text-slate-400">Acesso digital</p>
          <p className="mt-2 text-4xl font-black">{formatBRL(product.priceCents)}</p>
          {product.status === "ready" ? (
            <Link href={"/checkout/" + product.slug} className="mt-6 inline-flex w-full items-center justify-between rounded-xl bg-white px-5 py-4 font-black text-slate-950">
              Comprar agora <ArrowRight className="h-5 w-5"/>
            </Link>
          ) : (
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">Produto em preparação editorial.</div>
          )}
          <p className="mt-4 text-xs leading-5 text-slate-500">Pagamento processado via XPAYMENTS. Após confirmação, o acesso é liberado na Novidades Digital.</p>
        </aside>
      </div>
    </main>
  );
}
