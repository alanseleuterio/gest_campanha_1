# 3. Modelo de dados (PostgreSQL)

Todas as tabelas ficam no schema `public`, com RLS habilitada e grants explícitos. As migrações
estão versionadas em `supabase/migrations/`.

## 3.1 Dados operacionais (privados por usuário)

### `fichas`

Fichas de entrevista de campo.

| Coluna | Tipo | Nota |
| ------ | ---- | ---- |
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `user_id` | `uuid` | dono da ficha (`auth.uid()`) |
| `nome` | `text` | entrevistado |
| `bairro` | `text` | |
| `lideranca` | `text` | liderança que fez a ponte |
| `codigo_convite` | `text` | opcional |
| `situacao_voto` | `text` | ex.: decidido, indeciso, contrário |
| `pautas` | `text[]` | temas citados |
| `proximo_passo` | `text` | encaminhamento |
| `telefone` | `text` | opcional |
| `autorizou_contato` | `boolean` | LGPD |
| `observacao` | `text` | opcional |
| `foto` | `text` | data URI JPEG 320×320 |
| `created_at` | `timestamptz` | |

### `fotos_lideranca`

Uma foto por liderança, por usuário.

| Coluna | Tipo | Nota |
| ------ | ---- | ---- |
| `id` | `uuid` | PK |
| `user_id` | `uuid` | dono |
| `chave` | `text` | slug normalizado do nome (`chave()` em `campanha.ts`) |
| `nome` | `text` | nome original |
| `foto` | `text` | data URI JPEG |
| | | **UNIQUE (`user_id`, `chave`)** — necessário para o `upsert` |

**Políticas**: `SELECT`, `INSERT`, `UPDATE`, `DELETE` apenas quando `user_id = auth.uid()`.
**Grants**: `authenticated` (CRUD) e `service_role` (ALL). Sem acesso `anon`.

## 3.2 Dados de referência (leitura pública, somente consulta)

Carregados uma única vez por sessão. O aplicativo **não** escreve nessas tabelas — alterações são
feitas por migração (ver [manutenção de dados](./09-manutencao-de-dados.md)).

Todas têm `id uuid` PK, `created_at`/`updated_at` `timestamptz` com trigger de atualização.

### `municipios` (78 linhas)

`nome` (único), `regiao`, `votos`, `votos_mil`, `populacao`, `status`, `coordenacao`, `liderancas`,
`quadrante`, `sede jsonb` (`[lng, lat]`), `geometria jsonb` (array de anéis `[[lng, lat], ...]`).

### `bairros` (74 linhas — Campo Grande)

`nome` (único), `regiao_urbana`, `populacao`, `votos`, `liderancas`, `quadrante`,
`votos_por_local`, `votos_mil`, `locais`, `geometria jsonb`.

### `regioes_urbanas` (7 linhas)

`nome` (único), `geometria jsonb`.

### `liderancas` (116 linhas)

`nome`, `segmento`, `atuacao`, `bairro`, `regiao_urbana`, `perfil`, `local_ref`, `telefone`,
`lng`, `lat`.

### `locais_votacao` (184 linhas)

`nome`, `votos`, `bairro`, `regiao_urbana`, `distancia`, `zona`, `seccoes`, `lng`, `lat`.

### `rede` (5 linhas)

`chave` (única: `cand`, `geral`, `regioes`, `coord`, `lid`) e `dados jsonb` com o bloco
correspondente da estrutura de coordenação.

**Políticas**: `SELECT` público (`USING (true)`).
**Grants**: `SELECT` para `anon` e `authenticated`; `ALL` para `service_role`.

## 3.3 Geometria

PostGIS não está habilitado. As geometrias são armazenadas como `jsonb`:

```json
[[[-54.61, -20.44], [-54.60, -20.44], [-54.60, -20.45]], [ ...outro anel... ]]
```

Coordenadas em **[lng, lat]**; o `MapaLeaflet` inverte para `[lat, lng]` ao construir os polígonos.
Se um dia for necessário fazer consultas espaciais (contains, distância real, simplificação), o
caminho é migrar essas colunas para `geometry(Polygon, 4326)` com PostGIS.
