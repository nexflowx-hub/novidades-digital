"use client";
import { useEffect, useState } from "react";

export function StatusClient({ reference }: {reference:string}) {
  const [message,setMessage]=useState("A confirmar o pagamento...");

  useEffect(()=>{
    let active=true;
    const check=async()=>{
      const r=await fetch("/api/order-status?reference="+encodeURIComponent(reference),{cache:"no-store"});
      const b=await r.json().catch(()=>({}));
      if(!active) return;
      if(b.accessUrl){ window.location.href=b.accessUrl; return; }
      if(b.status==="failed" || b.status==="canceled") {
        setMessage("O pagamento não foi concluído.");
      } else {
        setMessage("Pagamento em processamento. Aguardando confirmação segura...");
      }
    };
    check();
    const id=setInterval(check,3000);
    return()=>{active=false;clearInterval(id)};
  },[reference]);

  return (
    <div className="card p-7 text-center">
      <p className="text-lg font-bold">{message}</p>
      <p className="mt-2 text-sm text-slate-400">Quando a confirmação chegar, o acesso será aberto automaticamente.</p>
    </div>
  );
}
