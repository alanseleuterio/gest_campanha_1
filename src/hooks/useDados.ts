import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chave } from "@/data/campanha";
import { supabase } from "@/integrations/supabase/client";

export interface Ficha {
  id: string;
  nome: string;
  bairro: string;
  lideranca: string;
  codigo_convite: string | null;
  situacao_voto: string;
  pautas: string[];
  proximo_passo: string;
  telefone: string | null;
  autorizou_contato: boolean;
  observacao: string | null;
  foto: string | null;
  created_at: string;
}

export type NovaFicha = Omit<Ficha, "id" | "created_at">;

async function usuarioAtual() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Sessão expirada. Entre novamente.");
  return data.user.id;
}

export function useFichas() {
  return useQuery({
    queryKey: ["fichas"],
    queryFn: async (): Promise<Ficha[]> => {
      const { data, error } = await supabase
        .from("fichas")
        .select(
          "id, nome, bairro, lideranca, codigo_convite, situacao_voto, pautas, proximo_passo, telefone, autorizou_contato, observacao, foto, created_at",
        )
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as Ficha[];
    },
  });
}

export function useSalvaFicha() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (f: NovaFicha) => {
      const user_id = await usuarioAtual();
      const { error } = await supabase.from("fichas").insert({ ...f, user_id });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fichas"] }),
  });
}

export function useApagaFicha() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("fichas").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fichas"] }),
  });
}

/** chave(nome) -> data URI da foto */
export function useFotos() {
  return useQuery({
    queryKey: ["fotos"],
    queryFn: async (): Promise<Record<string, string>> => {
      const { data, error } = await supabase.from("fotos_lideranca").select("chave, foto");
      if (error) throw new Error(error.message);
      return Object.fromEntries((data ?? []).map((r) => [r.chave, r.foto]));
    },
  });
}

export function useSalvaFoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ nome, foto }: { nome: string; foto: string }) => {
      const user_id = await usuarioAtual();
      const { error } = await supabase
        .from("fotos_lideranca")
        .upsert({ user_id, chave: chave(nome), nome, foto }, { onConflict: "user_id,chave" });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fotos"] }),
  });
}
