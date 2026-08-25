import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { Login } from "@/components/Login";
import foto from "@/assets/tiago-botelho.jpg";

const ABAS = [
  { to: "/", rot: "Painel", ic: "M4 19V9M10 19V5M16 19v-7M22 19H2" },
  { to: "/mapa", rot: "Mapa", ic: "M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3ZM9 3v15M15 6v15" },
  {
    to: "/rede",
    rot: "Rede",
    ic: "M6 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM12 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0-4v-5m0 0L6 6m6 7 6-7",
  },
  {
    to: "/conexoes",
    rot: "Conexões",
    ic: "M3 12h4l3-8 4 16 3-8h4",
  },
  { to: "/entrevistas", rot: "Entrevistas", ic: "M4 4h16v12H8l-4 4V4Z" },
  { to: "/buscar", rot: "Buscar", ic: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { session, carregando, sair } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-tinta3">
        carregando…
      </div>
    );
  }
  if (!session) return <Login />;

  return (
    <div className="min-h-screen pb-[76px] md:pb-0">
      <header className="sticky top-0 z-30 bg-pt text-primary-foreground shadow-[0_2px_14px_oklch(0.3735_0.1397_25.64/22%)]">
        <div className="mx-auto flex max-w-[1180px] items-center gap-3.5 px-4 py-2.5 md:px-[18px]">
          <svg viewBox="0 0 100 100" aria-hidden="true" className="h-[34px] w-[34px] flex-none">
            <circle cx="50" cy="50" r="48" fill="currentColor" />
            <circle cx="50" cy="50" r="42" fill="var(--pt)" />
            <path
              fill="currentColor"
              d="M50 18 L59.5 41.5 L84 43.5 L65.5 59.5 L71.5 84 L50 70.5 L28.5 84 L34.5 59.5 L16 43.5 L40.5 41.5 Z"
            />
          </svg>
          <div className="min-w-0 flex-1">
            <b className="block font-serif text-[18px] leading-[1.15]">Tiago Botelho</b>
            <span className="block truncate text-[10.5px] uppercase tracking-[0.1em] text-primary-foreground/75">
              Deputado Estadual · MS 2026
            </span>
          </div>
          <span className="hidden whitespace-nowrap rounded-full border border-primary-foreground/30 bg-primary-foreground/15 px-[11px] py-1.5 text-[10px] font-bold tracking-[0.09em] sm:inline">
            USO INTERNO
          </span>
          <img
            src={foto}
            alt="Tiago Botelho"
            className="h-[46px] w-[46px] flex-none rounded-full border-[2.5px] border-primary-foreground/90 object-cover"
            style={{ objectPosition: "50% 12%" }}
          />
          <button
            className="rounded-lg border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-1.5 text-[12px] font-semibold"
            onClick={() => void sair()}
          >
            Sair
          </button>
        </div>
        <nav className="hidden bg-pt-escuro md:block">
          <div className="mx-auto flex max-w-[1180px] gap-0.5 overflow-x-auto px-3">
            {ABAS.map((a) => {
              const ativo = a.to === "/" ? path === "/" : path.startsWith(a.to);
              return (
                <Link
                  key={a.to}
                  to={a.to}
                  className={`whitespace-nowrap border-b-[3px] px-[15px] py-3 text-[13.5px] font-semibold transition-colors ${
                    ativo
                      ? "border-estrela text-primary-foreground"
                      : "border-transparent text-primary-foreground/70 hover:text-primary-foreground"
                  }`}
                >
                  {a.rot}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>


      <main className="mx-auto max-w-[1080px] px-4 py-5">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 grid grid-cols-6 border-t border-linha bg-card md:hidden">
        {ABAS.map((a) => {
          const ativo = a.to === "/" ? path === "/" : path.startsWith(a.to);
          return (
            <Link
              key={a.to}
              to={a.to}
              className={`flex flex-col items-center gap-1 py-2 text-[10px] font-semibold ${
                ativo ? "text-pt" : "text-tinta3"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d={a.ic} />
              </svg>
              <span>{a.rot}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
