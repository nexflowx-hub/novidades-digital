const EDGE_ACCESS="https://eivqvrfsreaopzlvhadu.supabase.co/functions/v1/digital-access";
const params=new URLSearchParams(location.search);
let reference=params.get("reference")||"";
let claim=params.get("claim")||"";
try{
  if(!reference||!claim){
    const saved=JSON.parse(localStorage.getItem("nv:digital:last-access")||"{}");
    reference=reference||saved.reference||"";
    claim=claim||saved.claim||"";
  }
}catch{}
const statusBox=document.getElementById("access-status");
const downloads=document.getElementById("download-list");
const errorBox=document.getElementById("access-error");
let attempts=0;

async function checkAccess(){
  if(!reference||!claim){
    statusBox.hidden=true;
    errorBox.textContent="Não encontramos a credencial desta compra neste navegador.";
    errorBox.hidden=false;
    return;
  }
  attempts++;
  try{
    const response=await fetch(EDGE_ACCESS+"?reference="+encodeURIComponent(reference)+"&claim="+encodeURIComponent(claim),{cache:"no-store"});
    const data=await response.json();
    if(response.status===202){
      statusBox.innerHTML='<span class="spinner"></span><div><b>Aguardando confirmação</b><p>O pagamento ainda está pendente. Esta página atualiza automaticamente.</p></div>';
      if(attempts<80) setTimeout(checkAccess,3000);
      return;
    }
    if(!response.ok) throw new Error(data.message||"Não foi possível validar o acesso.");
    if(data.paid&&!data.deliveryReady){
      statusBox.innerHTML='<div class="success-mark small">✓</div><div><b>Pagamento confirmado</b><p>O pacote está a ser preparado.</p></div>';
      return;
    }
    statusBox.innerHTML='<div class="success-mark small">✓</div><div><b>Acesso liberado</b><p>Os links abaixo são privados e expiram em poucos minutos.</p></div>';
    downloads.hidden=false;
    downloads.innerHTML=(data.files||[]).map(file=>`<a href="${file.url}" rel="nofollow"><span>${file.name}</span><b>Download ↓</b></a>`).join("");
  }catch(err){
    statusBox.hidden=true;
    errorBox.textContent=err?.message||"Falha temporária ao validar o acesso.";
    errorBox.hidden=false;
  }
}
checkAccess();
