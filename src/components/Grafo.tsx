import { useEffect, useMemo, useRef, useState } from "react";
import {
  BRL,
  COR_EIXO,
  COR_REGIAO,
  D,
  chave,
  fmtTel,
  type RedeCoord,
  type RedeLid,
} from "@/data/campanha";
import { useFotos } from "@/hooks/useDados";
import { PessoaCard } from "@/components/PessoaCard";

type Modo = "rad" | "cas";
type Agrup = "s" | "r";
type Tipo = "cand" | "geral" | "hub" | "reg" | "coord" | "lid";

interface No {
  id: string;
  t: Tipo;
  x: number;
  y: number;
  r: number;
  c: string;
  rot: string;
  lab?: boolean;
  dy?: number;
  d?: Record<string, unknown>;
}
interface Lig {
  a: string;
  b: string;
  c: string;
  fina?: boolean;
}
interface Layout {
  nos: No[];
  lig: Lig[];
  niveis?: { n: string; y: number }[];
  esq?: number;
  larg?: number;
  yEl?: number;
}

const XR = D.rede;
const corDe = (agrup: Agrup, k: string) =>
  (agrup === "s" ? COR_EIXO[k] : COR_REGIAO[k]) ?? "var(--c0)";
const grupoDe = (agrup: Agrup, l: RedeLid) => (agrup === "s" ? l.eixo : l.r || "Sem região");

function estrela(cx: number, cy: number, r: number) {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * 0.44 : r;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    d += (i ? "L" : "M") + (cx + Math.cos(a) * rr).toFixed(1) + "," + (cy + Math.sin(a) * rr).toFixed(1);
  }
  return d + "Z";
}

function layoutRadial(W: number, H: number, agrup: Agrup, ativos: Set<string>, gs: [string, number][]): Layout {
  const cx = W / 2;
  const cy = H / 2;
  const nos: No[] = [];
  const lig: Lig[] = [];
  const vis = gs.filter(([k]) => ativos.has(k));
  const peso = vis.map(([, n]) => Math.max(1.6, Math.sqrt(n)));
  const tot = peso.reduce((a, b) => a + b, 0) || 1;
  const raio = vis.map(([, n]) => 9.5 * Math.sqrt(n) + 14);
  const R1 = Math.max(...raio, 40) + 118;
  nos.push({
    id: "C",
    t: "cand",
    x: cx,
    y: cy,
    r: 20,
    c: "var(--pt)",
    rot: XR.cand.n,
    lab: true,
    d: XR.cand as unknown as Record<string, unknown>,
  });
  let ang = -Math.PI / 2;
  vis.forEach(([k, n], gi) => {
    const fatia = (2 * Math.PI * peso[gi]!) / tot;
    const a = ang + fatia / 2;
    ang += fatia;
    const hx = cx + Math.cos(a) * R1;
    const hy = cy + Math.sin(a) * R1;
    const hid = "H" + gi;
    nos.push({
      id: hid,
      t: "hub",
      x: hx,
      y: hy,
      r: 8.5 + Math.sqrt(n) * 2.6,
      c: corDe(agrup, k),
      rot: k,
      lab: true,
      d: { k, n },
    });
    lig.push({ a: "C", b: hid, c: corDe(agrup, k) });
    const mem = XR.lid.filter((l) => grupoDe(agrup, l) === k);
    const GA = 2.399963229728653;
    const c0 = n > 18 ? 10.5 : 15;
    mem.forEach((m, i) => {
      const rr = c0 * Math.sqrt(i + 1.4);
      const aa = a + i * GA;
      nos.push({
        id: "L" + gi + "_" + i,
        t: "lid",
        x: hx + Math.cos(aa) * rr,
        y: hy + Math.sin(aa) * rr,
        r: 4.4,
        c: corDe(agrup, k),
        rot: m.n,
        d: m as unknown as Record<string, unknown>,
      });
      lig.push({ a: hid, b: "L" + gi + "_" + i, c: corDe(agrup, k), fina: true });
    });
  });
  return { nos, lig };
}

function layoutCascata(W: number, H: number, agrup: Agrup, ativos: Set<string>): Layout {
  const NIV = [
    "Candidato",
    "Coordenação geral",
    "Regiões políticas",
    "Coordenadores municipais",
    "Lideranças",
    "Eleitores",
  ];
  const topo = 46;
  const alt = (H - topo - 86) / 5;
  const esq = 152;
  const dir = 30;
  const nos: No[] = [];
  const lig: Lig[] = [];
  const niveis = NIV.map((n, i) => ({ n, y: topo + i * alt }));
  const regs = XR.regioes.filter((r) => agrup !== "r" || ativos.has(r.n));
  const lidA = XR.lid.filter((l) => ativos.has(grupoDe(agrup, l)));
  type Co = RedeCoord & { fil: RedeLid[]; _id?: string };
  const arv = regs.map((rg) => {
    const co: Co[] = XR.coord
      .filter((c) => c.r === rg.n)
      .map((c) => ({ ...c, fil: lidA.filter((l) => l.m === c.m) }));
    const soltos = lidA.filter((l) => l.r === rg.n && !co.some((c) => c.m === l.m));
    return { rg, co, soltos, _id: "" };
  });
  const MIN = 9;
  const peso = arv.map((a) =>
    Math.max(MIN, a.co.reduce((s, c) => s + Math.max(c.fil.length, 1), 0) + a.soltos.length),
  );
  const somaP = peso.reduce((x, y) => x + y, 0) || 1;
  const larg = W - esq - dir;
  const yR = niveis[2]!.y;
  const yC = niveis[3]!.y;
  const yL = niveis[4]!.y;
  let acc = esq;
  arv.forEach((a, ai) => {
    const bw = (larg * peso[ai]!) / somaP;
    const x0 = acc + bw * 0.06;
    const bwi = bw * 0.88;
    acc += bw;
    const itens: { c: Co | null; f: RedeLid | null; x: number }[] = [];
    a.co.forEach((c) => {
      if (c.fil.length) c.fil.forEach((f) => itens.push({ c, f, x: 0 }));
      else itens.push({ c, f: null, x: 0 });
    });
    a.soltos.forEach((f) => itens.push({ c: null, f, x: 0 }));
    const pas = bwi / Math.max(itens.length, 1);
    itens.forEach((it, i) => (it.x = x0 + pas * (i + 0.5)));
    const rx = x0 + bwi / 2;
    const rid = "RG" + ai;
    nos.push({
      id: rid,
      t: "reg",
      x: rx,
      y: yR,
      r: 8 + Math.sqrt(a.rg.mun) * 2.1,
      c: COR_REGIAO[a.rg.n] ?? "var(--c0)",
      rot: a.rg.n,
      lab: true,
      dy: ai % 2 ? 26 : 12,
      d: { ...a.rg, niv: "Região política" },
    });
    a._id = rid;
    a.co.forEach((c, ci) => {
      const meus = itens.filter((t) => t.c === c);
      const cxx = meus.length ? meus.reduce((s, t) => s + t.x, 0) / meus.length : rx;
      const cid = "CO" + ai + "_" + ci;
      nos.push({
        id: cid,
        t: "coord",
        x: cxx,
        y: yC,
        r: 5 + Math.sqrt(Math.max(c.fil.length, 1)) * 2.8,
        c: COR_REGIAO[a.rg.n] ?? "var(--c0)",
        rot: c.n,
        lab: c.fil.length > 0,
        dy: ci % 2 ? 24 : 12,
        d: { ...c, niv: "Coordenador municipal" },
      });
      c._id = cid;
      lig.push({ a: rid, b: cid, c: "var(--linha)" });
    });
    itens.forEach((it, i) => {
      if (!it.f) return;
      const k = grupoDe(agrup, it.f);
      const id = "LD" + ai + "_" + i;
      nos.push({
        id,
        t: "lid",
        x: it.x,
        y: yL,
        r: 4.2,
        c: corDe(agrup, k),
        rot: it.f.n,
        d: it.f as unknown as Record<string, unknown>,
      });
      lig.push({ a: it.c?._id ?? rid, b: id, c: corDe(agrup, k), fina: true });
    });
  });
  const meio = esq + larg / 2;
  nos.push({
    id: "G",
    t: "geral",
    x: meio,
    y: niveis[1]!.y,
    r: 13,
    c: "var(--vinho)",
    rot: XR.geral.n,
    lab: true,
    dy: 14,
    d: { ...XR.geral, niv: "Coordenação geral" },
  });
  nos.push({
    id: "CD",
    t: "cand",
    x: meio,
    y: niveis[0]!.y,
    r: 17,
    c: "var(--n1)",
    rot: XR.cand.n,
    lab: true,
    dy: 14,
    d: XR.cand as unknown as Record<string, unknown>,
  });
  lig.push({ a: "CD", b: "G", c: "var(--cinza)" });
  arv.forEach((a) => lig.push({ a: "G", b: a._id, c: "var(--linha)" }));
  return { nos, lig, niveis, esq, larg, yEl: niveis[5]!.y };
}

export function Grafo() {
  const palco = useRef<HTMLDivElement | null>(null);
  const [modo, setModo] = useState<Modo>("rad");
  const [agrup, setAgrup] = useState<Agrup>("s");
  const [busca, setBusca] = useState("");
  const [ativos, setAtivos] = useState<Set<string>>(new Set());
  const [dim, setDim] = useState({ W: 900, H: 600 });
  const [vt, setVt] = useState({ k: 1, x: 0, y: 0 });
  const [sel, setSel] = useState<No | null>(null);
  const [dica, setDica] = useState<{ x: number; y: number; no: No } | null>(null);
  const { data: fotos = {} } = useFotos();

  const grupos = useMemo(() => {
    const g: Record<string, number> = {};
    XR.lid.forEach((l) => {
      const k = grupoDe(agrup, l);
      g[k] = (g[k] ?? 0) + 1;
    });
    return Object.entries(g).sort((a, b) => b[1] - a[1]);
  }, [agrup]);

  useEffect(() => {
    setAtivos(new Set(grupos.map(([k]) => k)));
  }, [grupos]);

  useEffect(() => {
    const el = palco.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setDim({ W: el.clientWidth || 900, H: el.clientHeight || 600 }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const L = useMemo<Layout>(() => {
    if (!ativos.size) return { nos: [], lig: [] };
    return modo === "rad"
      ? layoutRadial(dim.W, dim.H, agrup, ativos, grupos)
      : layoutCascata(dim.W, dim.H, agrup, ativos);
  }, [modo, agrup, ativos, grupos, dim]);

  // enquadra ao trocar layout
  useEffect(() => {
    if (modo !== "rad" || !L.nos.length) {
      setVt({ k: 1, x: 0, y: 0 });
      return;
    }
    let x0 = 1e9,
      y0 = 1e9,
      x1 = -1e9,
      y1 = -1e9;
    L.nos.forEach((n) => {
      const m = n.r + (n.lab ? 26 : 6);
      x0 = Math.min(x0, n.x - m);
      y0 = Math.min(y0, n.y - m);
      x1 = Math.max(x1, n.x + m);
      y1 = Math.max(y1, n.y + m);
    });
    const k = Math.min(dim.W / (x1 - x0), dim.H / (y1 - y0), 1.6) * 0.96;
    setVt({ k, x: (dim.W - (x1 - x0) * k) / 2 - x0 * k, y: (dim.H - (y1 - y0) * k) / 2 - y0 * k });
  }, [L, modo, dim]);

  const arrasto = useRef<{ on: boolean; x: number; y: number; d0: number | null }>({
    on: false,
    x: 0,
    y: 0,
    d0: null,
  });

  function zoom(f: number) {
    setVt((v) => {
      const nk = Math.max(0.5, Math.min(9, v.k * f));
      const rz = nk / v.k;
      const W = dim.W / 2;
      const H = dim.H / 2;
      return { k: nk, x: W - (W - v.x) * rz, y: H - (H - v.y) * rz };
    });
  }

  const q = busca.trim().toLowerCase();
  const idx: Record<string, No> = {};
  L.nos.forEach((n) => (idx[n.id] = n));
  const forteDe = (n: No) =>
    !q ||
    n.rot.toLowerCase().includes(q) ||
    String((n.d?.["m"] ?? "") + String(n.d?.["s"] ?? "") + String(n.d?.["r"] ?? ""))
      .toLowerCase()
      .includes(q);

  return (
    <>
      <div className="filtros">
        <div className="seg">
          <button aria-pressed={modo === "rad"} onClick={() => setModo("rad")}>
            Radial
          </button>
          <button aria-pressed={modo === "cas"} onClick={() => setModo("cas")}>
            Cascata
          </button>
        </div>
        <select
          value={agrup}
          onChange={(e) => setAgrup(e.target.value as Agrup)}
          aria-label="Agrupar por"
        >
          <option value="s">Agrupar por eixo temático</option>
          <option value="r">Agrupar por região política</option>
        </select>
        <input
          placeholder="Destacar nome, município ou segmento"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div
        className="palco"
        ref={palco}
        onMouseDown={(e) => {
          arrasto.current = { on: true, x: e.clientX, y: e.clientY, d0: null };
        }}
        onMouseUp={() => (arrasto.current.on = false)}
        onMouseLeave={() => (arrasto.current.on = false)}
        onMouseMove={(e) => {
          const a = arrasto.current;
          if (!a.on) return;
          const dx = e.clientX - a.x;
          const dy = e.clientY - a.y;
          a.x = e.clientX;
          a.y = e.clientY;
          setVt((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
        }}
        onWheel={(e) => {
          e.preventDefault();
          const r = e.currentTarget.getBoundingClientRect();
          const mx = e.clientX - r.left;
          const my = e.clientY - r.top;
          const f = e.deltaY < 0 ? 1.16 : 1 / 1.16;
          setVt((v) => {
            const nk = Math.max(0.5, Math.min(9, v.k * f));
            const rz = nk / v.k;
            return { k: nk, x: mx - (mx - v.x) * rz, y: my - (my - v.y) * rz };
          });
        }}
        onTouchStart={(e) => {
          if (e.touches.length === 1)
            arrasto.current = {
              on: true,
              x: e.touches[0]!.clientX,
              y: e.touches[0]!.clientY,
              d0: null,
            };
          if (e.touches.length === 2)
            arrasto.current.d0 = Math.hypot(
              e.touches[0]!.clientX - e.touches[1]!.clientX,
              e.touches[0]!.clientY - e.touches[1]!.clientY,
            );
        }}
        onTouchMove={(e) => {
          const a = arrasto.current;
          if (e.touches.length === 1 && a.on) {
            const dx = e.touches[0]!.clientX - a.x;
            const dy = e.touches[0]!.clientY - a.y;
            a.x = e.touches[0]!.clientX;
            a.y = e.touches[0]!.clientY;
            setVt((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
          }
          if (e.touches.length === 2 && a.d0) {
            const d = Math.hypot(
              e.touches[0]!.clientX - e.touches[1]!.clientX,
              e.touches[0]!.clientY - e.touches[1]!.clientY,
            );
            const razao = d / a.d0;
            a.d0 = d;
            setVt((v) => ({ ...v, k: Math.max(0.5, Math.min(9, v.k * razao)) }));
          }
        }}
        onTouchEnd={() => {
          arrasto.current.on = false;
          arrasto.current.d0 = null;
        }}
      >
        <div className="zoombt">
          <button onClick={() => zoom(1.25)} aria-label="Aproximar">
            +
          </button>
          <button onClick={() => zoom(1 / 1.25)} aria-label="Afastar">
            −
          </button>
        </div>
        <svg viewBox={`0 0 ${dim.W} ${dim.H}`}>
          <g transform={`translate(${vt.x},${vt.y}) scale(${vt.k})`}>
            {modo === "cas" &&
              L.niveis?.map((n, i) => (
                <g key={n.n}>
                  <text x={16} y={n.y + 4} className="nivel">
                    {n.n}
                  </text>
                  {i < 5 && (
                    <line
                      x1={16}
                      y1={n.y + 14}
                      x2={dim.W - 20}
                      y2={n.y + 14}
                      stroke="var(--linha2)"
                      strokeWidth={1}
                    />
                  )}
                </g>
              ))}
            {modo === "cas" &&
              L.yEl != null &&
              (() => {
                const pontos = Math.round(XR.cand.votos / 2400);
                return (
                  <g>
                    {Array.from({ length: pontos }, (_, i) => (
                      <circle
                        key={i}
                        cx={L.esq! + L.larg! * (i / (pontos - 1 || 1))}
                        cy={L.yEl}
                        r={3.1}
                        fill="var(--n6)"
                      />
                    ))}
                    <text x={L.esq} y={L.yEl! + 24} className="nlab">
                      {BRL(XR.cand.votos)} eleitores alcançados em 2022 · cada ponto ≈ 2.400 votos
                    </text>
                  </g>
                );
              })()}

            {L.lig.map((l, i) => {
              const a = idx[l.a];
              const b = idx[l.b];
              if (!a || !b) return null;
              const d =
                modo === "cas"
                  ? `M${a.x},${a.y}C${a.x},${(a.y + b.y) / 2} ${b.x},${(a.y + b.y) / 2} ${b.x},${b.y}`
                  : `M${a.x},${a.y}L${b.x},${b.y}`;
              return (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={l.c}
                  strokeWidth={l.fina ? 0.8 : 1.5}
                  strokeOpacity={l.fina ? 0.34 : 0.5}
                />
              );
            })}

            {L.nos.map((n) => {
              const forte = forteDe(n);
              const foto = n.t === "lid" && n.d ? fotos[chave(String(n.d["n"]))] : undefined;
              return (
                <g key={n.id}>
                  {n.t !== "lid" && (
                    <circle cx={n.x} cy={n.y} r={n.r + 4.5} fill="var(--card)" fillOpacity={0.9} />
                  )}
                  {foto && (
                    <>
                      <clipPath id={"cp" + n.id}>
                        <circle cx={n.x} cy={n.y} r={n.r + 2.6} />
                      </clipPath>
                      <image
                        x={n.x - n.r - 2.6}
                        y={n.y - n.r - 2.6}
                        width={(n.r + 2.6) * 2}
                        height={(n.r + 2.6) * 2}
                        clipPath={`url(#cp${n.id})`}
                        preserveAspectRatio="xMidYMid slice"
                        opacity={forte ? 1 : 0.2}
                        href={foto}
                      />
                    </>
                  )}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={foto ? n.r + 2.6 : n.r}
                    fill={foto ? "none" : n.c}
                    stroke={foto ? n.c : "var(--card)"}
                    strokeWidth={foto ? 2.2 : n.t === "lid" ? 1 : 2}
                    fillOpacity={forte ? 1 : 0.16}
                    strokeOpacity={forte ? 1 : 0.3}
                    className="cursor-pointer"
                    onMouseEnter={(e) => setDica({ x: e.clientX, y: e.clientY, no: n })}
                    onMouseMove={(e) => setDica({ x: e.clientX, y: e.clientY, no: n })}
                    onMouseLeave={() => setDica(null)}
                    onClick={() => setSel(n)}
                  />
                  {n.t === "cand" && (
                    <path d={estrela(n.x, n.y, n.r * 0.62)} fill="var(--card)" pointerEvents="none" />
                  )}
                  {n.lab && (modo === "rad" || n.t !== "coord" || n.r > 8) && (
                    <text
                      x={n.x}
                      y={n.y + (n.dy ?? n.r + 11)}
                      className="nlab"
                      textAnchor="middle"
                      fillOpacity={forte ? 1 : 0.25}
                    >
                      {n.rot.length > 26 ? n.rot.slice(0, 25) + "…" : n.rot}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {dica && (
        <div
          className="tipX"
          style={{
            left: Math.min(dica.x + 15, (globalThis.innerWidth || 900) - 300),
            top: Math.min(dica.y + 15, (globalThis.innerHeight || 700) - 160),
          }}
        >
          <Dica no={dica.no} />
        </div>
      )}

      <div className="legX">
        {grupos.map(([k, n]) => (
          <button
            key={k}
            aria-pressed={ativos.has(k)}
            onClick={() =>
              setAtivos((prev) => {
                if (prev.size === grupos.length) return new Set([k]);
                const nx = new Set(prev);
                if (nx.has(k)) {
                  nx.delete(k);
                  if (!nx.size) return new Set(grupos.map(([x]) => x));
                } else nx.add(k);
                return nx;
              })
            }
          >
            <i style={{ background: corDe(agrup, k) }} />
            {k}
            <span className="n">{n}</span>
          </button>
        ))}
      </div>

      <p className="aj">
        {modo === "rad"
          ? "Arraste para mover · roda do mouse para aproximar · clique em um nó"
          : "6 níveis · da candidatura ao eleitor · clique em um nó para ver o ramo"}
      </p>

      {sel && (
        <div className="card-tb mt-4">
          <Detalhe no={sel} grupos={grupos} agrup={agrup} />
        </div>
      )}
    </>
  );
}

function Dica({ no }: { no: No }) {
  const d = no.d ?? {};
  if (no.t === "cand")
    return (
      <>
        <b>{XR.cand.n}</b>
        <em>{XR.cand.sub}</em>
        <div className="mt-1">
          <em>{BRL(XR.cand.votos)} votos em 2022</em>
        </div>
      </>
    );
  if (no.t === "geral")
    return (
      <>
        <b>{XR.geral.n}</b>
        <em>{XR.geral.sub}</em>
      </>
    );
  if (no.t === "hub")
    return (
      <>
        <b>{String(d["k"])}</b>
        <em>{String(d["n"])} liderança(s) neste eixo</em>
      </>
    );
  if (no.t === "reg")
    return (
      <>
        <b>{String(d["n"])}</b>
        <em>
          {String(d["mun"])} municípios · {BRL(Number(d["v"]))} votos em 2022
        </em>
      </>
    );
  if (no.t === "coord")
    return (
      <>
        <b>{String(d["n"])}</b>
        <em>
          Coordenação de {String(d["m"])} · {String(d["r"])}
        </em>
        <div className="mt-1">
          <em>
            {(d["fil"] as unknown[] | undefined)?.length ?? 0} liderança(s) no município ·{" "}
            {BRL(Number(d["v"]))} votos em 2022
          </em>
        </div>
      </>
    );
  return (
    <>
      <b>{String(d["n"])}</b>
      <em>{String(d["s"] || "sem segmento declarado")}</em>
      <div className="mt-1">
        <em>
          {String(d["m"])} · {String(d["r"])}
        </em>
        {d["t"] ? (
          <>
            <br />
            <em>{fmtTel(String(d["t"]))}</em>
          </>
        ) : null}
      </div>
    </>
  );
}

function Detalhe({
  no,
  grupos,
  agrup,
}: {
  no: No;
  grupos: [string, number][];
  agrup: Agrup;
}) {
  const d = no.d ?? {};
  if (no.t === "cand")
    return (
      <>
        <h3>{XR.cand.n}</h3>
        <p className="sub-tb">{XR.cand.sub}</p>
        <div className="gr">
          <div>
            <b>{BRL(XR.cand.votos)}</b>
            <span>votos em 2022</span>
          </div>
          <div>
            <b>{XR.lid.length}</b>
            <span>lideranças na rede</span>
          </div>
          <div>
            <b>{XR.coord.length}</b>
            <span>coordenações municipais</span>
          </div>
          <div>
            <b>{XR.regioes.length}</b>
            <span>regiões políticas</span>
          </div>
        </div>
        <div className="mt-3">
          {grupos.map(([k, v]) => (
            <span className="pill a" key={k}>
              {k} · {v}
            </span>
          ))}
        </div>
      </>
    );
  if (no.t === "geral")
    return (
      <>
        <h3>{XR.geral.n}</h3>
        <p className="sub-tb">{XR.geral.sub} · responde por toda a estrutura estadual</p>
        <div className="gr">
          <div>
            <b>{XR.regioes.length}</b>
            <span>regiões</span>
          </div>
          <div>
            <b>{XR.coord.length}</b>
            <span>coordenadores municipais</span>
          </div>
          <div>
            <b>{XR.lid.length}</b>
            <span>lideranças</span>
          </div>
        </div>
      </>
    );
  if (no.t === "hub") {
    const mem = XR.lid.filter((l) => grupoDe(agrup, l) === String(d["k"]));
    return (
      <>
        <h3>{String(d["k"])}</h3>
        <p className="sub-tb">{mem.length} liderança(s) neste grupo</p>
        <div>
          {mem.map((m) => (
            <span className="pill" key={m.n}>
              {m.n}
            </span>
          ))}
        </div>
      </>
    );
  }
  if (no.t === "reg") {
    const coords = XR.coord.filter((c) => c.r === String(d["n"]));
    return (
      <>
        <h3>{String(d["n"])}</h3>
        <p className="sub-tb">
          {String(d["mun"])} municípios · {BRL(Number(d["v"]))} votos em 2022
        </p>
        <div className="rot">Coordenações da região</div>
        <div>
          {coords.map((c) => (
            <span className="pill a" key={c.n + c.m}>
              {c.n} · {c.m}
            </span>
          ))}
        </div>
      </>
    );
  }
  if (no.t === "coord") {
    const fil = (d["fil"] as RedeLid[] | undefined) ?? [];
    return (
      <>
        <h3>{String(d["n"])}</h3>
        <p className="sub-tb">
          Coordenação de {String(d["m"])} · {String(d["r"])} · {BRL(Number(d["v"]))} votos em 2022
        </p>
        <div className="rot">Lideranças no município</div>
        <div>
          {fil.length ? (
            fil.map((f) => (
              <span className="pill" key={f.n}>
                {f.n}
              </span>
            ))
          ) : (
            <span className="text-[13px] text-tinta3">nenhuma liderança cadastrada ainda</span>
          )}
        </div>
      </>
    );
  }
  return <PessoaCard nome={String(d["n"])} />;
}
