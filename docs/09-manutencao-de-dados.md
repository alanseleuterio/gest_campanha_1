# 9. Manutenção dos dados de referência

As tabelas `municipios`, `bairros`, `regioes_urbanas`, `liderancas`, `locais_votacao` e `rede` são
**somente leitura** para o aplicativo. Alterações são feitas por migração SQL versionada em
`supabase/migrations/`.

## 9.1 Fluxo recomendado

1. Escreva uma migração nova (nunca edite uma já aplicada).
2. Use `UPDATE`/`INSERT` idempotentes, com `ON CONFLICT` na chave natural (`nome` ou `chave`).
3. Aplique a migração e confira as contagens.
4. Recarregue o app: o `staleTime` de 1 hora do `datasetQuery` significa que uma aba já aberta pode
   continuar mostrando os dados antigos até recarregar.

## 9.2 Exemplos

Corrigir os votos de um município:

```sql
UPDATE public.municipios
SET votos = 1234, votos_mil = 12.3
WHERE nome = 'Dourados';
```

Inserir uma liderança:

```sql
INSERT INTO public.liderancas
  (nome, segmento, atuacao, bairro, regiao_urbana, perfil, local_ref, telefone, lng, lat)
VALUES
  ('Fulana de Tal', 'Saúde', 'Conselho local', 'Nova Lima', 'Segredo',
   'Articuladora', 'UBS Nova Lima', '67999990000', -54.60, -20.42);
```

Atualizar um bloco da rede:

```sql
UPDATE public.rede
SET dados = '[{"n":"Região Norte","v":10234,"mun":12}]'::jsonb
WHERE chave = 'regioes';
```

## 9.3 Conferência

```sql
SELECT 'municipios' t, count(*) FROM public.municipios
UNION ALL SELECT 'bairros', count(*) FROM public.bairros
UNION ALL SELECT 'regioes_urbanas', count(*) FROM public.regioes_urbanas
UNION ALL SELECT 'liderancas', count(*) FROM public.liderancas
UNION ALL SELECT 'locais_votacao', count(*) FROM public.locais_votacao
UNION ALL SELECT 'rede', count(*) FROM public.rede;
```

Valores esperados hoje: 78 / 74 / 7 / 116 / 184 / 5.

## 9.4 Geometrias

- Formato: `jsonb` com array de anéis, coordenadas `[lng, lat]`.
- Ao importar de GeoJSON, extraia `geometry.coordinates` (Polygon) — para MultiPolygon, achate para
  a lista de anéis.
- Geometrias muito detalhadas pesam no payload inicial; simplifique antes de inserir se o
  carregamento do mapa ficar lento.

## 9.5 Criando uma tabela nova

Toda `CREATE TABLE` no schema `public` precisa, na mesma migração e nesta ordem:

```sql
CREATE TABLE public.exemplo (...);
GRANT SELECT ON public.exemplo TO anon, authenticated;  -- se for de referência
GRANT ALL ON public.exemplo TO service_role;
ALTER TABLE public.exemplo ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leitura publica" ON public.exemplo FOR SELECT USING (true);
```

Para dados operacionais, troque o grant/política pelo padrão de `fichas` (`user_id = auth.uid()`,
sem acesso `anon`).
