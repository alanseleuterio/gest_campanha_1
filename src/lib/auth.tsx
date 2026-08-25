import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { CHAVES, gravar, hash, ler, remover } from "@/lib/localdb";

export type Usuario = { email: string };
type Conta = { email: string; senha: string };

type Ctx = {
  session: Usuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => void;
  criarConta: (email: string, senha: string) => void;
  sair: () => Promise<void>;
};

const AuthCtx = createContext<Ctx>({
  session: null,
  carregando: true,
  entrar: () => {},
  criarConta: () => {},
  sair: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setSession(ler<Usuario | null>(CHAVES.sessao, null));
    setCarregando(false);
  }, []);

  function contas() {
    return ler<Conta[]>(CHAVES.contas, []);
  }

  function abrirSessao(email: string) {
    const u: Usuario = { email };
    gravar(CHAVES.sessao, u);
    setSession(u);
  }

  function criarConta(email: string, senha: string) {
    const lista = contas();
    const e = email.trim().toLowerCase();
    if (lista.some((c) => c.email === e)) throw new Error("Já existe uma conta com este e-mail.");
    if (senha.length < 6) throw new Error("A senha precisa ter ao menos 6 caracteres.");
    gravar(CHAVES.contas, [...lista, { email: e, senha: hash(senha) }]);
    abrirSessao(e);
  }

  function entrar(email: string, senha: string) {
    const e = email.trim().toLowerCase();
    const lista = contas();
    const c = lista.find((x) => x.email === e);
    // Primeiro acesso do navegador: a conta informada é criada automaticamente.
    if (!c && lista.length === 0) return criarConta(e, senha);
    if (!c || c.senha !== hash(senha)) throw new Error("E-mail ou senha inválidos.");
    abrirSessao(e);
  }

  return (
    <AuthCtx.Provider
      value={{
        session,
        carregando,
        entrar,
        criarConta,
        sair: async () => {
          remover(CHAVES.sessao);
          setSession(null);
        },
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
