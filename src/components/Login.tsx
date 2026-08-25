import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import foto from "@/assets/tiago-botelho.jpg";

export function Login() {
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [ocupado, setOcupado] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setOcupado(true);
    try {
      if (modo === "entrar") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Conta criada. Confirme o e-mail se for solicitado.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setOcupado(false);
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (r.error) toast.error("Não foi possível entrar com o Google.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-[380px]">
        <div className="card-tb text-center">
          <img
            src={foto}
            alt="Tiago Botelho"
            className="mx-auto h-20 w-20 rounded-2xl object-cover"
            style={{ objectPosition: "50% 8%" }}
          />
          <h1 className="mt-3 text-[21px]">Plataforma Tiago Botelho</h1>
          <p className="sub-tb mt-1 mb-0">Inteligência territorial · PT/MS 2026</p>
        </div>

        <form className="card-tb" onSubmit={enviar}>
          <div className="rot">{modo === "entrar" ? "Acesso da equipe" : "Nova conta da equipe"}</div>
          <div className="campo-tb">
            <label className="tit" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="campo-tb">
            <label className="tit" htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              autoComplete={modo === "entrar" ? "current-password" : "new-password"}
              required
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <button className="bt p w-full" disabled={ocupado} type="submit">
            {modo === "entrar" ? "Entrar" : "Criar conta"}
          </button>
          <button
            className="bt s mt-2 w-full"
            type="button"
            onClick={google}
            disabled={ocupado}
          >
            Entrar com o Google
          </button>
          <p className="aj text-center">
            {modo === "entrar" ? "Ainda não tem acesso?" : "Já tem conta?"}{" "}
            <button
              type="button"
              className="font-semibold text-pt underline"
              onClick={() => setModo(modo === "entrar" ? "criar" : "entrar")}
            >
              {modo === "entrar" ? "Criar conta" : "Entrar"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
