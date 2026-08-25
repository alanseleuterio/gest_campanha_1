# Gestão de Campanha — Plataforma Tiago Botelho

Plataforma de inteligência territorial para campanha política (PT/MS 2026), construída em **React + Vite + TypeScript + Tailwind CSS**.

Os dados (fichas de entrevista e fotos das lideranças) são persistidos em um banco **PostgreSQL** gerenciado, com autenticação de e-mail/senha por usuário e isolamento por linha (RLS): cada membro da equipe enxerga apenas os próprios registros.

## Como Rodar o Projeto

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse <http://localhost:5173> no navegador.

Crie um arquivo `.env` na raiz com as credenciais do backend:

```bash
VITE_SUPABASE_URL="https://SEU-PROJETO.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sua-chave-publica"
```

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
  hooks/         Hooks de dados (React Query sobre PostgreSQL)
  lib/           Autenticação, acesso ao banco e captura de foto
  routes/        Rotas da aplicação
  styles.css     Design system (Tailwind v4, tokens OKLCH, paleta PT)
```

## Persistência (PostgreSQL)

Tabelas no schema `public`:

- `fichas` — fichas de entrevista (nome, bairro, liderança, situação de voto, pautas, próximo passo, telefone, observação, foto)
- `fotos_lideranca` — foto por liderança (`user_id` + `chave` únicos)

Ambas têm RLS habilitado com políticas por `auth.uid()`, então cada usuário lê e escreve apenas as próprias linhas.

## Acesso

Use "Criar conta" para registrar um e-mail e senha (confirme o e-mail, se solicitado) e depois entre normalmente.

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · TanStack Router/Query · Leaflet · Recharts · shadcn/ui
