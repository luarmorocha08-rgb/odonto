"use client";

import { ART_TYPES, isUnsafeSvg, kindFromName, MAX_FILE_BYTES, MAX_FILE_MB, sniffKind, type ArtKind } from "./files";

export type CheckedFile = {
  id: string;
  file: File;
  kind: ArtKind;
  previewUrl: string | null;
  info: string | null;
  warning: string | null;
};

export type FileCheck = { ok: true; value: CheckedFile } | { ok: false; error: string };

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("decode"));
    img.src = url;
  });
}

/**
 * Valida formato (pela assinatura do arquivo), tamanho e integridade.
 * Imagens são decodificadas; PDFs precisam ter cabeçalho e final válidos.
 */
export async function checkFile(file: File): Promise<FileCheck> {
  const byName = kindFromName(file.name);
  if (!byName) return { ok: false, error: `"${file.name}": formato não aceito. Envie PDF, PNG, JPG ou SVG.` };
  if (file.size === 0) return { ok: false, error: `"${file.name}" está vazio.` };
  if (file.size > MAX_FILE_BYTES) return { ok: false, error: `"${file.name}" passa de ${MAX_FILE_MB} MB. Envie pelo WhatsApp ou por link (Drive/WeTransfer).` };

  const head = new Uint8Array(await file.slice(0, 1024).arrayBuffer());
  const kind = sniffKind(head);
  if (!kind) return { ok: false, error: `"${file.name}" não parece ser um ${ART_TYPES[byName].label} válido.` };
  if (kind !== byName && !(kind === "jpg" && byName === "jpg")) {
    return { ok: false, error: `"${file.name}" tem extensão .${file.name.split(".").pop()} mas o conteúdo é ${ART_TYPES[kind].label}. Renomeie o arquivo e tente de novo.` };
  }

  const id = `${file.name}-${file.size}-${file.lastModified}`;

  if (kind === "pdf") {
    const tail = new TextDecoder().decode(new Uint8Array(await file.slice(Math.max(0, file.size - 2048)).arrayBuffer()));
    if (!tail.includes("%%EOF")) return { ok: false, error: `"${file.name}" parece incompleto ou corrompido. Exporte o PDF novamente.` };
    return { ok: true, value: { id, file, kind, previewUrl: null, info: "Documento PDF", warning: null } };
  }

  if (kind === "svg") {
    const text = await file.text();
    if (isUnsafeSvg(text)) return { ok: false, error: `"${file.name}" contém scripts ou links externos. Exporte o SVG sem esses elementos ou envie em PDF.` };
    const doc = new DOMParser().parseFromString(text, "image/svg+xml");
    if (doc.querySelector("parsererror")) return { ok: false, error: `"${file.name}" está corrompido (SVG inválido).` };
    const url = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }));
    return { ok: true, value: { id, file, kind, previewUrl: url, info: "Vetor SVG", warning: null } };
  }

  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const warning = Math.max(w, h) < 1200 ? "Resolução baixa para impressão — a equipe vai avaliar se é suficiente para o tamanho desejado." : null;
    return { ok: true, value: { id, file, kind, previewUrl: url, info: `${w} × ${h} px`, warning } };
  } catch {
    URL.revokeObjectURL(url);
    return { ok: false, error: `"${file.name}" não pôde ser aberto — o arquivo pode estar corrompido.` };
  }
}
