import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chave } from "@/data/campanha";
import { CHAVES, gravar, ler, novoId } from "@/lib/localdb";

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

const lerFichas = () => ler<Ficha[]>(CHAVES.fichas, []);
const lerFotos = () => ler<Record<string, string>>(CHAVES.fotos, {});

export function useFichas() {
  return useQuery({
    queryKey: ["fichas"],
    queryFn: async (): Promise<Ficha[]> =>
      [...lerFichas()].sort((a, b) => b.created_at.localeCompare(a.created_at)),
  });
}

export function useSalvaFicha() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (f: NovaFicha) => {
      const nova: Ficha = { ...f, id: novoId(), created_at: new Date().toISOString() };
      gravar(CHAVES.fichas, [nova, ...lerFichas()]);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fichas"] }),
  });
}

export function useApagaFicha() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      gravar(
        CHAVES.fichas,
        lerFichas().filter((f) => f.id !== id),
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fichas"] }),
  });
}

/** chave(nome) -> data URI da foto */
export function useFotos() {
  return useQuery({
    queryKey: ["fotos"],
    queryFn: async (): Promise<Record<string, string>> => lerFotos(),
  });
}

export function useSalvaFoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ nome, foto }: { nome: string; foto: string }) => {
      gravar(CHAVES.fotos, { ...lerFotos(), [chave(nome)]: foto });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fotos"] }),
  });
}
