import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getProduct } from "@/lib/products";

export default async function AccessPage({params}:{params:Promise<{token:string}>}) {
  const {token}=await params;
  const admin=getSupabaseAdmin();
  const {data:entitlement}=await admin
    .from("digital_entitlements")
    .select("*")
    .eq("token",token)
    .eq("status","active")
    .maybeSingle();

  if(!entitlement) notFound();
  const product=getProduct(entitlement.product_slug);
  if(!product) notFound();

  const {data:assets}=await admin
    .from("digital_assets")
    .select("id,label,description,version")
    .eq("product_slug",product.slug)
    .eq("active",true)
    .order("sort_order");

  return (
    <main className="shell py-12">
      <span className="pill">Acesso ativo</span>
      <h1 className="mt-5 text-4xl font-black tracking-[-.04em]">{product.title}</h1>
      <p className="mt-3 text-slate-400">Licenciado para {entitlement.customer_email}</p>
      <div className="mt-8 grid gap-3">
        <a href={"/conteudo/"+token+"/"+product.slug} className="card flex items-center justify-between gap-4 p-5">
          <div>
            <p className="font-bold">Abrir conteúdo online</p>
            <p className="mt-1 text-sm text-slate-400">Leia a release protegida diretamente na Novidades Digital.</p>
          </div>
          <span className="pill">Abrir</span>
        </a>
        {(assets||[]).map((asset)=>(
          <a key={asset.id} href={"/api/download/"+token+"/"+asset.id} className="card flex items-center justify-between gap-4 p-5">
            <div>
              <p className="font-bold">{asset.label}</p>
              <p className="mt-1 text-sm text-slate-400">{asset.description || "Versão " + asset.version}</p>
            </div>
            <span className="pill">Download</span>
          </a>
        ))}
        {!assets?.length ? <div className="card p-6 text-sm text-slate-400">Os arquivos desta release estão a ser preparados para publicação.</div> : null}
      </div>
    </main>
  );
}
