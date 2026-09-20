"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, LoaderCircle, ShieldCheck } from "lucide-react";

type FileItem = { id: string; name: string; version: string; url: string; expiresIn: number };

export function AccessPanel({
  initialReference,
  initialClaim,
}: {
  initialReference?: string;
  initialClaim?: string;
}) {
  const [reference, setReference] = useState(initialReference || "");
  const [claim, setClaim] = useState(initialClaim || "");
  const [state, setState] = useState<"checking" | "pending" | "ready" | "preparing" | "error">("checking");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [onlineUrl, setOnlineUrl] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (reference && claim) return;
    try {
      const saved = JSON.parse(localStorage.getItem("nv:digital:last-access") || "{}");
      if (saved.reference && saved.claim) {
        setReference(saved.reference);
        setClaim(saved.claim);
      }
    } catch {
      // Ignore malformed local state.
    }
  }, [claim, reference]);

  useEffect(() => {
    if (!reference || !claim) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function check() {
      try {
        const response = await fetch(
          "/api/access?reference=" +
            encodeURIComponent(reference) +
            "&claim=" +
            encodeURIComponent(claim),
          { cache: "no-store" },
        );
        const data = await response.json();

        if (cancelled) return;

        if (response.status === 202) {
          setState("pending");
          setMessage("Estamos aguardando a confirmação do pagamento.");
          timer = setTimeout(check, 3000);
          return;
        }

        if (!response.ok) {
          setState("error");
          setMessage(data.message || "Não foi possível validar o acesso.");
          return;
        }

        if (data.paid && !data.deliveryReady) {
          setState("preparing");
          setMessage("Pagamento confirmado. O conteúdo desta release está em preparação.");
          return;
        }

        setFiles(data.files || []);
        setOnlineUrl(data.onlineUrl || "");
        setState("ready");
      } catch {
        if (!cancelled) {
          setState("error");
          setMessage("Falha temporária ao consultar o acesso.");
        }
      }
    }

    void check();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [reference, claim]);

  useEffect(() => {
    if (!reference || !claim) {
      setState("error");
      setMessage("Não encontramos a credencial desta compra neste navegador.");
    }
  }, [reference, claim]);

  if (state === "checking" || state === "pending") {
    return (
      <div className="mt-7 rounded-2xl bg-slate-50 p-5 text-left">
        <div className="flex items-center gap-3">
          <LoaderCircle className="h-5 w-5 animate-spin text-cyan-700" />
          <div>
            <p className="font-black">Validando a compra</p>
            <p className="mt-1 text-sm text-slate-600">{message || "Consultando o entitlement..."}</p>
          </div>
        </div>
      </div>
    );
  }

  if (state === "preparing") {
    return (
      <div className="mt-7 rounded-2xl bg-emerald-50 p-5 text-left">
        <p className="flex items-center gap-2 font-black text-emerald-900">
          <CheckCircle2 className="h-5 w-5" /> Pagamento confirmado
        </p>
        <p className="mt-2 text-sm text-emerald-800">{message}</p>
      </div>
    );
  }

  if (state === "ready") {
    return (
      <div className="mt-7 text-left">
        <p className="flex items-center gap-2 font-black text-emerald-800">
          <ShieldCheck className="h-5 w-5" /> Acesso liberado
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Os links expiram em poucos minutos e podem ser regenerados recarregando esta página.
        </p>
        <div className="mt-4 grid gap-2">
          {onlineUrl ? (
            <a
              href={onlineUrl}
              className="flex items-center justify-between gap-3 rounded-xl border border-cyan-300 bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-950"
            >
              <span>Abrir conteúdo online</span>
              <ShieldCheck className="h-4 w-4 shrink-0 text-cyan-700" />
            </a>
          ) : null}
          {files.map((file) => (
            <a
              key={file.id}
              href={file.url}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold hover:border-cyan-400"
            >
              <span>{file.name}</span>
              <Download className="h-4 w-4 shrink-0 text-cyan-700" />
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-7 rounded-2xl bg-rose-50 p-5 text-left">
      <p className="font-black text-rose-900">Acesso não validado</p>
      <p className="mt-1 text-sm text-rose-800">{message}</p>
    </div>
  );
}
