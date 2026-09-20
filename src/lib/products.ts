export type ProductStatus = "live" | "prelaunch" | "research";

export interface DigitalProduct {
  id: string;
  sku: string;
  slug: string;
  name: string;
  shortName: string;
  priceCents: number;
  currency: "BRL";
  status: ProductStatus;
  promise: string;
  description: string;
  deliverables: string[];
}

export const PRODUCTS: DigitalProduct[] = [
  {
    id: "dp-001",
    sku: "DIGITAL-CCOS-001",
    slug: "conversion-content-os",
    name: "Conversion Content OS",
    shortName: "Conversion Content OS",
    priceCents: 9700,
    currency: "BRL",
    status: "live",
    promise: "Transforme uma oferta ou ideia em hooks, conteúdo, CTAs e variações multicanal usando um processo repetível.",
    description: "Toolkit digital de messaging, conteúdo, persuasão ética, adaptação multicanal, IA assistida e testes.",
    deliverables: [
      "Conversion Content OS — Guide",
      "Conversion Workbook",
      "Hook Library — 300 estruturas",
      "Prompt Library — 36 prompts estruturados",
      "CTA & Offer Swipe File",
      "Content Repurposing Matrix",
      "Quick Start",
      "Customer License & Terms"
    ]
  },
  {
    id: "dp-002",
    sku: "DIGITAL-AUTO-001",
    slug: "guia-manutencao-preventiva",
    name: "Guia de Manutenção Preventiva",
    shortName: "Manutenção Preventiva",
    priceCents: 0,
    currency: "BRL",
    status: "prelaunch",
    promise: "Checklist e planner automotivo localizado para o Brasil.",
    description: "Em revisão técnica antes da publicação.",
    deliverables: ["Guia", "Checklist", "Maintenance Planner"]
  },
  {
    id: "dp-003",
    sku: "DIGITAL-SAFE-001",
    slug: "anti-golpe-digital-brasil",
    name: "Anti-Golpe Digital Brasil",
    shortName: "Anti-Golpe Digital",
    priceCents: 0,
    currency: "BRL",
    status: "research",
    promise: "Guia brasileiro atualizado de prevenção e resposta a golpes digitais.",
    description: "Em pesquisa e atualização 2026.",
    deliverables: ["Guia", "Checklist", "Incident-response card"]
  },
  {
    id: "dp-004",
    sku: "DIGITAL-PET-001",
    slug: "primeiro-filhote-90-dias",
    name: "Primeiro Filhote — 90 Dias",
    shortName: "Primeiro Filhote",
    priceCents: 0,
    currency: "BRL",
    status: "prelaunch",
    promise: "Rotina e treino comportamental para os primeiros 90 dias.",
    description: "Conteúdo comportamental em reescrita e revisão.",
    deliverables: ["Guia", "Planner 90 dias", "Training Log"]
  },
  {
    id: "dp-006",
    sku: "DIGITAL-SPB-001",
    slug: "sales-page-blueprint",
    name: "Sales Page Blueprint",
    shortName: "Sales Page Blueprint",
    priceCents: 0,
    currency: "BRL",
    status: "prelaunch",
    promise: "Sistema moderno para estruturar e auditar páginas de venda.",
    description: "Companion product do Conversion Content OS.",
    deliverables: ["Playbook", "Templates", "Audit Checklist"]
  }
];

export function getProductById(id: string) {
  return PRODUCTS.find((product) => product.id === id);
}

export function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}
