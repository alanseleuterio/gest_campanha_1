import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { chave } from "@/data/campanha";

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

export function useFichas() {
  return useQuery({
    queryKey: ["fichas"],
    queryFn: async (): Promise<Ficha[]> => {
      const { data, error } = await supabase
        .from("fichas")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Ficha[];
    },
  });
}

export function useSalvaFicha() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (f: NovaFicha) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Sessão expirada");
      const { error } = await supabase.from("fichas").insert({ ...f, user_id: u.user.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fichas"] }),
  });
}

export function useApagaFicha() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("fichas").delete().eq("id", id);
      if (error) throw error;
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
      if (error) throw error;
      const m: Record<string, string> = {};
      (data ?? []).forEach((r) => {
        m[r.chave] = r.foto;
      });
      return m;
    },
  });
}

export function useSalvaFoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ nome, foto }: { nome: string; foto: string }) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Sessão expirada");
      const { error } = await supabase
        .from("fotos_lideranca")
        .upsert(
          { user_id: u.user.id, chave: chave(nome), nome, foto },
          { onConflict: "user_id,chave" },
        );
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fotos"] }),
  });
}
