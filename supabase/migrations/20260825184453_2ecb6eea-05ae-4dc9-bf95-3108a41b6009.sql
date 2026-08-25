CREATE TABLE public.fichas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  nome TEXT NOT NULL,
  bairro TEXT NOT NULL,
  lideranca TEXT NOT NULL,
  codigo_convite TEXT,
  situacao_voto TEXT NOT NULL,
  pautas TEXT[] NOT NULL DEFAULT '{}',
  proximo_passo TEXT NOT NULL DEFAULT 'Nenhum',
  telefone TEXT,
  autorizou_contato BOOLEAN NOT NULL DEFAULT false,
  observacao TEXT,
  foto TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.fichas TO authenticated;
GRANT ALL ON public.fichas TO service_role;
ALTER TABLE public.fichas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios gerenciam suas fichas" ON public.fichas FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX fichas_user_created_idx ON public.fichas (user_id, created_at DESC);

CREATE TABLE public.fotos_lideranca (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  chave TEXT NOT NULL,
  nome TEXT NOT NULL,
  foto TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, chave)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.fotos_lideranca TO authenticated;
GRANT ALL ON public.fotos_lideranca TO service_role;
ALTER TABLE public.fotos_lideranca ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios gerenciam suas fotos" ON public.fotos_lideranca FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);