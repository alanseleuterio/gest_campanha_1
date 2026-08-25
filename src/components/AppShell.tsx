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
      <header className="sticky top-0 z-20 border-b border-linha bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1080px] items-center gap-3 px-4 py-3">
          <img
            src={foto}
            alt="Tiago Botelho"
            className="h-10 w-10 flex-none rounded-xl object-cover"
            style={{ objectPosition: "50% 8%" }}
          />
          <div className="min-w-0 flex-1">
            <div className="truncate font-serif text-[16px] font-bold">Tiago Botelho</div>
            <div className="truncate text-[11.5px] text-tinta2">
              Inteligência territorial · PT/MS 2026
            </div>
          </div>
          <button className="bt s px-3 py-2 text-[12px]" onClick={() => void sair()}>
            Sair
          </button>
        </div>
        <nav className="mx-auto hidden max-w-[1080px] gap-1 overflow-x-auto px-3 pb-2 md:flex">
          {ABAS.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="rounded-lg px-3 py-2 text-[13px] font-semibold text-tinta2 aria-[current=page]:bg-pt aria-[current=page]:text-white"
              activeOptions={{ exact: a.to === "/" }}
              aria-current={
                (a.to === "/" ? path === "/" : path.startsWith(a.to)) ? "page" : undefined
              }
            >
              {a.rot}
            </Link>
          ))}
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
