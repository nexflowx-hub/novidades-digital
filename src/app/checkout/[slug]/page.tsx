import { notFound } from "next/navigation";
import { getProduct, formatBRL } from "@/lib/products";
import { CheckoutForm } from "./checkout-form";

export default async function CheckoutPage({ params }: { params: Promise<{slug:string}> }) {
  const { slug }=await params;
  const product=getProduct(slug);
  if(!product || product.status!=="ready") notFound();
  return (
    <main className="shell py-12">
      <div className="mx-auto max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-300">Checkout digital</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-.04em]">Finalize o seu acesso</h1>
        <div className="mt-6"><CheckoutForm slug={product.slug} title={product.title} amount={formatBRL(product.priceCents)}/></div>
      </div>
    </main>
  );
}
