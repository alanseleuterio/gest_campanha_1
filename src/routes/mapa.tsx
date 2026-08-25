import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { lazy } from "react";
import { AppShell } from "@/components/AppShell";

const Mapa = lazy(() => import("@/components/MapaLeaflet"));

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa eleitoral · Tiago Botelho" },
      {
        name: "description",
        content:
          "Mapa interativo dos 78 municípios do MS e dos 74 bairros de Campo Grande com votos de 2022, quadrantes de aderência e lideranças georreferenciadas.",
      },
      { property: "og:title", content: "Mapa eleitoral · Tiago Botelho" },
      {
        property: "og:description",
        content: "Municípios, bairros, lideranças e locais de votação em um mapa único.",
      },
    ],
  }),
  component: PaginaMapa,
});

function PaginaMapa() {
  return (
    <AppShell>
      <section className="card-tb">
        <h2>Mapa do voto e da rede</h2>
        <p className="sub-tb mb-0">
          Alterne entre o estado e Campo Grande, troque o tema das cores e clique em uma área ou
          liderança para ver o detalhe.
        </p>
      </section>
      <ClientOnly
        fallback={
          <div className="mapwrap">
            <div className="mapbox flex items-center justify-center text-sm text-tinta3">
              carregando mapa…
            </div>
          </div>
        }
      >
        <Mapa />
      </ClientOnly>
    </AppShell>
  );
}
