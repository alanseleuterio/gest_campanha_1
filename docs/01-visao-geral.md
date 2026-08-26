# 1. Visão geral

## O que é

Plataforma interna de **inteligência territorial para campanha política** (Tiago Botelho — PT/MS,
ciclo 2026). Reúne, em um único aplicativo web, o resultado eleitoral de 2022, o mapeamento
territorial de Mato Grosso do Sul e de Campo Grande, a rede de lideranças e o trabalho de campo
(entrevistas com eleitores).

## Origem

O projeto nasceu de um arquivo HTML monolítico (`PLATAFORMA_TIAGO_BOTELHO_PROTEGIDA.html`) com todo
o dataset embutido em JavaScript e uma senha fixa no código. Ele foi reestruturado em:

- React + Vite + TypeScript + Tailwind CSS (componentes e rotas separados);
- PostgreSQL gerenciado para persistência (nada de dados embutidos no bundle);
- autenticação real por usuário, no lugar da senha fixa.

A identidade visual original (barra vermelha PT, estrela, tipografia serifada nos títulos, cores
coropléticas) foi preservada intencionalmente.

## Público-alvo

Equipe de campanha: coordenação estadual, coordenadores regionais e militância de campo. É um
sistema de **uso interno** — o cabeçalho exibe esse aviso permanentemente.

## Módulos

| Módulo | Rota | Função |
| ------ | ---- | ------ |
| Painel | `/` | KPIs de votação, quadrantes de base, resumo territorial |
| Mapa | `/mapa` | Coropléticos do MS e de Campo Grande (Leaflet), temas de intensidade e status |
| Rede | `/rede` | Grafo radial/hierárquico da estrutura de coordenação, até 6 níveis |
| Conexões | `/conexoes` | Relações entre lideranças, bairros e municípios |
| Entrevistas | `/entrevistas` | Cadastro de fichas de campo, com foto capturada pela câmera |
| Buscar | `/buscar` | Busca unificada por pessoas, bairros e municípios |

## Números do dataset

| Coleção | Registros |
| ------- | --------- |
| Municípios do MS | 78 |
| Bairros de Campo Grande | 74 |
| Regiões urbanas | 7 |
| Lideranças mapeadas | 116 |
| Locais de votação | 184 |
| Blocos da rede | 5 |

Totais de referência: **178.041** votos no MS (`TOT_MS`) e **54.721** em Campo Grande (`TOT_CG`),
eleição de 2022.

## Princípios de projeto

1. **Uma fonte de verdade**: todos os dados vêm do PostgreSQL; não há dataset estático no bundle.
2. **Leitura pública, escrita privada**: dados geográficos são somente leitura; fichas e fotos são
   isoladas por usuário via RLS.
3. **Fidelidade visual**: cores coropléticas e paleta partidária são valores literais, definidos em
   `src/data/campanha.ts`, não improvisados.
4. **Português no domínio**: nomes de tipos, hooks e colunas seguem o vocabulário da campanha.
