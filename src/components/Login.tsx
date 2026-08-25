import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import foto from "@/assets/tiago-botelho.jpg";

export function Login() {
  const { entrar, criarConta } = useAuth();
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [enviando, setEnviando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    try {
      if (modo === "entrar") await entrar(email, senha);
      else {
        await criarConta(email, senha);
        toast.success("Conta criada. Confirme o e-mail, se solicitado, e entre.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setEnviando(false);
    }
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

        <form className="card-tb" onSubmit={(e) => void enviar(e)}>
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
          <button className="bt p w-full" type="submit" disabled={enviando}>
            {enviando ? "Aguarde..." : modo === "entrar" ? "Entrar" : "Criar conta"}
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
          <p className="aj text-center">
            Acesso e dados ficam salvos com segurança no banco de dados da campanha.
          </p>
        </form>
      </div>
    </div>
  );
}
