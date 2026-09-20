"use client";

import { useMemo, useState } from "react";
import { Copy, Sparkles } from "lucide-react";
import { generateHooks, type Channel, type HookBrief } from "@/lib/hooks";

const channels: Array<{ value: Channel; label: string }> = [
  { value: "landing", label: "Landing page" },
  { value: "email", label: "Email" },
  { value: "paid-social", label: "Paid social" },
  { value: "instagram", label: "Instagram" },
  { value: "short-video", label: "TikTok / Reels" },
  { value: "youtube", label: "YouTube" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "ecommerce", label: "Ecommerce" }
];

export function HookLab() {
  const [brief, setBrief] = useState<HookBrief>({
    product: "Conversion Content OS",
    audience: "criadores, ecommerce e pequenas equipas de marketing",
    outcome: "mensagens mais claras e testáveis",
    action: "avançar para a oferta",
    channel: "landing",
    proof: ""
  });
  const [generated, setGenerated] = useState(false);
  const hooks = useMemo(() => (generated ? generateHooks(brief) : []), [brief, generated]);

  const update = (field: keyof HookBrief, value: string) =>
    setBrief((current) => ({ ...current, [field]: value }));

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-600" />
          <h2 className="text-lg font-black">Brief do Hook Lab</h2>
        </div>
        <div className="space-y-4">
          {[
            ["product", "Produto ou oferta"],
            ["audience", "Público"],
            ["outcome", "Resultado desejado"],
            ["action", "Próxima ação"],
            ["proof", "Prova disponível (opcional)"]
          ].map(([field, label]) => (
            <label key={field} className="block text-sm font-bold text-slate-700">
              {label}
              <textarea
                rows={2}
                value={String(brief[field as keyof HookBrief])}
                onChange={(event) => update(field as keyof HookBrief, event.target.value)}
                className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal text-slate-900 outline-none focus:border-cyan-500"
              />
            </label>
          ))}
          <label className="block text-sm font-bold text-slate-700">
            Canal
            <select
              value={brief.channel}
              onChange={(event) => update("channel", event.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-normal outline-none focus:border-cyan-500"
            >
              {channels.map((channel) => (
                <option key={channel.value} value={channel.value}>{channel.label}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setGenerated(true)}
            className="h-12 w-full rounded-xl bg-slate-950 text-sm font-black text-white transition hover:bg-cyan-700"
          >
            Gerar estruturas
          </button>
        </div>
      </div>

      <div>
        {!generated ? (
          <div className="grid min-h-[420px] place-items-center rounded-3xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
            <div>
              <Sparkles className="mx-auto h-10 w-10 text-cyan-600" />
              <h3 className="mt-4 text-2xl font-black">Hook Lab Beta</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
                Preencha um briefing real. O MVP usa famílias determinísticas e regras de risco — sem inventar depoimentos, escassez ou resultados.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {hooks.map((hook) => (
              <article key={hook.family} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-cyan-800">{hook.family}</span>
                  <span className="text-[11px] font-bold text-emerald-700">Risco {hook.risk}</span>
                </div>
                <p className="mt-4 text-base font-extrabold leading-6 text-slate-950">{hook.text}</p>
                <p className="mt-3 text-xs leading-5 text-slate-500">{hook.rationale}</p>
                <div className="mt-4 flex gap-2 text-[10px] font-black text-slate-500">
                  <span>R {hook.rcp.relevance}</span>
                  <span>C {hook.rcp.clarity}</span>
                  <span>P {hook.rcp.proof}</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(hook.text)}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-black text-cyan-700 hover:text-cyan-900"
                >
                  <Copy className="h-3.5 w-3.5" /> Copiar
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
