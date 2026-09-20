"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";

export function CheckoutButton({ productId }: { productId: string }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    setError("");
    if (!email || !email.includes("@")) {
      setError("Informe um email válido para receber o acesso.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId, email }),
      });
      const data = await response.json();

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.message || "Checkout indisponível.");
      }

      if (data.reference && data.claim) {
        localStorage.setItem(
          "nv:digital:last-access",
          JSON.stringify({ reference: data.reference, claim: data.claim }),
        );
      }

      window.location.assign(data.checkoutUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível abrir o checkout.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-xl">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Seu melhor email"
          className="h-12 flex-1 rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/45 focus:border-cyan-300/70"
        />
        <button
          type="button"
          disabled={busy}
          onClick={checkout}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 text-sm font-black text-slate-950 transition hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-70"
        >
          {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          Comprar por R$97
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-400">Pagamento único · Produto digital · Sem assinatura.</p>
      {error ? <p className="mt-2 text-sm font-semibold text-rose-300">{error}</p> : null}
    </div>
  );
}
