import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Usuario = { id: string; email: string };

/** Credenciais de desenvolvimento (exibidas na tela de login). */
export const DEV_EMAIL = "equipe@tiagobotelho.dev";
export const DEV_SENHA = "campanha2026";

type Ctx = {
  session: Usuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  criarConta: (email: string, senha: string) => Promise<void>;
  entrarDev: () => Promise<void>;
  sair: () => Promise<void>;
};

const AuthCtx = createContext<Ctx>({
  session: null,
  carregando: true,
  entrar: async () => {},
  criarConta: async () => {},
  entrarDev: async () => {},
  sair: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, s) => {
      setSession(s?.user ? { id: s.user.id, email: s.user.email ?? "" } : null);
      setCarregando(false);
    });

    void supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      setSession(u ? { id: u.id, email: u.email ?? "" } : null);
      setCarregando(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function criarConta(email: string, senha: string) {
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: senha,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    if (error) throw new Error(error.message);
  }

  async function entrar(email: string, senha: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha,
    });
    if (error) throw new Error(error.message);
  }

  /** Entra com a conta padrão de desenvolvimento, criando-a se ainda não existir. */
  async function entrarDev() {
    const { error } = await supabase.auth.signInWithPassword({
      email: DEV_EMAIL,
      password: DEV_SENHA,
    });
    if (!error) return;
    await supabase.auth.signUp({ email: DEV_EMAIL, password: DEV_SENHA });
    const segunda = await supabase.auth.signInWithPassword({
      email: DEV_EMAIL,
      password: DEV_SENHA,
    });
    if (segunda.error) throw new Error(segunda.error.message);
  }

  return (
    <AuthCtx.Provider
      value={{
        session,
        carregando,
        entrar,
        criarConta,
        entrarDev,
        sair: async () => {
          await supabase.auth.signOut();
          setSession(null);
        },
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
