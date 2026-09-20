const EDGE_BASE="https://eivqvrfsreaopzlvhadu.supabase.co/functions/v1";

const checkoutForm=document.getElementById("checkout-form");
if(checkoutForm){
  checkoutForm.addEventListener("submit",async(event)=>{
    event.preventDefault();
    const email=document.getElementById("checkout-email").value.trim();
    const button=document.getElementById("checkout-button");
    const error=document.getElementById("checkout-error");
    error.hidden=true;
    if(!email||!email.includes("@")){
      error.textContent="Informe um email válido para receber o acesso.";
      error.hidden=false;
      return;
    }
    button.disabled=true;
    button.textContent="Abrindo checkout…";
    try{
      const response=await fetch(EDGE_BASE+"/digital-checkout",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({productId:"dp-001",email})
      });
      const data=await response.json();
      if(!response.ok||!data.checkoutUrl) throw new Error(data.message||"Checkout indisponível.");
      localStorage.setItem("nv:digital:last-access",JSON.stringify({reference:data.reference,claim:data.claim}));
      location.assign(data.checkoutUrl);
    }catch(err){
      error.textContent=err?.message||"Não foi possível iniciar o checkout.";
      error.hidden=false;
      button.disabled=false;
      button.textContent="Comprar por R$97";
    }
  });
}

const hookForm=document.getElementById("hook-form");
if(hookForm){
  hookForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    const fd=new FormData(hookForm);
    const product=String(fd.get("product")||"esta oferta").trim();
    const audience=String(fd.get("audience")||"o público certo").trim();
    const outcome=String(fd.get("outcome")||"um resultado mais claro").trim();
    const action=String(fd.get("action")||"dar o próximo passo").trim();
    const proof=String(fd.get("proof")||"").trim();
    const hooks=[
      ["Resultado",`Como usar ${product} para chegar a ${outcome} sem começar do zero.`],
      ["Diagnóstico",`Se ${audience} ainda não consegue ${outcome}, estes são os pontos que vale revisar primeiro.`],
      ["Erro",`O erro que faz ${audience} trabalhar mais e ainda assim se afastar de ${outcome}.`],
      ["Comparação",`${product} ou improviso: o que muda quando o objetivo é ${outcome}?`],
      ["Processo",`O processo em etapas para sair de uma ideia e chegar a ${outcome} com ${product}.`],
      ["Checklist",`Checklist: o que precisa estar claro antes de tentar ${action}.`],
      ["Objeção",`Você não precisa de mais volume para ${outcome}; precisa saber o que testar primeiro.`],
      ["Demonstração",`Veja como ${product} organiza a passagem de briefing para ${outcome}.`],
      ["Pergunta",`O seu conteúdo deixa ${audience} entender claramente por que deveria ${action}?`],
      ["Especificidade",`${product}: um sistema para definir mensagem, prova e próximo passo antes de publicar.`],
      ["Sequência",`Brief → mensagem → hook → CTA → teste: a sequência para buscar ${outcome} sem depender de palpites.`],
      ["Critério",`Antes de escolher uma mensagem para ${audience}, valide relevância, clareza e prova.`]
    ];
    const root=document.getElementById("hook-results");
    root.className="hook-results";
    root.innerHTML=hooks.map(([family,text])=>`
      <article class="hook-card">
        <div><span class="pill light">${family}</span><small>Risco baixo</small></div>
        <p>${escapeHtml(text)}</p>
        <span class="evidence">${proof?"Prova informada no briefing.":"Nenhuma prova específica informada; evite afirmações que dependam dela."}</span>
        <button type="button" data-copy="${escapeAttr(text)}">Copiar</button>
      </article>`).join("");
    root.querySelectorAll("[data-copy]").forEach(btn=>btn.addEventListener("click",async()=>{
      await navigator.clipboard.writeText(btn.getAttribute("data-copy"));
      btn.textContent="Copiado";
      setTimeout(()=>btn.textContent="Copiar",900);
    }));
  });
}
function escapeHtml(value){return value.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function escapeAttr(value){return escapeHtml(value);}
