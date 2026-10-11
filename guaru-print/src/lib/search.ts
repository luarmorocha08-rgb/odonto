import type { Service } from "@/content/types";

export type SearchResult = {
  href: string;
  title: string;
  description: string;
  kind: "serviço" | "ferramenta" | "página";
  score: number;
};

const STOPWORDS = new Set(["de", "da", "do", "das", "dos", "para", "pra", "com", "em", "na", "no", "a", "o", "e", "um", "uma", "meu", "minha", "quero", "preciso"]);

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(text: string) {
  return normalize(text)
    .split(/[\s-]+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

/** Plural simples → singular, para "placas" casar com "placa". */
const stem = (t: string) => (t.length > 4 && t.endsWith("s") ? t.slice(0, -1) : t);

const TOOLS = [
  {
    href: "/orcamento",
    title: "Solicitar orçamento",
    description: "Monte seu pedido e envie pelo WhatsApp",
    keywords: "orcamento preco valor pedido cotacao quanto custa comprar",
  },
  {
    href: "/simulador",
    title: "Simulador visual",
    description: "Veja sua arte aplicada em produtos",
    keywords: "simulador mockup previa visualizar ver arte aplicada teste",
  },
  {
    href: "/orcamento#calculadora",
    title: "Calculadora de medidas",
    description: "Área em m², conversão de unidades e proporção",
    keywords: "calculadora medida medidas tamanho area metro quadrado m2 converter proporcao",
  },
  {
    href: "/guia-de-impressao",
    title: "Guia de preparação de arquivos",
    description: "Resolução, sangria, CMYK e formatos",
    keywords: "arquivo sangria cmyk rgb resolucao dpi pdf vetor margem preparar arte",
  },
  {
    href: "/portfolio",
    title: "Portfólio",
    description: "Projetos e exemplos",
    keywords: "portfolio projetos trabalhos exemplos fotos",
  },
  {
    href: "/contato",
    title: "Contato",
    description: "WhatsApp, Instagram e localização",
    keywords: "contato whatsapp telefone instagram endereco onde fica guaruja",
  },
];

export function searchSite(query: string, services: Service[], limit = 6): SearchResult[] {
  const q = tokens(query).map(stem);
  if (!q.length) return [];
  const results: SearchResult[] = [];

  for (const s of services) {
    const name = tokens(s.name).map(stem);
    const kw = s.keywords.flatMap(tokens).map(stem);
    const phrases = s.keywords.map(normalize);
    const body = tokens(`${s.tagline} ${s.description} ${s.applications.join(" ")}`).map(stem);
    let score = 0;
    const nq = normalize(query);
    for (const p of phrases) if (p.includes(" ") && nq.includes(p)) score += 6;
    for (const t of q) {
      if (name.includes(t)) score += 5;
      else if (name.some((n) => n.startsWith(t) && t.length >= 3)) score += 3;
      if (kw.includes(t)) score += 4;
      else if (kw.some((k) => k.startsWith(t) && t.length >= 3)) score += 2;
      if (body.includes(t)) score += 1;
    }
    if (score > 0)
      results.push({ href: `/servicos/${s.slug}`, title: s.name, description: s.tagline, kind: "serviço", score });
  }

  for (const tool of TOOLS) {
    const kw = tokens(`${tool.title} ${tool.keywords}`).map(stem);
    let score = 0;
    for (const t of q) {
      if (kw.includes(t)) score += 3;
      else if (kw.some((k) => k.startsWith(t) && t.length >= 3)) score += 1;
    }
    if (score > 0)
      results.push({ href: tool.href, title: tool.title, description: tool.description, kind: "ferramenta", score: score - 0.5 });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

export const SEARCH_SUGGESTIONS = ["placa para loja", "adesivo para vitrine", "banner para evento", "cartão de visita", "letreiro luminoso", "sinalização de condomínio"];
