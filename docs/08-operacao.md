# 8. Operação

## 8.1 Ambiente local

```bash
npm install
npm run dev
```

Acesse <http://localhost:5173>.

Crie um `.env` na raiz:

```bash
VITE_SUPABASE_URL="https://SEU-PROJETO.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sua-chave-publica"
```

Ambas as variáveis são públicas (chegam ao navegador). Nunca coloque chave de serviço no `.env` do
front.

## 8.2 Scripts

| Comando | Descrição |
| ------- | --------- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build de produção |
| `npm run build:dev` | build em modo desenvolvimento (útil para reproduzir erros de prerender) |
| `npm run preview` | pré-visualização do build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## 8.3 Estrutura de diretórios

```text
docs/                 Esta documentação
public/               Estáticos servidos na raiz
src/
  assets/             Imagens (foto do candidato)
  components/         AppShell, MapaLeaflet, Grafo, PessoaCard, Login, ui/
  data/               campanha.ts (tipos + store) e dataset.remoto.ts (carga)
  hooks/              useDados.ts (fichas e fotos)
  integrations/       Cliente do backend (gerado — não editar)
  lib/                auth.tsx, foto.ts, utils.ts
  routes/             Rotas por arquivo
  styles.css          Design system
supabase/migrations/  Migrações SQL versionadas
```

## 8.4 Publicação e GitHub

- O repositório espelhado é `gest_campanha` (branch `main`), sincronizado automaticamente pelo
  Lovable. O `git remote -v` local mostra apenas o remote interno — isso é esperado; o push ao
  GitHub acontece pelo sync da plataforma, não por um remote local.
- Deploy do app: publicação pela própria plataforma. Para hospedar fora, basta clonar o repositório
  e rodar `npm run build` — as variáveis `VITE_*` precisam existir no ambiente de build.

## 8.5 Problemas comuns

| Sintoma | Causa provável | Correção |
| ------- | -------------- | -------- |
| Polígonos pretos ou invisíveis no mapa | `fillColor` recebendo `var(--token)` | usar hexadecimal literal de `campanha.ts` |
| Página em branco com erro na raiz | falha em `datasetQuery` (grant/policy ausente) | conferir `SELECT` para `anon` nas tabelas de referência |
| "Sessão expirada. Entre novamente." ao salvar | sessão perdida | entrar novamente; verificar `AuthProvider` montado |
| `duplicate key` ao salvar foto | `upsert` sem `onConflict` | manter `onConflict: "user_id,chave"` e o índice `UNIQUE (user_id, chave)` |
| Rota nova não aparece | `routeTree.gen.ts` desatualizado | reiniciar o servidor de desenvolvimento |
| Erro de import de `@/hooks/use-toast` | componente não existe neste projeto | usar `sonner` |
