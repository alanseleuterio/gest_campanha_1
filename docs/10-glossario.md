# 10. Glossário

## Termos do domínio

| Termo | Significado |
| ----- | ----------- |
| **Quadrante** | Classificação estratégica do território cruzando votação e presença de estrutura |
| **Base consolidada** | Território com votação e estrutura organizada |
| **Base a ativar / a reforçar** | Potencial identificado, estrutura insuficiente |
| **Base órfã** | Votação existente sem liderança responsável |
| **Estrutura sem retorno** | Há estrutura, mas a votação não corresponde |
| **Fora do radar** | Sem votação relevante nem estrutura |
| **Votos por mil (`vm`)** | Votos por mil habitantes — normaliza municípios de portes diferentes |
| **Votos por local (`vpl`)** | Média de votos por local de votação do bairro |
| **Região urbana** | Divisão administrativa de Campo Grande (7 no total) |
| **Eixo temático** | Agrupamento de segmentos de liderança (`MAPA_SEG`) |
| **Coordenação** | Responsável regional pela articulação no município |
| **Ficha** | Registro de entrevista de campo com um eleitor |

## Abreviações do dataset

Herdadas do HTML original; usadas nos tipos de `src/data/campanha.ts`.

| Campo | Significado | Onde |
| ----- | ----------- | ---- |
| `n` | nome | todos |
| `r` | região | município |
| `ru` | região urbana | bairro, liderança, local |
| `v` | votos | município, bairro, local |
| `vm` | votos por mil | município, bairro |
| `pop` | população | município, bairro |
| `st` | status de base | município |
| `co` | coordenação | município |
| `l` | nº de lideranças | município, bairro |
| `q` | quadrante | município, bairro |
| `s` | sede `[lng, lat]` | município |
| `g` | geometria (anéis) | município, bairro, região |
| `vpl` | votos por local | bairro |
| `lo` | nº de locais | bairro |
| `sg`/`s` | segmento | liderança |
| `a` | atuação | liderança |
| `b` | bairro | liderança, local |
| `p` | perfil | liderança |
| `lc` | local de referência | liderança |
| `t` | telefone | liderança, rede |
| `x` / `y` | longitude / latitude | liderança, local |
| `d` | distância | local de votação |
| `z` | zona eleitoral | local de votação |
| `se` | nº de seções | local de votação |
| `mun` | nº de municípios | rede/região |
| `sub` | subtítulo/cargo | rede |
| `eixo` | eixo temático | rede/liderança |

## Chaves da tabela `rede`

| Chave | Conteúdo |
| ----- | -------- |
| `cand` | candidato (nome, cargo, votos) |
| `geral` | coordenação geral |
| `regioes` | regiões com votos e nº de municípios |
| `coord` | coordenadores por município/região |
| `lid` | lideranças da rede com eixo temático |
