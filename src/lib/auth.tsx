import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Ctx = {
  session: Session | null;
  carregando: boolean;
  sair: () => Promise<void>;
};

const AuthCtx = createContext<Ctx>({
  session: null,
  carregando: true,
  sair: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setCarregando(false);
    });
    supabase.auth.getSession().then(({ data: d }) => {
      setSession(d.session);
      setCarregando(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <AuthCtx.Provider
      value={{
        session,
        carregando,
        sair: async () => {
          await supabase.auth.signOut();
        },
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
