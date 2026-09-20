import Link from "next/link";
import { ArrowRight, BrainCircuit, Check, FileText, Layers3, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { CheckoutButton } from "@/components/checkout-button";
import { PRODUCTS, formatBRL } from "@/lib/products";

const product = PRODUCTS[0];
const system = ["BRIEF", "RCP", "HOOK", "CONTENT", "OFFER", "CHANNEL", "QA", "TEST", "LEARN"];

export default function HomePage() {
  return (
    <main>
      <section className="overflow-hidden bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Conversion Content OS · Release 1.0</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[.98] tracking-[-.045em] sm:text-5xl md:text-7xl">
              Build conversion content from a system — not from random prompts.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Transforme uma oferta ou ideia em mensagens mais claras, hooks mais fortes, CTAs coerentes e conteúdo pronto para múltiplos canais usando Relevância, Clareza e Prova.
            </p>
            <div className="mt-8"><CheckoutButton productId={product.id} /></div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[.06] p-6 backdrop-blur md:p-8">
            <div className="flex items-center gap-2 text-sm font-black text-cyan-300"><Workflow className="h-5 w-5" /> O sistema</div>
            <div className="mt-5 flex flex-wrap gap-2">
              {system.map((step, index) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="rounded-lg bg-white/10 px-2.5 py-2 text-[11px] font-black">{step}</span>
                  {index < system.length - 1 ? <ArrowRight className="h-3.5 w-3.5 text-slate-600" /> : null}
                </div>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[["300", "Hook structures"], ["36", "Prompts"], ["8", "Arquivos"]].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-black/20 p-4">
                  <strong className="block text-2xl font-black">{value}</strong>
                  <span className="mt-1 block text-[11px] text-slate-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="produto" className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-700">RCP</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.035em] md:text-5xl">Comece antes da frase.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
              O sistema começa pela audiência, pela afirmação e pela prova disponível. Os templates entram depois que a mensagem está definida.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Relevância", "Isto é realmente importante para a audiência?"],
              ["Clareza", "A promessa é entendida sem decodificar jargão?"],
              ["Prova", "O que torna a afirmação crível e verificável?"]
            ].map(([title, body]) => (
              <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <ShieldCheck className="h-6 w-6 text-cyan-600" />
                <h3 className="mt-4 font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-700">O que você recebe</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-.035em] md:text-5xl">Um toolkit, não um curso.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {product.deliverables.map((item, index) => (
              <article key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                {index % 3 === 0 ? <FileText className="h-5 w-5 text-cyan-600" /> : index % 3 === 1 ? <Layers3 className="h-5 w-5 text-cyan-600" /> : <BrainCircuit className="h-5 w-5 text-cyan-600" />}
                <h3 className="mt-4 text-sm font-black">{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="rounded-[32px] bg-cyan-950 p-7 text-white md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="flex items-center gap-2 text-cyan-300"><Sparkles className="h-5 w-5" /><span className="text-xs font-black uppercase tracking-[0.2em]">Hook Lab Beta</span></div>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">Teste o primeiro componente executável.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-cyan-100/70">
                Protótipo funcional baseado em famílias de hooks, RCP e regras contra prova inventada, falsa urgência e autoridade não verificada.
              </p>
            </div>
            <Link href="/ferramentas/hook-lab" className="inline-flex h-12 items-center gap-2 rounded-xl bg-cyan-300 px-5 text-sm font-black text-slate-950">
              Abrir Hook Lab <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Release 1.0</p>
              <h2 className="mt-3 text-4xl font-black tracking-[-.04em]">Preço simples. Sem assinatura.</h2>
              <p className="mt-4 text-3xl font-black text-cyan-300">{formatBRL(product.priceCents)}</p>
            </div>
            <div className="space-y-3 text-sm text-slate-300">
              {[
                "Pagamento único.",
                "Produto digital.",
                "Sem promessa de conversão ou receita garantida.",
                "Sem depoimentos fabricados, fake scarcity ou contadores falsos.",
                "Hook Generator público não é necessário para cumprir o pacote comprado."
              ].map((line) => (
                <p key={line} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" /> {line}</p>
              ))}
            </div>
          </div>
          <div className="mt-8"><CheckoutButton productId={product.id} /></div>
        </div>
      </section>
    </main>
  );
}
