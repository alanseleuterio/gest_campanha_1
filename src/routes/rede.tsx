import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { D, cap, chave, fmtTel } from "@/data/campanha";
import { pedeFoto } from "@/lib/foto";
import { useFotos, useSalvaFoto } from "@/hooks/useDados";
import { PessoaCard } from "@/components/PessoaCard";

export const Route = createFileRoute("/rede")({
  head: () => ({
    meta: [
      { title: "Rede de lideranças · Tiago Botelho" },
      {
        name: "description",
        content:
          "Cadastro das lideranças da campanha com segmento, bairro, telefone e foto, com filtros por bairro, segmento e precisão do endereço.",
      },
      { property: "og:title", content: "Rede de lideranças · Tiago Botelho" },
      {
        property: "og:description",
        content: "Lideranças por bairro e segmento, com foto e contato.",
      },
    ],
  }),
  component: Rede,
});

function Rede() {
  const [q, setQ] = useState("");
  const [bairro, setBairro] = useState("");
  const [seg, setSeg] = useState("");
  const [prec, setPrec] = useState("");
  const [pessoa, setPessoa] = useState<string | null>(null);
  const { data: fotos = {} } = useFotos();
  const salva = useSalvaFoto();

  const bairros = useMemo(
    () =>
      [...new Set(D.lid.map((l) => l.b).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt")),
    [],
  );
  const segmentos = useMemo(
    () =>
      [...new Set(D.lid.map((l) => l.s).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt")),
    [],
  );

  const lista = D.lid.filter(
    (l) =>
      (!q || l.n.toLowerCase().includes(q.trim().toLowerCase())) &&
      (!bairro || l.b === bairro) &&
      (!seg || l.s === seg) &&
      (!prec || l.p === prec),
  );

  const comFoto = Object.keys(fotos).length;

  return (
    <AppShell>
      <section className="card-tb">
        <h2>Rede de lideranças</h2>
        <p className="sub-tb">
          {lista.length} de {D.lid.length} lideranças · {comFoto || "nenhuma"} pessoa(s) com foto
          salva no banco.
        </p>

        <div className="filtros">
          <input placeholder="Buscar por nome" value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={bairro} onChange={(e) => setBairro(e.target.value)} aria-label="Bairro">
            <option value="">Todos os bairros</option>
            {bairros.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <select value={seg} onChange={(e) => setSeg(e.target.value)} aria-label="Segmento">
            <option value="">Todos os segmentos</option>
            {segmentos.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select value={prec} onChange={(e) => setPrec(e.target.value)} aria-label="Precisão">
            <option value="">Qualquer precisão</option>
            <option value="LOTEAMENTO">Loteamento</option>
            <option value="BAIRRO">Bairro</option>
            <option value="SEM ENDEREÇO">Sem endereço</option>
          </select>
        </div>

        <div className="lista">
          {lista.length === 0 && <div className="vazio">Nenhuma liderança com esses filtros.</div>}
          {lista.map((l) => {
            const f = fotos[chave(l.n)];
            return (
              <div className="item" key={l.n + l.b}>
                {f ? (
                  <img
                    className="av"
                    src={f}
                    alt={l.n}
                    title="Trocar foto"
                    onClick={() => pedeFoto((d) => salva.mutate({ nome: l.n, foto: d }))}
                  />
                ) : (
                  <button
                    className="avbt"
                    title="Adicionar foto"
                    onClick={() => pedeFoto((d) => salva.mutate({ nome: l.n, foto: d }))}
                  >
                    +
                  </button>
                )}
                <div>
                  <button className="text-left font-bold" onClick={() => setPessoa(l.n)}>
                    {l.n}
                  </button>
                  <div className="m">
                    {l.s || "segmento não informado"}
                    {l.a ? " · " + l.a : ""}
                  </div>
                  <div className="m">
                    {l.b ? cap(l.b) + " · " + cap(l.ru) : "sem endereço na planilha"}
                  </div>
                  {l.t && <div className="m">📞 {fmtTel(l.t)}</div>}
                  <span className={`pill ${l.p === "SEM ENDEREÇO" ? "" : "a"}`}>
                    {l.p === "LOTEAMENTO" ? "loteamento" : l.p === "BAIRRO" ? "bairro" : "sem endereço"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {pessoa && (
        <section className="card-tb">
          <PessoaCard nome={pessoa} />
        </section>
      )}
    </AppShell>
  );
}
