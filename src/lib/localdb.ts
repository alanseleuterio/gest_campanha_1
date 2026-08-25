/**
 * Camada de persistência local (LocalStorage).
 * Todo o estado alterável da plataforma vive no navegador do usuário.
 */

const PREFIXO = "tb:";

export function ler<T>(chaveLocal: string, padrao: T): T {
  if (typeof window === "undefined") return padrao;
  try {
    const bruto = window.localStorage.getItem(PREFIXO + chaveLocal);
    if (!bruto) return padrao;
    return JSON.parse(bruto) as T;
  } catch {
    return padrao;
  }
}

export function gravar<T>(chaveLocal: string, valor: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIXO + chaveLocal, JSON.stringify(valor));
  } catch {
    /* quota cheia ou modo privado */
  }
}

export function remover(chaveLocal: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PREFIXO + chaveLocal);
}

export function novoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Hash simples só para não guardar a senha em texto puro no navegador. */
export function hash(texto: string): string {
  let h = 5381;
  for (let i = 0; i < texto.length; i++) h = ((h << 5) + h + texto.charCodeAt(i)) | 0;
  return String(h >>> 0);
}

export const CHAVES = {
  fichas: "fichas",
  fotos: "fotos",
  contas: "contas",
  sessao: "sessao",
} as const;
