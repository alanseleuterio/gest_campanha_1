import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

import {
  MAPA_SEG,
  type Anel,
  type Bairro,
  type Dataset,
  type Lideranca,
  type LocalVotacao,
  type Municipio,
  type RedeCand,
  type RedeCoord,
  type RedeGeral,
  type RedeLid,
  type RedeRegiao,
  type RegiaoUrbana,
} from "./campanha";

const geo = (v: unknown): Anel[] => (Array.isArray(v) ? (v as Anel[]) : []);
const num = (v: unknown) => Number(v ?? 0);

/** Carrega todo o dataset geográfico/estatístico do PostgreSQL. */
export async function carregaDataset(): Promise<Dataset> {
  const [mun, bai, reg, lid, loc, rede] = await Promise.all([
    supabase.from("municipios").select("*").order("nome"),
    supabase.from("bairros").select("*").order("nome"),
    supabase.from("regioes_urbanas").select("*").order("nome"),
    supabase.from("liderancas").select("*").order("nome"),
    supabase.from("locais_votacao").select("*").order("nome"),
    supabase.from("rede").select("chave, dados"),
  ]);

  const erro = [mun, bai, reg, lid, loc, rede].find((r) => r.error)?.error;
  if (erro) throw new Error(erro.message);

  const municipios: Municipio[] = (mun.data ?? []).map((m) => ({
    n: m.nome,
    r: m.regiao,
    v: num(m.votos),
    vm: num(m.votos_mil),
    pop: num(m.populacao),
    st: m.status,
    co: m.coordenacao,
    l: num(m.liderancas),
    q: m.quadrante,
    s: (Array.isArray(m.sede) ? m.sede : [0, 0]) as [number, number],
    g: geo(m.geometria),
  }));

  const bairros: Bairro[] = (bai.data ?? []).map((b) => ({
    n: b.nome,
    ru: b.regiao_urbana,
    pop: num(b.populacao),
    v: num(b.votos),
    l: num(b.liderancas),
    q: b.quadrante,
    vpl: num(b.votos_por_local),
    vm: num(b.votos_mil),
    lo: num(b.locais),
    g: geo(b.geometria),
  }));

  const regioes: RegiaoUrbana[] = (reg.data ?? []).map((r) => ({
    n: r.nome,
    g: geo(r.geometria),
  }));

  const liderancas: Lideranca[] = (lid.data ?? []).map((l) => ({
    n: l.nome,
    s: l.segmento,
    a: l.atuacao,
    b: l.bairro,
    ru: l.regiao_urbana,
    p: l.perfil,
    lc: l.local_ref,
    t: l.telefone ?? "",
    x: num(l.lng),
    y: num(l.lat),
  }));

  const locais: LocalVotacao[] = (loc.data ?? []).map((l) => ({
    n: l.nome,
    v: num(l.votos),
    b: l.bairro,
    ru: l.regiao_urbana,
    d: num(l.distancia),
    z: num(l.zona),
    se: num(l.seccoes),
    x: num(l.lng),
    y: num(l.lat),
  }));

  const blocos = Object.fromEntries((rede.data ?? []).map((r) => [r.chave, r.dados]));
  const redeLid = ((blocos["lid"] ?? []) as RedeLid[]).map((l) => ({
    ...l,
    eixo: MAPA_SEG[l.s] ?? "Outros eixos",
  }));

  return {
    mun: municipios,
    bai: bairros,
    reg: regioes,
    lid: liderancas,
    loc: locais,
    rede: {
      cand: (blocos["cand"] ?? { n: "", sub: "", votos: 0 }) as RedeCand,
      geral: (blocos["geral"] ?? { n: "", sub: "" }) as RedeGeral,
      regioes: (blocos["regioes"] ?? []) as RedeRegiao[],
      coord: (blocos["coord"] ?? []) as RedeCoord[],
      lid: redeLid,
    },
  };
}

export const datasetQuery = queryOptions({
  queryKey: ["dataset"],
  queryFn: carregaDataset,
  staleTime: 1000 * 60 * 60,
});
