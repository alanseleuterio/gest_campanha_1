# 5. Interface e rotas

## 5.1 Rotas (`src/routes/`)

Roteamento por arquivo do TanStack Router. Cada rota define seu próprio `head()` com título,
descrição e Open Graph.

| Arquivo | Caminho | Página |
| ------- | ------- | ------ |
| `__root.tsx` | — | Layout raiz: metadados, CSS, `QueryClientProvider`, `AuthProvider`, `Toaster`, carga do dataset, telas de 404 e de erro |
| `index.tsx` | `/` | Painel: hero com o candidato, KPIs, quadrantes, resumo territorial |
| `mapa.tsx` | `/mapa` | Mapa coroplético (MS e Campo Grande) |
| `rede.tsx` | `/rede` | Grafo da rede de coordenação |
| `conexoes.tsx` | `/conexoes` | Conexões entre lideranças, bairros e municípios |
| `entrevistas.tsx` | `/entrevistas` | Formulário e lista de fichas |
| `buscar.tsx` | `/buscar` | Busca unificada |

`src/routeTree.gen.ts` é gerado automaticamente — nunca editar à mão.

## 5.2 Componentes

### `AppShell.tsx`

Casca visual do app, fiel ao HTML original:

- header em vermelho PT com gradiente, logo-estrela em SVG, nome do candidato e badge
  translúcido **USO INTERNO**;
- avatar circular do candidato (borda 2,5 px, `objectPosition: 50% 12%`);
- barra de navegação secundária em vinho escuro, aba ativa marcada por borda amarela de 3 px;
- largura máxima de conteúdo de 1180 px;
- gate de sessão: sem usuário autenticado, renderiza `Login`.

### `MapaLeaflet.tsx`

- Duas visões: **Mato Grosso do Sul** (municípios) e **Campo Grande** (bairros e regiões urbanas).
- Temas: intensidade de votos (rampa `RAMPA`, por faixa) e status de base (`QCOR`).
- Marcadores de lideranças e locais de votação a partir de `lng/lat`.
- Popups com votos, votos por mil, população, quadrante e coordenação.
- Legenda com os status na ordem `QORD` e o item "sem registro".
- **Regra crítica**: `fillColor` sempre recebe hexadecimal literal. Variáveis CSS (`var(--r1)`)
  renderizam preto ou invisível no Canvas do Leaflet.

### `Grafo.tsx`

Grafo radial/hierárquico em SVG puro (sem biblioteca), com até 6 níveis: candidato → coordenação
geral → regiões → coordenadores → lideranças → base. Cores por região (`COR_REGIAO`) e por eixo
temático (`COR_EIXO`).

### `PessoaCard.tsx`

Cartão de pessoa (liderança ou entrevistado) com foto (`useFotos`/`useSalvaFoto`), nome, segmento,
bairro, telefone formatado e ação de capturar foto.

### `Login.tsx`

Tela de acesso com modos **entrar** e **criar conta**, estado `enviando`, mensagens via `sonner`,
credenciais de desenvolvimento pré-preenchidas e visíveis, e botão *Entrar em modo desenvolvimento*
(ver [autenticação](./07-autenticacao-seguranca.md)).

### `src/components/ui/`

Primitivos shadcn/ui (Radix). Usar como base para novos elementos em vez de recriar componentes.

## 5.3 Padrões de UI

- Notificações: `sonner` (`<Toaster />` montado uma única vez em `__root.tsx`).
  Não existe `@/hooks/use-toast` neste projeto.
- Estados de carregamento das rotas usam Suspense do TanStack Query, não `isLoading` manual.
- Números eleitorais sempre com separador de milhar em pt-BR; telefones formatados pelo utilitário
  de `campanha.ts`.
