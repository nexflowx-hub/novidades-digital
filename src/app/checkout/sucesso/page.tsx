import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-4 py-16">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
        <h1 className="mt-5 text-3xl font-black tracking-tight">Compra recebida.</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
          A entrega automática por entitlement está em integração com o XPAYMENTS. Mantenha o email usado no checkout: ele será a chave de identificação do acesso.
        </p>
        <Link href="/" className="mt-7 inline-flex h-11 items-center rounded-xl bg-slate-950 px-5 text-sm font-black text-white">Voltar ao produto</Link>
      </div>
    </main>
  );
}
