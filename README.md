# Gestão de Campanha — Plataforma Tiago Botelho

Plataforma de inteligência territorial para campanha política (PT/MS 2026), construída em **React + Vite + TypeScript + Tailwind CSS**.

Todos os dados alterados pelo usuário (fichas de entrevista, fotos das lideranças e acesso da equipe) ficam armazenados **no próprio navegador, via LocalStorage** — não há servidor nem banco externo obrigatório.

## Como Rodar o Projeto

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse <http://localhost:5173> no navegador. Todos os dados alterados ficarão armazenados no seu navegador via LocalStorage.

## Scripts

| Comando           | Descrição                              |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento            |
| `npm run build`   | Build de produção                      |
| `npm run preview` | Pré-visualização do build              |
| `npm run lint`    | Análise estática com ESLint            |
| `npm run format`  | Formatação com Prettier                |

## Funcionalidades

- **Painel** — KPIs da campanha, quadrantes de base e resumo territorial.
- **Mapa** — mapas coropléticos de Mato Grosso do Sul e Campo Grande (Leaflet), com temas de intensidade e status de base.
- **Rede** — grafo radial/hierárquico de lideranças em até 6 níveis.
- **Conexões** — relações entre lideranças, bairros e municípios.
- **Entrevistas** — cadastro de fichas com foto (captura pela câmera, redimensionada em canvas).
- **Buscar** — busca unificada por pessoas, bairros e municípios.

## Estrutura

```text
src/
  components/    Componentes de UI (AppShell, Mapa, Grafo, Login, cards)
  data/          Dataset da campanha (municípios, bairros, rede) e utilitários
  hooks/         Hooks de dados (React Query sobre LocalStorage)
  lib/           Autenticação local, persistência (localdb) e captura de foto
  routes/        Rotas da aplicação
  styles.css     Design system (Tailwind v4, tokens OKLCH, paleta PT)
```

## Persistência (LocalStorage)

As chaves gravadas no navegador são prefixadas com `tb:`:

- `tb:fichas` — fichas de entrevista
- `tb:fotos` — fotos das lideranças (data URI)
- `tb:contas` — contas de acesso criadas neste navegador
- `tb:sessao` — sessão ativa

Para zerar a base local, limpe o LocalStorage do site nas ferramentas do navegador.

## Acesso

Na primeira execução, informe um e-mail e senha na tela de login: a conta é criada automaticamente neste navegador. Contas adicionais podem ser criadas em "Criar conta".

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · TanStack Router/Query · Leaflet · Recharts · shadcn/ui
