# 7. Autenticação e segurança

## 7.1 Fluxo de autenticação

`src/lib/auth.tsx` expõe o `AuthProvider` e o hook `useAuth()`:

```ts
{ session, carregando, entrar, criarConta, entrarDev, sair }
```

- `session`: `{ id, email }` ou `null`.
- Assina `supabase.auth.onAuthStateChange` e também lê `getSession()` na montagem, para cobrir
  recarregamento de página.
- `criarConta(email, senha)`: `signUp` com `emailRedirectTo` na origem atual.
- `entrar(email, senha)`: `signInWithPassword`.
- `sair()`: `signOut` e limpa o estado local.

O `AppShell` funciona como gate: sem `session`, renderiza `Login` no lugar do conteúdo.

## 7.2 Conta de desenvolvimento (temporária)

Enquanto o projeto está em desenvolvimento, existe uma conta padrão **visível na tela de login**:

```
E-mail: equipe@tiagobotelho.dev
Senha:  campanha2026
```

`entrarDev()` tenta autenticar; se a conta não existir, faz `signUp` e tenta novamente. A
confirmação de e-mail está desativada no projeto para permitir esse fluxo.

> **Antes de ir para produção**, obrigatoriamente:
> 1. remover `DEV_EMAIL`, `DEV_SENHA`, `entrarDev()` e o painel de credenciais do `Login`;
> 2. reativar a confirmação de e-mail e a verificação de senhas vazadas (HIBP);
> 3. apagar a conta `equipe@tiagobotelho.dev`;
> 4. avaliar desativar o auto-cadastro, deixando a criação de contas com a coordenação.

## 7.3 Isolamento de dados (RLS)

- `fichas` e `fotos_lideranca`: todas as políticas comparam `user_id = auth.uid()`. Um usuário não
  enxerga nem apaga registros de outro. Sem grant para `anon`.
- Tabelas de referência: `SELECT` público, sem `INSERT/UPDATE/DELETE` para `anon` ou
  `authenticated`. Alterações só por migração/`service_role`.

## 7.4 Superfície pública

O bundle contém apenas a URL do projeto e a **chave publicável** — ambas públicas por natureza; a
proteção real é RLS + grants. Não existe `service_role` no cliente e não há função de servidor.

Consequência aceita: **os dados geográficos e estatísticos são legíveis por qualquer visitante**
que conheça a URL do projeto. Isso é intencional (o mapa precisa carregar durante o SSR/prerender
e são dados eleitorais públicos). Se essa exposição deixar de ser aceitável, o caminho é restringir
as políticas a `authenticated` e mover a carga do dataset para uma rota autenticada.

## 7.5 Dados pessoais (LGPD)

As fichas guardam nome, telefone, foto e posicionamento político — dado sensível. Cuidados
implementados e recomendados:

- campo `autorizou_contato` deve ser preenchido antes de qualquer uso do telefone;
- fotos são reduzidas a 320 px e ficam restritas ao usuário que as cadastrou;
- não exportar fichas para fora da plataforma sem base legal;
- em caso de pedido de exclusão, apagar a ficha correspondente (`useApagaFicha`).
