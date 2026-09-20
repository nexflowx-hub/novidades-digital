import { StatusClient } from "./status-client";

export default async function ThankYouPage({searchParams}:{searchParams:Promise<{reference?:string}>}) {
  const {reference}=await searchParams;
  return (
    <main className="shell py-16">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-center text-3xl font-black">Obrigado pela compra</h1>
        {reference ? <StatusClient reference={reference}/> : <div className="card p-7">Referência de compra não identificada.</div>}
      </div>
    </main>
  );
}
