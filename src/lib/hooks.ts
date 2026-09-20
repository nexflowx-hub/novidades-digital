export type Channel = "landing" | "email" | "paid-social" | "instagram" | "short-video" | "youtube" | "whatsapp" | "ecommerce";

export interface HookBrief {
  product: string;
  audience: string;
  outcome: string;
  action: string;
  channel: Channel;
  proof: string;
}

export interface GeneratedHook {
  family: string;
  text: string;
  rationale: string;
  risk: "low" | "medium";
  evidence: string;
  rcp: { relevance: number; clarity: number; proof: number };
}

const clean = (value: string, fallback: string) => value.trim() || fallback;

export function generateHooks(input: HookBrief): GeneratedHook[] {
  const product = clean(input.product, "esta oferta");
  const audience = clean(input.audience, "o público certo");
  const outcome = clean(input.outcome, "um resultado mais claro");
  const action = clean(input.action, "dar o próximo passo");
  const proof = clean(input.proof, "nenhuma prova específica informada");

  const templates: Array<[string, string, string]> = [
    ["Resultado", "Como usar " + product + " para chegar a " + outcome + " sem começar do zero.", "Torna o resultado e a redução de esforço imediatamente visíveis."],
    ["Diagnóstico", "Se " + audience + " ainda não consegue " + outcome + ", estes são os pontos que vale revisar primeiro.", "Transforma o problema em uma verificação prática."],
    ["Erro", "O erro que faz " + audience + " trabalhar mais e ainda assim se afastar de " + outcome + ".", "Abre uma lacuna de melhoria sem prometer resultado garantido."],
    ["Comparação", product + " ou improviso: o que muda quando o objetivo é " + outcome + "?", "Cria contraste entre processo e ausência de processo."],
    ["Processo", "O processo em etapas para sair de uma ideia e chegar a " + outcome + " com " + product + ".", "Promete uma sequência, não um milagre."],
    ["Checklist", "Checklist: o que precisa estar claro antes de tentar " + action + ".", "Útil para conteúdo de decisão e fundo de funil."],
    ["Objeção", "Você não precisa de mais volume para " + outcome + "; precisa saber o que testar primeiro.", "Reposiciona uma objeção comum sem inventar prova."],
    ["Demonstração", "Veja como " + product + " organiza a passagem de briefing para " + outcome + ".", "Funciona melhor quando existe demonstração real."],
    ["Pergunta", "O seu conteúdo deixa " + audience + " entender claramente por que deveria " + action + "?", "Faz o público auditar a própria mensagem."],
    ["Especificidade", product + ": um sistema para definir mensagem, prova e próximo passo antes de publicar.", "Substitui adjetivos vagos por componentes concretos."],
    ["Sequência", "Brief → mensagem → hook → CTA → teste: a sequência para buscar " + outcome + " sem depender de palpites.", "Mostra o mecanismo em uma linha."],
    ["Critério", "Antes de escolher uma mensagem para " + audience + ", valide estes 3 critérios: relevância, clareza e prova.", "Ajuda o comprador a avaliar opções com critérios explícitos."]
  ];

  return templates.map(([family, text, rationale], index) => ({
    family,
    text,
    rationale,
    risk: /garant|100%|últimas vagas|segredo que/.test(text.toLowerCase()) ? "medium" : "low",
    evidence: index === 7 ? "Demonstração/prova disponível: " + proof : "Não presume depoimentos, números ou autoridade externa.",
    rcp: {
      relevance: Math.min(100, 76 + Math.min(input.audience.trim().length, 20)),
      clarity: Math.min(100, 80 + Math.min(input.outcome.trim().length, 15)),
      proof: input.proof.trim() ? 88 : 55
    }
  }));
}
