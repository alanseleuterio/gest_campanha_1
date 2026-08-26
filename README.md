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

Dados operacionais (privados por usuário, RLS por `auth.uid()`):

- `fichas` — fichas de entrevista (nome, bairro, liderança, situação de voto, pautas, próximo passo, telefone, observação, foto)
- `fotos_lideranca` — foto por liderança (`user_id` + `chave` únicos)

Dados geográficos e estatísticos (leitura pública, somente consulta):

- `municipios` — 78 municípios do MS: votos de 2022, votos por mil, população, status, coordenação, quadrante, sede e geometria (`jsonb`)
- `bairros` — bairros de Campo Grande: população, votos, lideranças, quadrante, votos por local, locais e geometria
- `regioes_urbanas` — regiões urbanas de Campo Grande e suas geometrias
- `liderancas` — lideranças mapeadas com segmento, atuação, bairro, telefone e coordenadas
- `locais_votacao` — locais de votação com votos, zona, seções e coordenadas
- `rede` — blocos da rede de coordenação (candidato, coordenação geral, regiões, coordenadores, lideranças)

O mapa Leaflet, o painel, a rede e a busca consomem esses dados diretamente do PostgreSQL (carregados uma vez por sessão via TanStack Query).


## Acesso

Use "Criar conta" para registrar um e-mail e senha (confirme o e-mail, se solicitado) e depois entre normalmente.

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · TanStack Router/Query · Leaflet · Recharts · shadcn/ui

## Documentação

A documentação completa está em [`docs/`](./docs/README.md):

1. [Visão geral](./docs/01-visao-geral.md)
2. [Arquitetura](./docs/02-arquitetura.md)
3. [Modelo de dados (PostgreSQL)](./docs/03-modelo-de-dados.md)
4. [Camada de dados no front](./docs/04-camada-de-dados.md)
5. [Interface e rotas](./docs/05-interface-e-rotas.md)
6. [Design system](./docs/06-design-system.md)
7. [Autenticação e segurança](./docs/07-autenticacao-seguranca.md)
8. [Operação](./docs/08-operacao.md)
9. [Manutenção de dados](./docs/09-manutencao-de-dados.md)
10. [Glossário](./docs/10-glossario.md)
