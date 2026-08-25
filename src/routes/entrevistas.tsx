import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { D, PASSOS, PAUTAS, VOTO, cap } from "@/data/campanha";
import { baixaArquivo, pedeFoto } from "@/lib/foto";
import { useApagaFicha, useFichas, useSalvaFicha, useSalvaFoto } from "@/hooks/useDados";

export const Route = createFileRoute("/entrevistas")({
  head: () => ({
    meta: [
      { title: "Entrevistas de campo · Tiago Botelho" },
      {
        name: "description",
        content:
          "Registro das entrevistas de rua: situação de voto, pautas prioritárias, próximo passo e foto, salvos no banco da campanha.",
      },
      { property: "og:title", content: "Entrevistas de campo · Tiago Botelho" },
      {
        property: "og:description",
        content: "Fichas de entrevista salvas no banco, com exportação em CSV e JSON.",
      },
    ],
  }),
  component: Entrevistas,
});

function Entrevistas() {
  const { data: fichas = [], isLoading } = useFichas();
  const salvar = useSalvaFicha();
  const apagar = useApagaFicha();
  const salvaFoto = useSalvaFoto();

  const [nome, setNome] = useState("");
  const [bairro, setBairro] = useState("");
  const [lider, setLider] = useState("");
  const [convite, setConvite] = useState("");
  const [tel, setTel] = useState("");
  const [obs, setObs] = useState("");
  const [passo, setPasso] = useState(PASSOS[0]!);
  const [consent, setConsent] = useState(false);
  const [voto, setVoto] = useState<string | null>(null);
  const [pautas, setPautas] = useState<string[]>([]);
  const [foto, setFoto] = useState<string | null>(null);

  const bairros = useMemo(() => D.bai.map((b) => b.n).sort((a, b) => a.localeCompare(b, "pt")), []);
  const lideres = useMemo(
    () => D.lid.map((l) => l.n).sort((a, b) => a.localeCompare(b, "pt")),
    [],
  );

  function limpa() {
    setNome("");
    setBairro("");
    setLider("");
    setConvite("");
    setTel("");
    setObs("");
    setPasso(PASSOS[0]!);
    setConsent(false);
    setVoto(null);
    setPautas([]);
    setFoto(null);
  }

  async function enviar() {
    if (!nome.trim() || !bairro || !lider || !voto) {
      toast.error("Nome, bairro, liderança responsável e situação de voto são obrigatórios.");
      return;
    }
    try {
      await salvar.mutateAsync({
        nome: nome.trim(),
        bairro,
        lideranca: lider === "__outra__" ? "Outra / não cadastrada" : lider,
        codigo_convite: convite.trim() || null,
        situacao_voto: voto,
        pautas,
        proximo_passo: passo,
        telefone: consent ? tel.trim() || null : null,
        autorizou_contato: consent,
        observacao: obs.trim() || null,
        foto,
      });
      if (foto) await salvaFoto.mutateAsync({ nome: nome.trim(), foto });
      toast.success(`Ficha de ${nome.trim()} registrada.`);
      limpa();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível salvar a ficha.");
    }
  }

  function exportaCSV() {
    const cab = [
      "nome",
      "bairro",
      "lideranca_responsavel",
      "codigo_convite",
      "situacao_voto",
      "pautas",
      "proximo_passo",
      "telefone",
      "autorizou_contato",
      "observacao",
      "registrado_em",
      "tem_foto",
    ];
    const esc = (v: unknown) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
    const linhas = [cab.join(";")].concat(
      fichas.map((f) =>
        [
          f.nome,
          f.bairro,
          f.lideranca,
          f.codigo_convite,
          f.situacao_voto,
          f.pautas.join(" | "),
          f.proximo_passo,
          f.telefone,
          f.autorizou_contato ? "sim" : "nao",
          f.observacao,
          new Date(f.created_at).toLocaleString("pt-BR"),
          f.foto ? "sim" : "nao",
        ]
          .map(esc)
          .join(";"),
      ),
    );
    baixaArquivo(
      "entrevistas_tiago_botelho.csv",
      "\ufeff" + linhas.join("\n"),
      "text/csv;charset=utf-8",
    );
  }

  return (
    <AppShell>
      <section className="card-tb">
        <h2>Nova entrevista de campo</h2>
        <p className="sub-tb">
          Os campos com nome, bairro, liderança e situação de voto são obrigatórios. Tudo é salvo no
          banco da campanha, visível só para quem registrou.
        </p>

        <div className="aviso">
          Só registre telefone quando a pessoa autorizar o contato. A foto é opcional e também
          alimenta a rede de lideranças.
        </div>

        <div className="campo-tb">
          <label className="tit" htmlFor="nome">
            Nome da pessoa entrevistada
          </label>
          <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>

        <div className="campo-tb">
          <label className="tit" htmlFor="bairro">
            Bairro
          </label>
          <select id="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)}>
            <option value="">Selecione o bairro</option>
            {bairros.map((b) => (
              <option key={b} value={b}>
                {cap(b)}
              </option>
            ))}
          </select>
        </div>

        <div className="campo-tb">
          <label className="tit" htmlFor="lider">
            Liderança responsável
          </label>
          <select id="lider" value={lider} onChange={(e) => setLider(e.target.value)}>
            <option value="">Selecione a liderança</option>
            {lideres.map((l) => (
              <option key={l}>{l}</option>
            ))}
            <option value="__outra__">Outra / ainda não cadastrada</option>
          </select>
        </div>

        <div className="campo-tb">
          <label className="tit">Situação de voto</label>
          <div className="chips">
            {VOTO.map((v) => (
              <button
                type="button"
                className="chip"
                key={v}
                aria-pressed={voto === v}
                onClick={() => setVoto(voto === v ? null : v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="campo-tb">
          <label className="tit">Pautas prioritárias</label>
          <div className="chips">
            {PAUTAS.map((p) => (
              <button
                type="button"
                className="chip"
                key={p}
                aria-pressed={pautas.includes(p)}
                onClick={() =>
                  setPautas((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))
                }
              >
                {p}
              </button>
            ))}
          </div>
          <p className="aj">Pode marcar mais de uma.</p>
        </div>

        <div className="campo-tb">
          <label className="tit" htmlFor="passo">
            Próximo passo combinado
          </label>
          <select id="passo" value={passo} onChange={(e) => setPasso(e.target.value)}>
            {PASSOS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="campo-tb">
          <label className="tit" htmlFor="convite">
            Código do convite / mutirão
          </label>
          <input
            id="convite"
            type="text"
            value={convite}
            onChange={(e) => setConvite(e.target.value)}
          />
        </div>

        <div className="campo-tb">
          <label className="tit" htmlFor="tel">
            Telefone
          </label>
          <input id="tel" type="tel" value={tel} onChange={(e) => setTel(e.target.value)} />
          <label className="chk mt-2">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            A pessoa autorizou receber contato da campanha
          </label>
        </div>

        <div className="campo-tb">
          <label className="tit">Foto (opcional)</label>
          <div className="flex items-center gap-3">
            {foto ? (
              <img src={foto} alt="" className="av !h-16 !w-16" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-linha bg-sutil text-[11px] text-tinta3">
                sem foto
              </div>
            )}
            <button className="bt s" type="button" onClick={() => pedeFoto(setFoto)}>
              {foto ? "Trocar foto" : "Adicionar foto"}
            </button>
            {foto && (
              <button className="bt s" type="button" onClick={() => setFoto(null)}>
                Remover
              </button>
            )}
          </div>
        </div>

        <div className="campo-tb">
          <label className="tit" htmlFor="obs">
            Observações da conversa
          </label>
          <textarea id="obs" value={obs} onChange={(e) => setObs(e.target.value)} />
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="bt p" onClick={() => void enviar()} disabled={salvar.isPending}>
            Salvar ficha
          </button>
          <button className="bt s" onClick={limpa}>
            Limpar
          </button>
        </div>
      </section>

      <section className="card-tb">
        <h2>Fichas registradas</h2>
        <p className="sub-tb">
          {isLoading
            ? "carregando…"
            : fichas.length
              ? `${fichas.length} ficha(s) · ${fichas.filter((f) => f.situacao_voto === "Vota com a gente").length} declaram voto com a campanha`
              : "Nenhuma ficha registrada ainda."}
        </p>
        <div className="mb-3 flex flex-wrap gap-2">
          <button className="bt s" disabled={!fichas.length} onClick={exportaCSV}>
            Exportar CSV
          </button>
          <button
            className="bt s"
            disabled={!fichas.length}
            onClick={() =>
              baixaArquivo(
                "entrevistas_tiago_botelho.json",
                JSON.stringify({ gerado_em: new Date().toISOString(), fichas }, null, 1),
                "application/json",
              )
            }
          >
            Exportar JSON
          </button>
        </div>
        <div className="lista">
          {!fichas.length && <div className="vazio">As fichas salvas aparecem aqui.</div>}
          {fichas.map((f) => (
            <div className="item" key={f.id}>
              {f.foto ? (
                <img className="av" src={f.foto} alt="" />
              ) : (
                <div className="avbt" style={{ cursor: "default" }}>
                  —
                </div>
              )}
              <div className="flex-1">
                <b>{f.nome}</b>
                <div className="m">
                  {cap(f.bairro)} · liderança: {f.lideranca}
                </div>
                <div className="m">
                  {new Date(f.created_at).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {f.telefone ? " · " + f.telefone : ""}
                  {f.codigo_convite ? " · convite " + f.codigo_convite : ""}
                </div>
                {f.observacao && <div className="m mt-1 text-tinta3">&ldquo;{f.observacao}&rdquo;</div>}
                <span className="pill a">{f.situacao_voto}</span>
                {f.proximo_passo !== "Nenhum" && <span className="pill">{f.proximo_passo}</span>}
                {f.pautas.map((p) => (
                  <span className="pill" key={p}>
                    {p}
                  </span>
                ))}
                <div>
                  <button
                    className="mt-2 text-[11.5px] font-semibold text-pt underline"
                    onClick={() => apagar.mutate(f.id)}
                  >
                    Apagar ficha
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
