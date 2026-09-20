"use client";

import { useState } from "react";

export function CheckoutForm({ slug, title, amount }: { slug:string; title:string; amount:string }) {
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data=new FormData(e.currentTarget);
    const response=await fetch("/api/checkout",{
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify({
        slug,
        email:String(data.get("email")||"").trim(),
        name:String(data.get("name")||"").trim()
      })
    });
    const body=await response.json().catch(()=>({}));
    if(!response.ok || !body.checkoutUrl){
      setError(body.error||"Não foi possível iniciar o checkout.");
      setLoading(false);
      return;
    }
    window.location.href=body.checkoutUrl;
  }

  return (
    <form onSubmit={submit} className="card p-7">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-black">{amount}</p>
      <label className="mt-6 block text-sm font-bold">Nome</label>
      <input name="name" required minLength={2} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-300" />
      <label className="mt-4 block text-sm font-bold">E-mail de acesso</label>
      <input name="email" type="email" required className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-300" />
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      <button disabled={loading} className="mt-6 w-full rounded-xl bg-white px-5 py-4 font-black text-slate-950 disabled:opacity-60">
        {loading ? "A abrir checkout..." : "Continuar para pagamento"}
      </button>
      <p className="mt-4 text-xs leading-5 text-slate-500">Será redirecionado para o checkout seguro XPAYMENTS.</p>
    </form>
  );
}
