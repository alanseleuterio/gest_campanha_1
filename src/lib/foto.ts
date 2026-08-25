/** Abre a câmera / galeria, recorta a imagem em um quadrado de 320 px e devolve um data URI JPEG. */
export function pedeFoto(cb: (dataUri: string) => void) {
  const i = document.createElement("input");
  i.type = "file";
  i.accept = "image/*";
  i.setAttribute("capture", "environment");
  i.onchange = () => {
    const f = i.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const im = new Image();
      im.onload = () => {
        const L = 320;
        const c = document.createElement("canvas");
        const lado = Math.min(im.width, im.height);
        c.width = L;
        c.height = L;
        const ctx = c.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(im, (im.width - lado) / 2, (im.height - lado) / 2, lado, lado, 0, 0, L, L);
        cb(c.toDataURL("image/jpeg", 0.82));
      };
      im.src = String(r.result);
    };
    r.readAsDataURL(f);
  };
  i.click();
}

export function baixaArquivo(nome: string, conteudo: string, tipo: string) {
  const blob = new Blob([conteudo], { type: tipo });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = nome;
  a.click();
  URL.revokeObjectURL(a.href);
}
