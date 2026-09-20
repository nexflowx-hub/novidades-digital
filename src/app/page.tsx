import Link from "next/link";
import { ArrowRight, Download, LockKeyhole, Sparkles } from "lucide-react";
import { PRODUCTS, formatBRL } from "@/lib/products";

export default function HomePage() {
  return (
    <main>
      <section className="shell py-16 md:py-24">
        <span className="pill"><Sparkles className="h-4 w-4 text-cyan-300" /> Novidades Digital</span>
        <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[.98] tracking-[-0.055em] md:text-7xl">
          Produtos digitais feitos para <span className="text-cyan-300">usar</span>, não apenas para ler.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
          Sistemas, guias, workbooks, planilhas e bibliotecas práticas. Pagamento via XPAYMENTS e acesso digital protegido.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#produtos" className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950">Ver produtos</a>
          <Link href="/biblioteca" className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold">Acessar biblioteca</Link>
        </div>
        <div className="mt-12 grid gap-3 md:grid-cols-3">
          <div className="card p-5"><LockKeyhole className="h-5 w-5 text-emerald-300"/><p className="mt-3 font-bold">Entrega protegida</p><p className="mt-1 text-sm text-slate-400">Entitlement individual após pagamento confirmado.</p></div>
          <div className="card p-5"><Download className="h-5 w-5 text-cyan-300"/><p className="mt-3 font-bold">Downloads temporários</p><p className="mt-1 text-sm text-slate-400">Links assinados para arquivos privados.</p></div>
          <div className="card p-5"><Sparkles className="h-5 w-5 text-blue-300"/><p className="mt-3 font-bold">Produtos reconstruídos</p><p className="mt-1 text-sm text-slate-400">Conteúdo atualizado, organizado e convertido em ferramentas úteis.</p></div>
        </div>
      </section>

      <section id="produtos" className="shell py-8">
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-300">Catálogo inicial</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-.035em]">Produtos digitais</h2>
        </div>
        <div className="grid-products">
          {PRODUCTS.map((product) => (
            <article key={product.slug} className="card flex flex-col p-6">
              <span className="pill w-fit">{product.status === "ready" ? "Disponível" : "Em preparação"}</span>
              <h3 className="mt-5 text-2xl font-black tracking-[-.03em]">{product.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-300">{product.hero}</p>
              <p className="mt-6 text-2xl font-black">{formatBRL(product.priceCents)}</p>
              <Link href={"/produto/" + product.slug} className="mt-5 inline-flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950">
                Ver detalhes <ArrowRight className="h-4 w-4"/>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
