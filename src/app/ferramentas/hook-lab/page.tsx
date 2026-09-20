import type { Metadata } from "next";
import { HookLab } from "@/components/hook-lab";

export const metadata: Metadata = {
  title: "Hook Lab Beta",
  description: "Gerador determinístico de estruturas de hooks com RCP e guardrails de prova."
};

export default function HookLabPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Conversion Content OS</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-.04em] md:text-6xl">Hook Lab Beta</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            MVP funcional sem IA externa: briefing estruturado, 12 famílias, RCP e guardrails. Ele não prevê conversão e não inventa prova.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12"><HookLab /></section>
    </main>
  );
}
