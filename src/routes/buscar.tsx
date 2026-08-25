import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { BRL, D, QROT, cap, fmtTel } from "@/data/campanha";

export const Route = createFileRoute("/buscar")({
  head: () => ({
    meta: [
      { title: "Buscar · Plataforma Tiago Botelho" },
      {
        name: "description",
        content:
          "Busca única por município, bairro de Campo Grande, liderança ou local de votação com votos de 2022 e quadrante de aderência.",
      },
      { property: "og:title", content: "Buscar · Plataforma Tiago Botelho" },
      {
        property: "og:description",
        content: "Encontre municípios, bairros, lideranças e locais de votação em um só campo.",
      },
    ],
  }),
  component: Buscar,
});

function Bloco({ titulo, itens }: { titulo: string; itens: [string, string][] }) {
  return (
    <>
      <div className="rot mt-4">{titulo}</div>
      <div className="lista">
        {itens.map(([a, b]) => (
          <div className="item" key={titulo + a}>
            <div>
              <b>{a}</b>
              <div className="m">{b}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Buscar() {
  const [q, setQ] = useState("");
  const t = q.trim().toLowerCase();
  const curto = t.length < 2;

  const mun = curto ? [] : D.mun.filter((x) => x.n.toLowerCase().includes(t)).slice(0, 8);
  const bai = curto ? [] : D.bai.filter((x) => x.n.toLowerCase().includes(t)).slice(0, 8);
  const lid = curto ? [] : D.lid.filter((x) => x.n.toLowerCase().includes(t)).slice(0, 10);
  const loc = curto ? [] : D.loc.filter((x) => x.n.toLowerCase().includes(t)).slice(0, 8);
  const nada = !curto && !mun.length && !bai.length && !lid.length && !loc.length;

  return (
    <AppShell>
      <section className="card-tb">
        <h2>Buscar em toda a base</h2>
        <p className="sub-tb">
          Municípios, bairros de Campo Grande, lideranças e locais de votação em um único campo.
        </p>
        <input
          className="input-tb"
          placeholder="Digite um nome"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        {curto && <div className="vazio">Digite ao menos duas letras.</div>}
        {nada && <div className="vazio">Nada encontrado.</div>}

        {mun.length > 0 && (
          <Bloco
            titulo="Municípios"
            itens={mun.map((x) => [
              x.n,
              `${BRL(x.v)} votos · ${x.l} liderança(s) · ${QROT[x.q]}`,
            ])}
          />
        )}
        {bai.length > 0 && (
          <Bloco
            titulo="Bairros de Campo Grande"
            itens={bai.map((x) => [
              cap(x.n),
              `${BRL(x.v)} votos · ${x.l} liderança(s) · ${QROT[x.q]}`,
            ])}
          />
        )}
        {lid.length > 0 && (
          <Bloco
            titulo="Lideranças"
            itens={lid.map((x) => [
              x.n,
              `${x.s || "sem segmento"}${x.b ? " · " + cap(x.b) : ""}${x.t ? " · " + fmtTel(x.t) : ""}`,
            ])}
          />
        )}
        {loc.length > 0 && (
          <Bloco
            titulo="Locais de votação"
            itens={loc.map((x) => [
              x.n,
              `${BRL(x.v)} votos · ${cap(x.b)} · ${BRL(x.d)} m da liderança mais próxima`,
            ])}
          />
        )}
      </section>
    </AppShell>
  );
}
