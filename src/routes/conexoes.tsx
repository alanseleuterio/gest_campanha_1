import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Grafo } from "@/components/Grafo";
import { BRL, D } from "@/data/campanha";

export const Route = createFileRoute("/conexoes")({
  head: () => ({
    meta: [
      { title: "Conexões da estrutura · Tiago Botelho" },
      {
        name: "description",
        content:
          "Grafo da estrutura política: da candidatura à coordenação geral, regiões, coordenadores municipais e lideranças, em visão radial ou em cascata.",
      },
      { property: "og:title", content: "Conexões da estrutura · Tiago Botelho" },
      {
        property: "og:description",
        content: "Radial e cascata: como a rede política se conecta até o eleitor.",
      },
    ],
  }),
  component: Conexoes,
});

function Conexoes() {
  return (
    <AppShell>
      <section className="card-tb">
        <h2>Como a estrutura se conecta</h2>
        <p className="sub-tb">
          {BRL(D.rede.cand.votos)} votos em 2022 · {D.rede.regioes.length} regiões políticas ·{" "}
          {D.rede.coord.length} coordenações municipais · {D.rede.lid.length} lideranças.
        </p>
        <ClientOnly fallback={<div className="palco" />}>
          <Grafo />
        </ClientOnly>
      </section>
    </AppShell>
  );
}
