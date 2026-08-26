# 6. Design system

Tudo vive em `src/styles.css` (Tailwind v4, sem `tailwind.config.js`), com tokens em OKLCH
declarados em `@theme`.

## Identidade

Herdada do HTML original da campanha:

- **Vermelho PT** no header, com gradiente, e uma faixa de navegação em vinho escuro.
- **Amarelo estrela** como cor de destaque e marcação de aba ativa.
- **Georgia** (serifada) nos títulos e números de destaque; **Inter** nos dados e na interface.
- Cartões claros sobre fundo levemente quente, cantos discretos e sombra suave.

## Tokens principais

| Token | Uso |
| ----- | --- |
| `--pt` / `bg-pt` | vermelho principal do header |
| `--pt-escuro` / `bg-pt-escuro` | barra de navegação secundária |
| `--estrela` / `border-estrela` | amarelo de destaque e aba ativa |
| `--c0` … `--c8` | paleta categórica (eixos temáticos e regiões) |
| `--r1` … `--r5` | rampa coroplética em CSS (uso apenas em HTML/legenda) |

## Classes utilitárias

| Classe | Função |
| ------ | ------ |
| `.card-tb` | cartão padrão da plataforma |
| `.kpi` | bloco de indicador numérico |
| `.bar` | barra horizontal de proporção |
| estilos `leaflet-*` | ajustes de popup, atribuição e legenda do mapa |
| estilos de grafo | nós, arestas e rótulos do SVG da rede |

## Regras

1. **Nunca** usar cores fixas em componentes (`text-white`, `bg-[#c00]`). Use tokens semânticos.
2. **Exceção obrigatória**: o Leaflet recebe hexadecimais literais vindos de `campanha.ts`
   (`QCOR`, `RAMPA`, `SEM_REGISTRO`) — o Canvas não resolve `var()`.
3. `@import` de fontes remotas vai como `<link>` no `head()` da rota raiz, nunca dentro do
   `styles.css` (a build Lightning CSS resolve imports pelo sistema de arquivos).
4. Ao adicionar cor nova, declare o token primeiro e só depois use no componente.
