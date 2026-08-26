
export type Anel = [number, number][];

export interface Municipio {
  n: string;
  r: string;
  v: number;
  vm: number;
  pop: number;
  st: string;
  co: string | null;
  l: number;
  q: string;
  s: [number, number];
  g: Anel[];
}

export interface Bairro {
  n: string;
  ru: string;
  pop: number;
  v: number;
  l: number;
  q: string;
  vpl: number;
  vm: number;
  lo: number;
  g: Anel[];
}

export interface RegiaoUrbana {
  n: string;
  g: Anel[];
}

export interface Lideranca {
  n: string;
  s: string;
  a: string;
  b: string;
  ru: string;
  p: string;
  lc: string;
  t: string;
  x: number;
  y: number;
}

export interface LocalVotacao {
  n: string;
  v: number;
  b: string;
  ru: string;
  d: number;
  z: number;
  se: number;
  x: number;
  y: number;
}

export interface RedeCand {
  n: string;
  sub: string;
  votos: number;
}
export interface RedeGeral {
  n: string;
  sub: string;
}
export interface RedeRegiao {
  n: string;
  v: number;
  mun: number;
}
export interface RedeCoord {
  n: string;
  m: string;
  r: string;
  t: string | null;
  v: number;
}
export interface RedeLid {
  n: string;
  s: string;
  m: string;
  r: string;
  b: string;
  t: string | null;
  eixo: string;
}

export interface Dataset {
  mun: Municipio[];
  bai: Bairro[];
  reg: RegiaoUrbana[];
  lid: Lideranca[];
  loc: LocalVotacao[];
  rede: {
    cand: RedeCand;
    geral: RedeGeral;
    regioes: RedeRegiao[];
    coord: RedeCoord[];
    lid: RedeLid[];
  };
}

export const TOT_MS = 178041;
export const TOT_CG = 54721;

export const QCOR: Record<string, string> = {
  "BASE ORFA": "#B08585",
  "BASE A ATIVAR": "#C0503C",
  "BASE A REFORCAR": "#C0503C",
  "BASE CONSOLIDADA": "#7A0F14",
  "ESTRUTURA SEM RETORNO": "#DF8A79",
  "FORA DO RADAR": "#ECE8E7",
};

export const QROT: Record<string, string> = {
  "BASE ORFA": "Base órfã",
  "BASE A ATIVAR": "Base a ativar",
  "BASE A REFORCAR": "Base a reforçar",
  "BASE CONSOLIDADA": "Base consolidada",
  "ESTRUTURA SEM RETORNO": "Estrutura sem retorno",
  "FORA DO RADAR": "Fora do radar",
};

export const QORD = [
  "BASE CONSOLIDADA",
  "BASE A ATIVAR",
  "BASE A REFORCAR",
  "BASE ORFA",
  "ESTRUTURA SEM RETORNO",
  "FORA DO RADAR",
];

export const RAMPA = ["#FBE9E6", "#F3C4BA", "#E0887A", "#D10A0A", "#6E1014"];

/** Cor de área sem registro no tema coroplético. */
export const SEM_REGISTRO = "#F2EDEC";

/** Agrupamento dos segmentos em eixos temáticos (junta a cauda longa). */
export const MAPA_SEG: Record<string, string> = {
  Educação: "Educação",
  "Autônomos e comércio": "Autônomos e comércio",
  Comunitária: "Comunitária",
  Cultura: "Cultura",
  Saúde: "Saúde",
  Sindical: "Sindical e segurança",
  "Segurança pública": "Sindical e segurança",
  "Terra e povos": "Terra, aposentados e mulheres",
  Aposentados: "Terra, aposentados e mulheres",
  Mulheres: "Terra, aposentados e mulheres",
  Outros: "Outros eixos",
  "Sem segmento": "Sem eixo declarado",
};

export const COR_EIXO: Record<string, string> = {
  Educação: "var(--c1)",
  "Autônomos e comércio": "var(--c2)",
  Comunitária: "var(--c3)",
  Cultura: "var(--c4)",
  Saúde: "var(--c5)",
  "Sindical e segurança": "var(--c6)",
  "Terra, aposentados e mulheres": "var(--c7)",
  "Outros eixos": "var(--c8)",
  "Sem eixo declarado": "var(--c0)",
};

export const COR_REGIAO: Record<string, string> = {
  "Campo Grande": "var(--c1)",
  "Grande Dourados": "var(--c2)",
  Pantanal: "var(--c3)",
  Bolsão: "var(--c4)",
  "Sul Fronteira": "var(--c5)",
  Conesul: "var(--c6)",
  Leste: "var(--c7)",
  Norte: "var(--c8)",
  Sudoeste: "var(--c3)",
  "Sem região": "var(--c0)",
};

/**
 * Dados da campanha vindos do PostgreSQL. O objeto tem identidade estável e é
 * preenchido por `aplicaDataset` no carregamento da aplicação (rota raiz).
 */
export const D: Dataset = {
  mun: [],
  bai: [],
  reg: [],
  lid: [],
  loc: [],
  rede: {
    cand: { n: "", sub: "", votos: 0 },
    geral: { n: "", sub: "" },
    regioes: [],
    coord: [],
    lid: [],
  },
};

/** Substitui o conteúdo de `D` pelos dados carregados do banco. */
export function aplicaDataset(d: Dataset) {
  D.mun = d.mun;
  D.bai = d.bai;
  D.reg = d.reg;
  D.lid = d.lid;
  D.loc = d.loc;
  D.rede = d.rede;
}


export const VOTO = [
  "Vota com a gente",
  "Tende a votar",
  "Indeciso",
  "Tende a não votar",
  "Vota em outro",
  "Não quis dizer",
];

export const PAUTAS = [
  "Saúde",
  "Educação",
  "Segurança pública",
  "Emprego e renda",
  "Custo de vida",
  "Transporte público",
  "Asfalto e pavimentação",
  "Água e esgoto",
  "Iluminação pública",
  "Moradia",
  "Assistência social",
  "Meio ambiente",
  "Cultura e esporte",
  "Direitos das mulheres",
  "Juventude",
  "Pessoa com deficiência",
];

export const PASSOS = [
  "Nenhum",
  "Voltar para conversar",
  "Entrar em grupo de WhatsApp",
  "Virar cabo eleitoral",
  "Ceder espaço para reunião",
  "Indicar outras pessoas",
];

export const BRL = (n: number | null | undefined) => (n || 0).toLocaleString("pt-BR");

export const cap = (s: string | null | undefined) =>
  (s || "")
    .toLowerCase()
    .replace(/(^|\s|-)([a-zà-ú])/g, (_m, a: string, b: string) => a + b.toUpperCase());

export const chave = (s: string | null | undefined) =>
  (s || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

export const fmtTel = (t: string | null | undefined) =>
  t && t.length >= 10 ? `(${t.slice(0, 2)}) ${t.slice(2, -4)}-${t.slice(-4)}` : t || "";
