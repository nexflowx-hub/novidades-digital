const API_BASE="https://eivqvrfsreaopzlvhadu.supabase.co/functions/v1";

async function startCheckout(){
  const email=document.querySelector("#checkout-email")?.value?.trim();
  const button=document.querySelector("#checkout-button");
  const error=document.querySelector("#checkout-error");
  if(error) error.textContent="";
  if(!email||!email.includes("@")){if(error) error.textContent="Informe um email válido para receber o acesso.";return;}
  if(button){button.disabled=true;button.textContent="Abrindo checkout…";}
  try{
    const response=await fetch(API_BASE+"/digital-checkout",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({productId:"dp-001",email})});
    const data=await response.json();
    if(!response.ok||!data.checkoutUrl) throw new Error(data.message||"Checkout indisponível.");
    localStorage.setItem("nv:digital:last-access",JSON.stringify({reference:data.reference,claim:data.claim}));
    location.assign(data.checkoutUrl);
  }catch(e){
    if(error) error.textContent=e?.message||"Não foi possível abrir o checkout.";
    if(button){button.disabled=false;button.textContent="Comprar por R$97";}
  }
}
window.startCheckout=startCheckout;

function readAccess(){
  const qs=new URLSearchParams(location.search);
  let reference=qs.get("reference"),claim=qs.get("claim");
  if(!reference||!claim){
    try{const saved=JSON.parse(localStorage.getItem("nv:digital:last-access")||"{}");reference=reference||saved.reference;claim=claim||saved.claim;}catch{}
  }
  return {reference,claim};
}
async function pollAccess(){
  const box=document.querySelector("#access-state"); if(!box)return;
  const {reference,claim}=readAccess();
  if(!reference||!claim){box.className="access-state err";box.innerHTML="<strong>Acesso não identificado.</strong><p>Abra esta página no mesmo navegador usado no checkout ou use o link de retorno da compra.</p>";return;}
  box.innerHTML="<strong>Validando pagamento…</strong><p>Aguardando a confirmação assinada do XPayments.</p>";
  try{
    const response=await fetch(API_BASE+"/digital-access?reference="+encodeURIComponent(reference)+"&claim="+encodeURIComponent(claim),{cache:"no-store"});
    const data=await response.json();
    if(response.status===202){setTimeout(pollAccess,3000);return;}
    if(!response.ok)throw new Error(data.message||"Não foi possível validar o acesso.");
    if(!data.deliveryReady){box.className="access-state ok";box.innerHTML="<strong>Pagamento confirmado.</strong><p>O pacote está a ser preparado para download.</p>";return;}
    box.className="access-state ok";
    box.innerHTML="<strong>Acesso liberado.</strong><p>Os links abaixo são privados e expiram em poucos minutos.</p><div class='downloads'>"+
      (data.files||[]).map(f=>"<a class='download' href='"+escapeHtml(f.url)+"'><span>"+escapeHtml(f.name)+"</span><span>Download ↓</span></a>").join("")+"</div>";
  }catch(e){box.className="access-state err";box.innerHTML="<strong>Falha de validação.</strong><p>"+escapeHtml(e?.message||"Erro temporário.")+"</p>";}
}
window.pollAccess=pollAccess;

const hookFamilies=[
 ["Resultado",(b)=>"Como usar "+b.product+" para chegar a "+b.outcome+" sem começar do zero.","Torna o resultado e a redução de esforço visíveis."],
 ["Diagnóstico",(b)=>"Se "+b.audience+" ainda não consegue "+b.outcome+", estes são os pontos que vale revisar primeiro.","Transforma o problema em verificação prática."],
 ["Erro",(b)=>"O erro que faz "+b.audience+" trabalhar mais e ainda assim se afastar de "+b.outcome+".","Cria contraste sem prometer resultado garantido."],
 ["Comparação",(b)=>b.product+" ou improviso: o que muda quando o objetivo é "+b.outcome+"?","Compara processo e ausência de processo."],
 ["Processo",(b)=>"O processo em etapas para sair de uma ideia e chegar a "+b.outcome+" com "+b.product+".","Expõe uma sequência em vez de um milagre."],
 ["Checklist",(b)=>"Checklist: o que precisa estar claro antes de tentar "+b.action+".","Útil para decisão e fundo de funil."],
 ["Objeção",(b)=>"Você não precisa de mais volume para "+b.outcome+"; precisa saber o que testar primeiro.","Reposiciona uma objeção sem inventar prova."],
 ["Demonstração",(b)=>"Veja como "+b.product+" organiza a passagem de briefing para "+b.outcome+".","Funciona melhor quando há demonstração real."],
 ["Pergunta",(b)=>"O seu conteúdo deixa "+b.audience+" entender claramente por que deveria "+b.action+"?","Faz o público auditar a própria mensagem."],
 ["Especificidade",(b)=>b.product+": um sistema para definir mensagem, prova e próximo passo antes de publicar.","Troca adjetivos vagos por componentes concretos."],
 ["Sequência",(b)=>"Brief → mensagem → hook → CTA → teste: a sequência para buscar "+b.outcome+" sem depender de palpites.","Mostra o mecanismo em uma linha."],
 ["Critério",(b)=>"Antes de escolher uma mensagem para "+b.audience+", valide estes 3 critérios: relevância, clareza e prova.","Dá critérios explícitos à decisão."]
];
function generateHooks(){
  const b={
    product:document.querySelector("#lab-product").value.trim()||"esta oferta",
    audience:document.querySelector("#lab-audience").value.trim()||"o público certo",
    outcome:document.querySelector("#lab-outcome").value.trim()||"um resultado mais claro",
    action:document.querySelector("#lab-action").value.trim()||"dar o próximo passo"
  };
  const root=document.querySelector("#hook-results");
  root.innerHTML=hookFamilies.map(([family,fn,why])=>"<article class='card hook'><small>"+family+"</small><p>"+escapeHtml(fn(b))+"</p><p class='why'>"+why+"</p><button class='copy' data-copy='"+escapeAttr(fn(b))+"'>Copiar</button></article>").join("");
  root.querySelectorAll("[data-copy]").forEach(btn=>btn.addEventListener("click",async()=>{await navigator.clipboard.writeText(btn.dataset.copy);btn.textContent="Copiado";setTimeout(()=>btn.textContent="Copiar",900)}));
}
window.generateHooks=generateHooks;
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));}
function escapeAttr(s){return escapeHtml(s)}
