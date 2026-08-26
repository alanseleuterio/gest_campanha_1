# 2. Arquitetura

## Stack

| Camada | Tecnologia |
| ------ | ---------- |
| UI | React 19, Tailwind CSS v4 (tokens OKLCH), shadcn/ui, lucide-react |
| Roteamento | TanStack Router (rotas por arquivo em `src/routes/`) |
| Estado de servidor | TanStack Query v5 |
| Build | Vite 8 (TanStack Start) |
| Mapa | Leaflet 1.9 + react-leaflet 5 |
| Gráficos | Recharts, além do grafo próprio em SVG |
| Backend | PostgreSQL gerenciado (Lovable Cloud/Supabase) + Supabase Auth |
| Cliente de dados | `@supabase/supabase-js` com chave publicável |

## Camadas

```text
src/routes/*            Rotas e páginas (head/SEO, composição)
   ↓
src/components/*        AppShell, MapaLeaflet, Grafo, PessoaCard, Login, ui/ (shadcn)
   ↓
src/hooks/useDados.ts   Fichas e fotos (React Query + mutações)
src/data/campanha.ts    Tipos, constantes visuais, store `D`, utilitários
src/data/dataset.remoto.ts  Carga do dataset geográfico do PostgreSQL
   ↓
src/integrations/supabase/client.ts   Cliente gerado (não editar)
   ↓
PostgreSQL (RLS + grants)
```

## Fluxo de inicialização

1. `src/router.tsx` cria o router com um `QueryClient` no contexto.
2. `src/routes/__root.tsx`:
   - `loader` chama `context.queryClient.ensureQueryData(datasetQuery)` — o dataset já está
     disponível antes do primeiro render;
   - o componente `DadosCampanha` usa `useSuspenseQuery(datasetQuery)` e chama `aplicaDataset(data)`
     antes de renderizar os filhos;
   - envolve a árvore em `QueryClientProvider`, `AuthProvider` e `<Toaster />`.
3. Componentes importam o objeto `D` de `@/data/campanha` — que já está preenchido — e leem
   `D.mun`, `D.bai`, `D.reg`, `D.lid`, `D.loc`, `D.rede`.

### Por que um store mutável (`D`)

O HTML original expunha um objeto global `D`. Manter a mesma identidade de objeto, preenchida por
`aplicaDataset`, permitiu migrar do dataset estático para o banco sem reescrever todos os
componentes e sem passar props de dados por toda a árvore. O objeto é substituído **em conteúdo**,
nunca em referência — por isso `aplicaDataset` faz `D.mun.length = 0; D.mun.push(...)`-equivalente,
mantendo os imports válidos.

## Limites cliente/servidor

- O aplicativo é essencialmente **client-side**: toda a leitura passa pelo `supabase-js` no
  navegador, protegida por RLS e grants no banco.
- Não há `createServerFn` nem rotas de API neste projeto. Não existe segredo no bundle: apenas a
  URL do projeto e a **chave publicável**, que são públicas por definição.
- O SSR/prerender da rota raiz executa `datasetQuery`; por isso as tabelas de referência precisam
  ter `SELECT` liberado para `anon` — caso contrário a primeira renderização falharia.

## Convenções de código

- Nomes de domínio em português (`Lideranca`, `Bairro`, `useFichas`).
- Campos abreviados no dataset (`n`, `v`, `vm`, `pop`, `g`) herdados do HTML original — ver o
  [glossário](./10-glossario.md).
- Cores usadas pelo Leaflet devem ser **hexadecimais literais**: o renderizador Canvas não resolve
  `var(--token)` do CSS.
