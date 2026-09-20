export type DigitalProduct = {
  slug: string;
  sku: string;
  title: string;
  shortTitle: string;
  priceCents: number;
  currency: "BRL";
  status: "ready" | "beta" | "planned";
  hero: string;
  description: string;
  deliverables: string[];
  tags: string[];
};

export const PRODUCTS: DigitalProduct[] = [
  {
    slug: "conversion-content-os",
    sku: "DIGITAL-CCOS-001",
    title: "Conversion Content OS",
    shortTitle: "Conversion Content OS",
    priceCents: 9700,
    currency: "BRL",
    status: "ready",
    hero: "Sistema prático de atenção, persuasão, conteúdo e conversão com IA.",
    description: "Transforma pesquisa, ideias e ofertas em hooks, conteúdos, CTAs e testes com um workflow replicável.",
    deliverables: [
      "Core Guide: Conversion Content OS",
      "Hook Engine — biblioteca de estruturas reutilizáveis",
      "CTA & Offer Swipe File",
      "Prompt Library para IA",
      "Content Repurposing Matrix",
      "Conversion Workbook",
      "Landing Page Blueprint",
      "Email Conversion Pack"
    ],
    tags: ["marketing", "copy", "conteúdo", "IA"]
  },
  {
    slug: "financeos-mei-2026",
    sku: "DIGITAL-FINMEI-001",
    title: "FinanceOS MEI 2026",
    shortTitle: "FinanceOS MEI",
    priceCents: 4700,
    currency: "BRL",
    status: "planned",
    hero: "Controle financeiro e monitor gerencial para MEI.",
    description: "Estrutura operacional para receitas, despesas, margem, compromissos, precificação e monitor de teto configurável.",
    deliverables: [
      "Dashboard operacional",
      "Livro de transações",
      "Resumo mensal",
      "Monitor de teto configurável",
      "Compromissos e calendário",
      "Calculadora de precificação",
      "Fontes e notas de atualização"
    ],
    tags: ["finanças", "MEI", "planilha", "gestão"]
  },
  {
    slug: "anti-golpe-digital-brasil",
    sku: "DIGITAL-AGDBR-001",
    title: "Anti-Golpe Digital Brasil",
    shortTitle: "Anti-Golpe Brasil",
    priceCents: 2900,
    currency: "BRL",
    status: "planned",
    hero: "Manual operacional contra golpes digitais no contexto brasileiro.",
    description: "Reconstrução moderna do material antifraude: PIX, WhatsApp, phishing, falso suporte, marketplace e resposta pós-incidente.",
    deliverables: ["Guia atualizado", "Checklist de prevenção", "Plano de resposta pós-golpe", "Cartão de emergência digital"],
    tags: ["segurança", "PIX", "WhatsApp", "fraudes"]
  },
  {
    slug: "primeiro-filhote-90-dias",
    sku: "DIGITAL-PET90-001",
    title: "Primeiro Filhote — 90 Dias",
    shortTitle: "Primeiro Filhote",
    priceCents: 2900,
    currency: "BRL",
    status: "planned",
    hero: "Guia prático dos primeiros 90 dias com um cachorro.",
    description: "Rotina, casa, reforço positivo, passeios, sono, socialização, segurança e acompanhamento.",
    deliverables: ["Guia", "Planner 30/60/90", "Checklist da casa", "Diário do filhote"],
    tags: ["pets", "cachorro", "planner"]
  }
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}
