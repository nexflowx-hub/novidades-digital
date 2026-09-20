import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { AccessPanel } from "@/components/access-panel";

type Props = {
  searchParams: Promise<{
    reference?: string | string[];
    claim?: string | string[];
  }>;
};

function one(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <main className="grid min-h-[70vh] place-items-center px-4 py-16">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
        <h1 className="mt-5 text-3xl font-black tracking-tight">Estamos validando a sua compra.</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
          O acesso é concedido somente após a confirmação assinada do XPayments.
        </p>

        <AccessPanel
          initialReference={one(params.reference)}
          initialClaim={one(params.claim)}
        />

        <Link
          href="/"
          className="mt-7 inline-flex h-11 items-center rounded-xl bg-slate-950 px-5 text-sm font-black text-white"
        >
          Voltar ao produto
        </Link>
      </div>
    </main>
  );
}
