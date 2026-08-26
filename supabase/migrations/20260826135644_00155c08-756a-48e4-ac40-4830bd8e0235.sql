CREATE TABLE public.municipios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  regiao text NOT NULL,
  votos integer NOT NULL DEFAULT 0,
  votos_mil numeric NOT NULL DEFAULT 0,
  populacao integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT '',
  coordenacao text,
  liderancas integer NOT NULL DEFAULT 0,
  quadrante text NOT NULL DEFAULT '',
  sede jsonb NOT NULL DEFAULT '[]'::jsonb,
  geometria jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.bairros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  regiao_urbana text NOT NULL,
  populacao integer NOT NULL DEFAULT 0,
  votos integer NOT NULL DEFAULT 0,
  liderancas integer NOT NULL DEFAULT 0,
  quadrante text NOT NULL DEFAULT '',
  votos_por_local integer NOT NULL DEFAULT 0,
  votos_mil numeric NOT NULL DEFAULT 0,
  locais integer NOT NULL DEFAULT 0,
  geometria jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.regioes_urbanas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  geometria jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.liderancas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  segmento text NOT NULL DEFAULT '',
  atuacao text NOT NULL DEFAULT '',
  bairro text NOT NULL DEFAULT '',
  regiao_urbana text NOT NULL DEFAULT '',
  perfil text NOT NULL DEFAULT '',
  local_ref text NOT NULL DEFAULT '',
  telefone text,
  lng numeric NOT NULL DEFAULT 0,
  lat numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.locais_votacao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  votos integer NOT NULL DEFAULT 0,
  bairro text NOT NULL DEFAULT '',
  regiao_urbana text NOT NULL DEFAULT '',
  distancia numeric NOT NULL DEFAULT 0,
  zona integer NOT NULL DEFAULT 0,
  seccoes integer NOT NULL DEFAULT 0,
  lng numeric NOT NULL DEFAULT 0,
  lat numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.rede (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text NOT NULL UNIQUE,
  dados jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.municipios TO anon, authenticated;
GRANT SELECT ON public.bairros TO anon, authenticated;
GRANT SELECT ON public.regioes_urbanas TO anon, authenticated;
GRANT SELECT ON public.liderancas TO anon, authenticated;
GRANT SELECT ON public.locais_votacao TO anon, authenticated;
GRANT SELECT ON public.rede TO anon, authenticated;
GRANT ALL ON public.municipios TO service_role;
GRANT ALL ON public.bairros TO service_role;
GRANT ALL ON public.regioes_urbanas TO service_role;
GRANT ALL ON public.liderancas TO service_role;
GRANT ALL ON public.locais_votacao TO service_role;
GRANT ALL ON public.rede TO service_role;

ALTER TABLE public.municipios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bairros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regioes_urbanas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liderancas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locais_votacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rede ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dados publicos de municipios" ON public.municipios FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Dados publicos de bairros" ON public.bairros FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Dados publicos de regioes urbanas" ON public.regioes_urbanas FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Dados publicos de liderancas" ON public.liderancas FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Dados publicos de locais de votacao" ON public.locais_votacao FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Dados publicos da rede" ON public.rede FOR SELECT TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_municipios_updated BEFORE UPDATE ON public.municipios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_bairros_updated BEFORE UPDATE ON public.bairros FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_regioes_updated BEFORE UPDATE ON public.regioes_urbanas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_liderancas_updated BEFORE UPDATE ON public.liderancas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_locais_updated BEFORE UPDATE ON public.locais_votacao FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_rede_updated BEFORE UPDATE ON public.rede FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();