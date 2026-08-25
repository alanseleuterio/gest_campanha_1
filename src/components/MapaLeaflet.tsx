import { useEffect, useRef, useState } from "react";
import type * as LeafletNS from "leaflet";
import {
  BRL,
  D,
  QCOR,
  QORD,
  QROT,
  RAMPA,
  cap,
  chave,
  type Bairro,
  type Municipio,
} from "@/data/campanha";
import { useFotos } from "@/hooks/useDados";
import { PessoaCard } from "@/components/PessoaCard";

type Modo = "MS" | "CG";
type Tema = "q" | "v" | "vm" | "l";
type Fundo = "claro" | "ruas" | "sat" | "nenhum";

const TEMAS: Record<Modo, [Tema, string][]> = {
  MS: [
    ["q", "Quadrante de aderência"],
    ["v", "Votos de 2022"],
    ["vm", "Votos por mil habitantes"],
    ["l", "Lideranças cadastradas"],
  ],
  CG: [
    ["q", "Quadrante de aderência"],
    ["v", "Votos de 2022"],
    ["l", "Lideranças por bairro"],
    ["vm", "Votos por mil habitantes"],
  ],
};

const FUNDOS: Record<string, { u: string; a: string; mx: number; sd?: string }> = {
  ruas: { u: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", a: "&copy; OpenStreetMap", mx: 19 },
  sat: {
    u: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    a: "Imagens: Esri, Maxar, Earthstar Geographics",
    mx: 18,
  },
  claro: {
    u: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    a: "&copy; OpenStreetMap &copy; CARTO",
    mx: 19,
    sd: "abcd",
  },
};

const anelGeo = (f: Municipio | Bairro) => ({
  type: "Feature" as const,
  properties: f,
  geometry: { type: "MultiPolygon" as const, coordinates: f.g.map((r) => [r]) },
});

export default function MapaLeaflet() {
  const box = useRef<HTMLDivElement | null>(null);
  const mapa = useRef<LeafletNS.Map | null>(null);
  const camadas = useRef<LeafletNS.Layer[]>([]);
  const fundoRef = useRef<LeafletNS.TileLayer | null>(null);
  const Lref = useRef<typeof LeafletNS | null>(null);

  const [modo, setModo] = useState<Modo>("MS");
  const [tema, setTema] = useState<Tema>("q");
  const [fundo, setFundo] = useState<Fundo>("claro");
  const [poli, setPoli] = useState(true);
  const [pontos, setPontos] = useState(true);
  const [locais, setLocais] = useState(true);
  const [sel, setSel] = useState<Municipio | Bairro | null>(null);
  const [pessoa, setPessoa] = useState<string | null>(null);
  const { data: fotos = {} } = useFotos();

  useEffect(() => {
    let vivo = true;
    void import("leaflet").then((mod) => {
      if (!vivo || !box.current) return;
      const L = (mod.default ?? mod) as typeof LeafletNS;
      Lref.current = L;
      mapa.current = L.map(box.current, {
        zoomControl: true,
        attributionControl: true,
        preferCanvas: true,
      });
      setPronto((n) => n + 1);
    });
    return () => {
      vivo = false;
      mapa.current?.remove();
      mapa.current = null;
    };
  }, []);

  const [pronto, setPronto] = useState(0);

  // fundo
  useEffect(() => {
    const L = Lref.current;
    const m = mapa.current;
    if (!L || !m || !box.current) return;
    if (fundoRef.current) {
      m.removeLayer(fundoRef.current);
      fundoRef.current = null;
    }
    if (fundo === "nenhum") {
      box.current.style.background = "var(--sutil)";
      return;
    }
    box.current.style.background = "var(--cinza)";
    const f = FUNDOS[fundo]!;
    fundoRef.current = L.tileLayer(f.u, {
      maxZoom: f.mx,
      attribution: f.a,
      subdomains: f.sd ?? "abc",
      crossOrigin: true,
    }).addTo(m);
    fundoRef.current.bringToBack();
  }, [fundo, pronto]);

  // polígonos e pontos
  useEffect(() => {
    const L = Lref.current;
    const m = mapa.current;
    if (!L || !m) return;

    camadas.current.forEach((c) => m.removeLayer(c));
    camadas.current = [];
    const escuro = fundo === "sat";
    const arr: (Municipio | Bairro)[] = modo === "MS" ? D.mun : D.bai;

    const corTema = (f: Municipio | Bairro) => {
      if (tema === "q") return QCOR[f.q] ?? "#ECE8E7";
      const val = tema === "v" ? f.v : tema === "vm" ? f.vm : f.l;
      const mx =
        Math.max(...arr.map((a) => (tema === "v" ? a.v : tema === "vm" ? a.vm : a.l))) || 1;
      if (!val) return SEM_REGISTRO;
      return RAMPA[Math.min(4, Math.floor(Math.pow(val / mx, 0.45) * 5))]!;
    };

    const camPoli = L.geoJSON(
      { type: "FeatureCollection", features: arr.map(anelGeo) } as never,
      {
        style: (f) => ({
          fillColor: corTema((f as { properties: Municipio | Bairro }).properties),
          fillOpacity: escuro ? 0.62 : 0.74,
          color: "#FFFFFF",
          weight: 1,
          opacity: 0.9,
        }),
        onEachFeature: (f, l) => {
          const p = f.properties as Municipio | Bairro;
          l.bindTooltip(
            `<b>${p.n}</b><br>${BRL(p.v)} votos · ${p.l} liderança(s)<br><i>${QROT[p.q]}</i>`,
            { sticky: true, className: "ttl" },
          );
          l.on("mouseover", () =>
            (l as LeafletNS.Path).setStyle({ weight: 2.6, color: "#7A0F14" }),
          );
          l.on("mouseout", () => camPoli.resetStyle(l as LeafletNS.Path));
          l.on("click", () => {
            setSel(p);
            setPessoa(null);
          });
        },
      },
    );
    if (poli) camPoli.addTo(m);
    camadas.current.push(camPoli);

    if (modo === "CG") {
      const camReg = L.geoJSON(
        {
          type: "FeatureCollection",
          features: D.reg.map((r) => ({
            type: "Feature",
            properties: r,
            geometry: { type: "MultiPolygon", coordinates: r.g.map((a) => [a]) },
          })),
        } as never,
        {
          style: { fill: false, color: escuro ? "#FFF" : "#1E1E1E", weight: 1.6, opacity: 0.85 },
          interactive: false,
        },
      ).addTo(m);
      camadas.current.push(camReg);

      if (locais) {
        const camLoc = L.layerGroup(
          D.loc.map((l) =>
            L.circleMarker([l.y, l.x], {
              radius: Math.max(3, Math.sqrt(l.v) / 2.4),
              fillColor: l.d > 1000 ? "#5E1418" : "#C10D0D",
              fillOpacity: 0.9,
              color: "#fff",
              weight: 1.4,
            }).bindTooltip(
              `<b>${l.n}</b><br>${BRL(l.v)} votos · ${l.se} seções<br>${BRL(l.d)} m da liderança mais próxima`,
              { sticky: true, className: "ttl" },
            ),
          ),
        ).addTo(m);
        camadas.current.push(camLoc);
      }

      if (pontos) {
        const camLid = L.layerGroup(
          D.lid
            .filter((l) => l.x)
            .map((l) => {
              const f = fotos[chave(l.n)];
              const ic = f
                ? L.divIcon({
                    className: "",
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                    html: `<img src="${f}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;border:2.5px solid #141414;box-shadow:0 1px 4px rgba(0,0,0,.4)">`,
                  })
                : L.divIcon({
                    className: "",
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                    html: `<div style="width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-bottom:14px solid #141414;filter:drop-shadow(0 0 1.5px #fff)"></div>`,
                  });
              return L.marker([l.y, l.x], { icon: ic })
                .bindTooltip(
                  `<b>${l.n}</b><br>${l.s || "sem segmento"}<br>${cap(l.b)} · ${cap(l.ru)}`,
                  { sticky: true, className: "ttl" },
                )
                .on("click", () => {
                  setPessoa(l.n);
                  setSel(null);
                });
            }),
        ).addTo(m);
        camadas.current.push(camLid);
      }
    } else {
      const camMun = L.layerGroup(
        D.mun
          .filter((x) => x.v > 0)
          .map((x) =>
            L.circleMarker([x.s[1], x.s[0]], {
              radius: Math.max(3, Math.sqrt(x.v) / 26),
              fill: false,
              color: escuro ? "#FFF" : "#2B2B2B",
              weight: 1.3,
            }).bindTooltip(`<b>${x.n}</b><br>${BRL(x.v)} votos em 2022`, {
              sticky: true,
              className: "ttl",
            }),
          ),
      ).addTo(m);
      camadas.current.push(camMun);
    }

    m.fitBounds(camPoli.getBounds(), { padding: [16, 16] });
    setTimeout(() => m.invalidateSize(), 60);
  }, [modo, tema, fundo, poli, pontos, locais, fotos, pronto]);

  const lids = sel && "ru" in sel ? D.lid.filter((l) => l.b === sel.n) : [];

  return (
    <div className="mapwrap">
      <div className="mapctl">
        <div className="seg">
          <button aria-pressed={modo === "MS"} onClick={() => (setModo("MS"), setTema("q"))}>
            Mato Grosso do Sul
          </button>
          <button aria-pressed={modo === "CG"} onClick={() => (setModo("CG"), setTema("q"))}>
            Campo Grande
          </button>
        </div>
        <select value={tema} onChange={(e) => setTema(e.target.value as Tema)} aria-label="Tema">
          {TEMAS[modo].map(([v, r]) => (
            <option key={v} value={v}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={fundo}
          onChange={(e) => setFundo(e.target.value as Fundo)}
          aria-label="Fundo do mapa"
        >
          <option value="claro">Fundo claro</option>
          <option value="ruas">Ruas</option>
          <option value="sat">Satélite</option>
          <option value="nenhum">Sem fundo</option>
        </select>
        <label className="chk">
          <input type="checkbox" checked={poli} onChange={(e) => setPoli(e.target.checked)} />
          Áreas
        </label>
        {modo === "CG" && (
          <>
            <label className="chk">
              <input
                type="checkbox"
                checked={pontos}
                onChange={(e) => setPontos(e.target.checked)}
              />
              Lideranças
            </label>
            <label className="chk">
              <input
                type="checkbox"
                checked={locais}
                onChange={(e) => setLocais(e.target.checked)}
              />
              Locais de votação
            </label>
          </>
        )}
      </div>

      <div className="mapbox" ref={box} />

      <div className="mapfoot">
        {tema === "q" ? (
          QORD.filter((q) => (modo === "MS" ? D.mun : D.bai).some((f) => f.q === q)).map((q) => (
            <span className="lg" key={q}>
              <i style={{ background: QCOR[q] }} />
              {QROT[q]}
            </span>
          ))
        ) : (
          <>
            <span className="font-semibold">
              Menos{" "}
              {tema === "v" ? "votos em 2022" : tema === "vm" ? "votos por mil hab." : "lideranças"}
            </span>
            {RAMPA.map((c) => (
              <span className="lg" key={c}>
                <i style={{ background: c }} />
              </span>
            ))}
            <span className="font-semibold">mais</span>
          </>
        )}
        {modo === "MS" ? (
          <span className="lg">○ círculo proporcional aos votos de 2022</span>
        ) : (
          <>
            {pontos && <span className="lg">▲ liderança (foto quando cadastrada)</span>}
            {locais && <span className="lg">● local de votação (escuro: mais de 1 km)</span>}
            <span className="lg">— limite das regiões urbanas</span>
          </>
        )}
      </div>

      <div className="detalhe">
        {pessoa ? (
          <PessoaCard nome={pessoa} />
        ) : sel ? (
          "ru" in sel ? (
            <>
              <h3>{sel.n}</h3>
              <div className="text-[12.5px] text-tinta2">
                {cap(sel.ru)} · população 2010: {BRL(sel.pop)}
              </div>
              <div className="gr">
                <div>
                  <b>{BRL(sel.v)}</b>
                  <span>votos em 2022</span>
                </div>
                <div>
                  <b>{sel.l}</b>
                  <span>lideranças</span>
                </div>
                <div>
                  <b>{sel.vpl ? BRL(sel.vpl) : "—"}</b>
                  <span>votos por liderança</span>
                </div>
                <div>
                  <b>{sel.lo}</b>
                  <span>locais de votação</span>
                </div>
                <div>
                  <b className="!text-[13px]">{QROT[sel.q]}</b>
                  <span>quadrante</span>
                </div>
              </div>
              {lids.length > 0 && (
                <div className="mt-3">
                  <div className="rot">Lideranças no bairro</div>
                  {lids.map((l) => (
                    <button
                      key={l.n}
                      className="pill a"
                      onClick={() => (setPessoa(l.n), setSel(null))}
                    >
                      {l.n}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h3>{sel.n}</h3>
              <div className="text-[12.5px] text-tinta2">
                {cap(sel.r)} · {sel.st}
                {sel.co ? " · coordenação: " + sel.co : ""}
              </div>
              <div className="gr">
                <div>
                  <b>{BRL(sel.v)}</b>
                  <span>votos em 2022</span>
                </div>
                <div>
                  <b>{sel.vm.toFixed(0)}</b>
                  <span>votos por mil hab.</span>
                </div>
                <div>
                  <b>{BRL(sel.pop)}</b>
                  <span>população 2021</span>
                </div>
                <div>
                  <b>{sel.l}</b>
                  <span>lideranças hoje</span>
                </div>
                <div>
                  <b className="!text-[13px]">{QROT[sel.q]}</b>
                  <span>quadrante</span>
                </div>
              </div>
            </>
          )
        ) : (
          <>
            <h3>Clique em um {modo === "MS" ? "município" : "bairro"}</h3>
            <p className="mt-1 text-[12.5px] text-tinta2">
              Arraste para mover e use a roda do mouse para aproximar.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
