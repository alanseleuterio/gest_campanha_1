# Documentação — Plataforma Tiago Botelho (gest_campanha)

Documentação completa do projeto, organizada em cascata: da visão geral do produto até o
detalhe de cada camada técnica e da operação do dia a dia.

## Índice

| # | Documento | Conteúdo |
| - | --------- | -------- |
| 1 | [Visão geral](./01-visao-geral.md) | Objetivo, público, módulos e origem do projeto |
| 2 | [Arquitetura](./02-arquitetura.md) | Stack, camadas, fluxo de execução e limites cliente/servidor |
| 3 | [Modelo de dados](./03-modelo-de-dados.md) | Tabelas PostgreSQL, colunas, RLS e grants |
| 4 | [Camada de dados no front](./04-camada-de-dados.md) | `campanha.ts`, `dataset.remoto.ts`, hooks e cache |
| 5 | [Interface e rotas](./05-interface-e-rotas.md) | Rotas, componentes, mapa, grafo e formulários |
| 6 | [Design system](./06-design-system.md) | Paleta PT, tipografia, tokens e classes utilitárias |
| 7 | [Autenticação e segurança](./07-autenticacao-seguranca.md) | Login, conta de desenvolvimento, RLS e riscos |
| 8 | [Operação](./08-operacao.md) | Ambiente local, variáveis, build, deploy e GitHub |
| 9 | [Manutenção de dados](./09-manutencao-de-dados.md) | Como atualizar municípios, bairros, lideranças e rede |
| 10 | [Glossário](./10-glossario.md) | Termos eleitorais e abreviações do dataset |

## Cascata do projeto em uma tela

```text
Usuário
  └── Navegador (React 19 + Vite + Tailwind v4)
        ├── TanStack Router  → rotas /, /mapa, /rede, /conexoes, /entrevistas, /buscar
        ├── AuthProvider     → sessão Supabase Auth (e-mail + senha)
        ├── TanStack Query   → cache de dataset, fichas e fotos
        │     ├── datasetQuery      (leitura pública, 1x por sessão)
        │     ├── ["fichas"]        (privado por usuário)
        │     └── ["fotos"]         (privado por usuário)
        └── supabase-js (chave publicável)
              └── PostgreSQL gerenciado (Lovable Cloud)
                    ├── Dados de referência: municipios, bairros, regioes_urbanas,
                    │    liderancas, locais_votacao, rede            → SELECT público
                    └── Dados operacionais: fichas, fotos_lideranca  → RLS por auth.uid()
```
