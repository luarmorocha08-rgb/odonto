/**
 * Regras de arquivos de arte — compartilhadas entre navegador e servidor.
 */
export const MAX_FILES = 5;
export const MAX_FILE_MB = 25;
export const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

export type ArtKind = "pdf" | "png" | "jpg" | "svg";

export const ART_TYPES: Record<ArtKind, { mime: string; ext: string[]; label: string }> = {
  pdf: { mime: "application/pdf", ext: ["pdf"], label: "PDF" },
  png: { mime: "image/png", ext: ["png"], label: "PNG" },
  jpg: { mime: "image/jpeg", ext: ["jpg", "jpeg"], label: "JPG" },
  svg: { mime: "image/svg+xml", ext: ["svg"], label: "SVG" },
};

export const ACCEPT_ATTR = ".pdf,.png,.jpg,.jpeg,.svg,application/pdf,image/png,image/jpeg,image/svg+xml";

export function kindFromName(name: string): ArtKind | null {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return (Object.keys(ART_TYPES) as ArtKind[]).find((k) => ART_TYPES[k].ext.includes(ext)) ?? null;
}

/** Identifica o tipo real pelo conteúdo (assinatura "mágica"), não pela extensão. */
export function sniffKind(bytes: Uint8Array): ArtKind | null {
  const b = bytes;
  if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return "pdf"; // %PDF
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  const head = new TextDecoder().decode(b.slice(0, 512)).replace(/^﻿/, "").trimStart().toLowerCase();
  if (head.startsWith("<svg") || ((head.startsWith("<?xml") || head.startsWith("<!--") || head.startsWith("<!doctype svg")) && head.includes("<svg"))) return "svg";
  return null;
}

/** SVG com script/eventos/links externos é recusado (proteção contra XSS). */
export function isUnsafeSvg(text: string) {
  const t = text.toLowerCase();
  return /<script|javascript:|\son[a-z]+\s*=|<foreignobject|<iframe|<embed|<object|xlink:href\s*=\s*["']\s*(?!#)|\shref\s*=\s*["']\s*(?!#|data:image)/.test(t);
}

export function safeFileName(name: string) {
  const kind = kindFromName(name);
  const base = name
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "arte"}.${kind ? ART_TYPES[kind].ext[0] : "bin"}`;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}
