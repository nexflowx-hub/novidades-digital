import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(_request:Request,{params}:{params:Promise<{token:string;assetId:string}>}) {
  const {token,assetId}=await params;
  const admin=getSupabaseAdmin();

  const {data:entitlement}=await admin
    .from("digital_entitlements")
    .select("product_slug,status")
    .eq("token",token)
    .eq("status","active")
    .maybeSingle();

  if(!entitlement) return NextResponse.json({error:"ACCESS_DENIED"},{status:403});

  const {data:asset}=await admin
    .from("digital_assets")
    .select("*")
    .eq("id",assetId)
    .eq("product_slug",entitlement.product_slug)
    .eq("active",true)
    .maybeSingle();

  if(!asset) return NextResponse.json({error:"ASSET_NOT_FOUND"},{status:404});

  const bucket=process.env.DIGITAL_STORAGE_BUCKET||"novidades-digital-assets";
  const {data,error}=await admin.storage
    .from(bucket)
    .createSignedUrl(asset.storage_path,300,{download:asset.download_name||undefined});

  if(error||!data?.signedUrl) {
    return NextResponse.json({error:"DOWNLOAD_UNAVAILABLE"},{status:503});
  }

  return NextResponse.redirect(data.signedUrl);
}
