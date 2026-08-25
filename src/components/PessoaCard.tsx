import { D, QROT, cap, chave, fmtTel, BRL } from "@/data/campanha";
import { pedeFoto } from "@/lib/foto";
import { useFotos, useSalvaFoto } from "@/hooks/useDados";

export function PessoaCard({ nome }: { nome: string }) {
  const { data: fotos = {} } = useFotos();
  const salva = useSalvaFoto();

  const k = chave(nome);
  const base = D.rede.lid.find((x) => chave(x.n) === k);
  const geo = D.lid.find((x) => chave(x.n) === k);
  const mun = base?.m || "Campo Grande";
  const co = D.rede.coord.find((c) => c.m === mun);
  const bai = geo?.b ? D.bai.find((b) => b.n === geo.b) : null;
  const colegas = D.rede.lid.filter((x) => x.m === mun && chave(x.n) !== k);
  const vizinhos = geo?.b ? D.lid.filter((x) => x.b === geo.b && chave(x.n) !== k) : [];
  const f = fotos[k];
  const tel = base?.t || geo?.t;

  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="text-center">
        {f ? (
          <img
            src={f}
            alt={nome}
            className="h-24 w-24 rounded-2xl border-2 border-card object-cover shadow"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-dashed border-linha bg-sutil text-[11px] text-tinta3">
            sem foto
          </div>
        )}
        <button
          className="bt s mt-2 px-3 py-[7px] text-[12px]"
          onClick={() => pedeFoto((d) => salva.mutate({ nome, foto: d }))}
        >
          {f ? "Trocar foto" : "Adicionar foto"}
        </button>
      </div>

      <div className="min-w-[220px] flex-1">
        <h3 className="text-[19px]">{nome}</h3>
        <div className="mt-1 text-[12.5px] text-tinta2">
          {base?.s || geo?.s || "segmento não declarado"}
          {geo?.a ? " · " + geo.a : ""}
        </div>
        <div className="gr">
          <div>
            <b className="!text-[14px]">{mun}</b>
            <span>município</span>
          </div>
          <div>
            <b className="!text-[14px]">{base?.r || "—"}</b>
            <span>região política</span>
          </div>
          {geo?.b && (
            <div>
              <b className="!text-[14px]">{cap(geo.b)}</b>
              <span>bairro oficial</span>
            </div>
          )}
          {geo?.ru && (
            <div>
              <b className="!text-[14px]">{cap(geo.ru)}</b>
              <span>região urbana</span>
            </div>
          )}
          {tel && (
            <div>
              <b className="!text-[14px]">{fmtTel(tel)}</b>
              <span>telefone</span>
            </div>
          )}
          <div>
            <b className="!text-[14px]">{co ? co.n : "não nomeada"}</b>
            <span>coordenação do município</span>
          </div>
        </div>

        {bai && (
          <div className="gr">
            <div>
              <b>{BRL(bai.v)}</b>
              <span>votos de 2022 no bairro</span>
            </div>
            <div>
              <b>{bai.l}</b>
              <span>lideranças no bairro</span>
            </div>
            <div>
              <b className="!text-[13px]">{QROT[bai.q]}</b>
              <span>quadrante do bairro</span>
            </div>
          </div>
        )}

        {geo?.p && (
          <>
            <div className="rot mt-3">Precisão do georreferenciamento</div>
            <span className={`pill ${geo.p === "SEM ENDEREÇO" ? "" : "a"}`}>
              {geo.p === "LOTEAMENTO"
                ? `centroide do loteamento «${geo.lc}»`
                : geo.p === "BAIRRO"
                  ? `centroide do bairro «${geo.lc}»`
                  : "sem endereço na planilha"}
            </span>
          </>
        )}

        {vizinhos.length > 0 && (
          <>
            <div className="rot mt-3">Outras lideranças no mesmo bairro</div>
            {vizinhos.slice(0, 12).map((v) => (
              <span className="pill" key={v.n}>
                {v.n}
              </span>
            ))}
          </>
        )}
        {vizinhos.length === 0 && colegas.length > 0 && (
          <>
            <div className="rot mt-3">Outras lideranças em {mun}</div>
            {colegas.slice(0, 12).map((v) => (
              <span className="pill" key={v.n}>
                {v.n}
              </span>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
