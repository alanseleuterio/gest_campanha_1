# 4. Camada de dados no front

## 4.1 `src/data/campanha.ts` — contratos e constantes

Concentra:

- **Tipos**: `Municipio`, `Bairro`, `RegiaoUrbana`, `Lideranca`, `LocalVotacao`, os blocos de rede
  (`RedeCand`, `RedeGeral`, `RedeRegiao`, `RedeCoord`, `RedeLid`) e o agregado `Dataset`.
- **Constantes eleitorais**: `TOT_MS = 178041`, `TOT_CG = 54721`.
- **Escalas de cor** (hexadecimais literais, exigidos pelo Canvas do Leaflet):
  - `QCOR` — cor por status de base;
  - `QROT` — rótulo legível de cada status;
  - `QORD` — ordem canônica dos status em legendas;
  - `RAMPA` — rampa coroplética de 5 tons: `#FBE9E6 → #F3C4BA → #E0887A → #D10A0A → #6E1014`;
  - `SEM_REGISTRO = "#F2EDEC"` — área sem dado.
- **Agrupamentos**: `MAPA_SEG` (segmento → eixo temático), `COR_EIXO`, `COR_REGIAO`.
- **Store `D`**: objeto `Dataset` de identidade estável, inicialmente vazio.
- **`aplicaDataset(d)`**: preenche `D` com o conteúdo carregado do banco.
- **Utilitários**: formatação de moeda BRL, telefone e `chave()` (normalização de nome para slug,
  usada como chave de foto).

> `D` só está preenchido depois que a rota raiz resolve `datasetQuery`. Nenhum módulo deve ler `D`
> em tempo de importação — apenas dentro de componentes/handlers.

## 4.2 `src/data/dataset.remoto.ts` — carga do banco

```ts
export async function carregaDataset(): Promise<Dataset>
export const datasetQuery = queryOptions({
  queryKey: ["dataset"],
  queryFn: carregaDataset,
  staleTime: 60 * 60 * 1000, // 1 hora
});
```

- Dispara as seis consultas em paralelo (`Promise.all`) sobre `municipios`, `bairros`,
  `regioes_urbanas`, `liderancas`, `locais_votacao` e `rede`.
- Se qualquer consulta retornar erro, lança o primeiro erro encontrado (a rota raiz cai no
  `ErrorComponent`).
- Converte nomes de coluna do PostgreSQL para os campos abreviados dos tipos (`nome → n`,
  `votos → v`, `votos_mil → vm`, `geometria → g`, …), com os helpers `num()` e `geo()` para
  tolerar nulos.
- Reaplica o eixo temático de cada liderança via `MAPA_SEG`.
- Reconstitui `rede` a partir das 5 linhas `chave/dados`.

## 4.3 `src/hooks/useDados.ts` — dados operacionais

| Hook | Tipo | Efeito |
| ---- | ---- | ------ |
| `useFichas()` | query `["fichas"]` | lista fichas do usuário, mais recentes primeiro |
| `useSalvaFicha()` | mutação | insere ficha com `user_id` e invalida `["fichas"]` |
| `useApagaFicha()` | mutação | remove por `id` (RLS garante que é do usuário) |
| `useFotos()` | query `["fotos"]` | devolve `Record<chave, dataURI>` |
| `useSalvaFoto()` | mutação | `upsert` em `fotos_lideranca` com `onConflict: "user_id,chave"` |

`usuarioAtual()` lê a sessão e lança `"Sessão expirada. Entre novamente."` quando não há usuário —
isso protege inserts que dependem de `user_id`.

## 4.4 Estratégia de cache

| Chave | Escopo | Invalidação |
| ----- | ------ | ----------- |
| `["dataset"]` | global, leitura pública | `staleTime` de 1 h; recarrega ao recarregar a página |
| `["fichas"]` | por usuário | após salvar ou apagar ficha |
| `["fotos"]` | por usuário | após salvar foto |

## 4.5 Fotos (`src/lib/foto.ts`)

`pedeFoto(cb)` cria um `<input type="file" accept="image/*" capture="environment">`, recorta a
imagem no centro em um quadrado, redimensiona para **320×320** via canvas e devolve um data URI
JPEG com qualidade 0,82. O resultado é gravado como texto na coluna `foto` — sem storage de
arquivos, o que mantém o app simples ao custo de ~20–40 KB por registro.
