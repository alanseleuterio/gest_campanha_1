import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { BRL, D, QCOR, QORD, QROT, TOT_CG, TOT_MS, cap } from "@/data/campanha";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel · Plataforma Tiago Botelho" },
      {
        name: "description",
        content:
          "Painel de inteligência territorial da campanha Tiago Botelho: votos de 2022, quadrantes de aderência e cobertura das lideranças em Mato Grosso do Sul.",
      },
      { property: "og:title", content: "Painel · Plataforma Tiago Botelho" },
      {
        property: "og:description",
        content: "Votos de 2022, quadrantes de aderência e cobertura da rede de lideranças no MS.",
      },
    ],
  }),
  component: Painel,
});

function Painel() {
  const semLid = D.mun.filter((m) => m.l === 0).reduce((s, m) => s + m.v, 0);
  const kpis: [string, string][] = [
    [BRL(TOT_MS), "votos para o Senado em 2022 em todo o MS"],
    [BRL(TOT_CG), "votos em Campo Grande (30,7 % do total)"],
    [String(D.lid.length), `lideranças georreferenciadas em ${new Set(D.rede.lid.map((l) => l.m)).size} municípios`],
    [Math.round((semLid / TOT_MS) * 100) + " %", "do voto de 2022 está em município sem liderança"],
    ["44,5 %", "do voto de CG está a até 1 km de uma liderança"],
    ["0,355", "correlação entre voto e lideranças por bairro"],
  ];

  const ag: Record<string, { v: number; n: number }> = {};
  D.mun.forEach((m) => {
    ag[m.q] = ag[m.q] ?? { v: 0, n: 0 };
    ag[m.q]!.v += m.v;
    ag[m.q]!.n++;
  });
  const mx = Math.max(...Object.values(ag).map((a) => a.v));

  const ru: Record<string, { v: number; l: number }> = {};
  D.bai.forEach((b) => {
    ru[b.ru] = ru[b.ru] ?? { v: 0, l: 0 };
    ru[b.ru]!.v += b.v;
    ru[b.ru]!.l += b.l;
  });
  const tv = Object.values(ru).reduce((s, a) => s + a.v, 0);
  const tl = Object.values(ru).reduce((s, a) => s + a.l, 0);
  const ords = Object.entries(ru).sort((a, b) => b[1].v - a[1].v);
  const mxp = Math.max(...ords.map(([, a]) => Math.max(a.v / tv, a.l / tl))) * 100;

  const tot = D.loc.reduce((s, l) => s + l.v, 0);
  const faixas: [number, string][] = [
    [500, "até 500 m"],
    [1000, "até 1 km"],
    [2000, "até 2 km"],
    [3000, "até 3 km"],
  ];

  const orfas = D.mun
    .filter((m) => m.q === "BASE ORFA")
    .sort((a, b) => b.v - a.v)
    .slice(0, 10);

  return (
    <AppShell>
      <section className="card-tb hero">
        <img src="/favicon.ico" alt="" hidden />
        <div>
          <h1>Onde está o nosso voto e onde ainda falta gente</h1>
          <p className="sub-tb mt-2 mb-0">
            Leitura cruzada dos {BRL(TOT_MS)} votos de 2022 com a rede de lideranças de hoje. Cada
            aba responde uma pergunta prática da campanha.
          </p>
          <div className="tags">
            <span className="tag">78 municípios</span>
            <span className="tag">74 bairros de Campo Grande</span>
            <span className="tag">{D.lid.length} lideranças no mapa</span>
            <span className="tag">184 locais de votação</span>
          </div>
        </div>
      </section>

      <div className="kpis">
        {kpis.map(([a, b]) => (
          <div className="kpi" key={b}>
            <b>{a}</b>
            <span>{b}</span>
          </div>
        ))}
      </div>

      <section className="card-tb">
        <h2>Quadrantes de aderência</h2>
        <p className="sub-tb">
          Cruzamento entre desempenho eleitoral em 2022 e presença de liderança organizada.
        </p>
        <div className="bars">
          {QORD.filter((q) => ag[q]).map((q) => (
            <div key={q}>
              <div className="bar">
                <div className="lab">{QROT[q]}</div>
                <div className="trilho">
                  <div
                    className="fill"
                    style={{ width: `${(ag[q]!.v / mx) * 100}%`, background: QCOR[q] }}
                  />
                </div>
                <div className="val">{BRL(ag[q]!.v)}</div>
              </div>
              <div className="ml-[140px] text-[11px] text-tinta3">{ag[q]!.n} municípios</div>
            </div>
          ))}
        </div>
      </section>

      <section className="card-tb">
        <h2>Campo Grande: voto x liderança por região urbana</h2>
        <p className="sub-tb">
          Participação de cada região no voto de 2022 e na rede de lideranças cadastradas.
        </p>
        <div className="legpar">
          <span>
            <i style={{ background: "var(--cinza)" }} />
            % do voto
          </span>
          <span>
            <i style={{ background: "var(--pt)" }} />
            % das lideranças
          </span>
        </div>
        {ords.map(([k, a]) => {
          const pv = (a.v / tv) * 100;
          const pl = (a.l / tl) * 100;
          return (
            <div className="dupla" key={k}>
              <div className="lab text-right">{cap(k)}</div>
              <div className="par">
                <div className="t">
                  <div
                    className="f"
                    style={{ width: `${(pv / mxp) * 100}%`, background: "var(--cinza)" }}
                  />
                </div>
                <div className="t">
                  <div
                    className="f"
                    style={{ width: `${(pl / mxp) * 100}%`, background: "var(--pt)" }}
                  />
                </div>
              </div>
              <div className="val">
                {pv.toFixed(0)} / {pl.toFixed(0)} %
              </div>
            </div>
          );
        })}
      </section>

      <section className="card-tb">
        <h2>Cobertura territorial das lideranças</h2>
        <p className="sub-tb">
          Percentual do voto de Campo Grande em locais de votação próximos a uma liderança.
        </p>
        <div className="bars">
          {faixas.map(([d, r]) => {
            const p = (D.loc.filter((l) => l.d <= d).reduce((s, l) => s + l.v, 0) / tot) * 100;
            return (
              <div className="bar" key={r}>
                <div className="lab">{r}</div>
                <div className="trilho">
                  <div
                    className="fill"
                    style={{ width: `${p}%`, background: d === 1000 ? "var(--vinho)" : "var(--pt)" }}
                  />
                </div>
                <div className="val">{p.toFixed(0)} %</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card-tb">
        <h2>Prioridade imediata: bases órfãs</h2>
        <p className="sub-tb">
          Municípios com bom voto em 2022 e nenhuma liderança cadastrada até hoje.
        </p>
        <table className="tab-tb">
          <thead>
            <tr>
              <th>Município</th>
              <th className="text-right">Votos 2022</th>
              <th className="text-right">Por mil hab.</th>
              <th className="text-right">Região</th>
            </tr>
          </thead>
          <tbody>
            {orfas.map((m) => (
              <tr key={m.n}>
                <td>{m.n}</td>
                <td className="n">{BRL(m.v)}</td>
                <td className="n">{m.vm.toFixed(0)}</td>
                <td className="text-right text-[12px]">{cap(m.r)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}
