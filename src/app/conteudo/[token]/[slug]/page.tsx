import { notFound } from "next/navigation";
import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getProduct } from "@/lib/products";

export default async function ProtectedContentPage({
  params
}:{
  params:Promise<{token:string;slug:string}>
}) {
  const {token,slug}=await params;
  const admin=getSupabaseAdmin();

  const {data:entitlement}=await admin
    .from("digital_entitlements")
    .select("product_slug,status,customer_email")
    .eq("token",token)
    .eq("status","active")
    .maybeSingle();

  if(!entitlement || entitlement.product_slug!==slug) notFound();

  const product=getProduct(slug);
  if(!product) notFound();

  const {data:blocks}=await admin
    .from("digital_content_blocks")
    .select("id,module_no,block_no,heading,body,kind")
    .eq("product_slug",slug)
    .eq("active",true)
    .order("module_no")
    .order("block_no");

  return (
    <main className="shell py-12">
      <Link href={"/acesso/"+token} className="text-sm text-slate-400">← Voltar à biblioteca</Link>
      <div className="mt-6">
        <span className="pill">Conteúdo protegido</span>
        <h1 className="mt-5 text-4xl font-black tracking-[-.04em] md:text-6xl">{product.title}</h1>
        <p className="mt-3 max-w-2xl text-slate-400">Acesso licenciado para {entitlement.customer_email}</p>
      </div>

      <div className="mt-10 grid gap-5">
        {(blocks||[]).map((block)=>(
          <article key={block.id} className="card p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[.14em] text-cyan-300">
              <span>Módulo {block.module_no}</span>
              <span>·</span>
              <span>{block.kind}</span>
            </div>
            <h2 className="mt-3 text-2xl font-black tracking-[-.03em]">{block.heading}</h2>
            <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">{block.body}</div>
          </article>
        ))}
        {!blocks?.length ? <div className="card p-7 text-slate-400">Conteúdo desta release ainda não publicado.</div> : null}
      </div>
    </main>
  );
}
