"use client";

import { AlertTriangle, Camera, FileText, Loader2, UploadCloud, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { ACCEPT_ATTR, formatBytes, MAX_FILE_MB, MAX_FILES } from "@/lib/files";
import { checkFile, type CheckedFile } from "@/lib/files-client";

/**
 * Etapa 3 — envio da arte.
 * Arrastar e soltar, seletor de arquivos e câmera (no celular).
 * Valida formato real, tamanho e integridade antes de aceitar.
 */
export function FileDrop({ files, onChange }: { files: CheckedFile[]; onChange: (files: CheckedFile[]) => void }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const camera = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  // Libera as prévias da memória ao sair.
  useEffect(() => () => filesRef.current.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl)), []);

  const add = async (list: FileList | File[] | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    setBusy(true);
    const errs: string[] = [];
    const accepted: CheckedFile[] = [];
    for (const file of incoming) {
      if (files.length + accepted.length >= MAX_FILES) {
        errs.push(`Limite de ${MAX_FILES} arquivos. Envie os demais pelo WhatsApp.`);
        break;
      }
      const res = await checkFile(file);
      if (!res.ok) errs.push(res.error);
      else if (files.some((f) => f.id === res.value.id)) errs.push(`"${file.name}" já foi adicionado.`);
      else accepted.push(res.value);
    }
    setErrors(errs);
    setBusy(false);
    if (accepted.length) onChange([...files, ...accepted]);
  };

  const remove = (fid: string) => {
    const f = files.find((x) => x.id === fid);
    if (f?.previewUrl) URL.revokeObjectURL(f.previewUrl);
    onChange(files.filter((x) => x.id !== fid));
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          void add(e.dataTransfer.files);
        }}
        className={cn(
          "relative grid place-items-center overflow-hidden rounded-[1.5rem] border-2 border-dashed px-6 py-12 text-center transition",
          over ? "border-cyan bg-cyan/10" : "border-white/15 bg-ink-2 hover:border-white/30",
        )}
      >
        <div aria-hidden className={cn("pointer-events-none absolute inset-0 transition-opacity duration-500", over ? "opacity-100" : "opacity-0")}>
          <div className="absolute -top-10 left-1/4 size-40 rounded-full bg-cyan/30 blur-3xl" />
          <div className="absolute right-1/4 -bottom-10 size-40 rounded-full bg-magenta/30 blur-3xl" />
        </div>
        {busy ? <Loader2 className="size-10 animate-spin text-cyan" aria-hidden /> : <UploadCloud className="size-10 text-white/70" aria-hidden />}
        <p className="mt-4 font-sub text-lg font-semibold">Arraste sua arte aqui</p>
        <p className="mt-1 text-sm text-mute">
          PDF, PNG, JPG ou SVG · até {MAX_FILE_MB} MB cada · até {MAX_FILES} arquivos
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => input.current?.click()} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-paper px-5 font-sub text-sm font-semibold text-ink hover:bg-cyan">
            <FileText className="size-4" aria-hidden /> Escolher arquivos
          </button>
          <button
            type="button"
            onClick={() => camera.current?.click()}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-5 font-sub text-sm font-semibold hover:border-white/50 md:hidden"
          >
            <Camera className="size-4" aria-hidden /> Usar a câmera
          </button>
        </div>
        <input
          ref={input}
          id={`${id}-file`}
          type="file"
          multiple
          accept={ACCEPT_ATTR}
          className="sr-only"
          aria-label="Escolher arquivos de arte"
          onChange={(e) => {
            void add(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          ref={camera}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          aria-label="Fotografar a arte ou rascunho"
          tabIndex={-1}
          onChange={(e) => {
            void add(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div aria-live="polite">
        {errors.length > 0 && (
          <ul className="mt-4 space-y-2">
            {errors.map((err) => (
              <li key={err} className="flex items-start gap-2 rounded-xl bg-magenta/10 px-4 py-3 text-sm text-[#ff8cc6]">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden /> {err}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        <AnimatePresence initial={false}>
          {files.map((f) => (
            <motion.li
              key={f.id}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-ink-2 p-3"
            >
              <div className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-[repeating-conic-gradient(#1e1e24_0_25%,#16161a_0_50%)] bg-[length:12px_12px]">
                {f.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- prévia local (blob:)
                  <img src={f.previewUrl} alt={`Prévia de ${f.file.name}`} className="h-full w-full object-contain" />
                ) : (
                  <span className="font-display text-sm text-magenta">PDF</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{f.file.name}</p>
                <p className="text-xs text-mute">
                  {formatBytes(f.file.size)} · {f.info}
                </p>
                {f.warning && <p className="mt-1 text-xs text-yellow">{f.warning}</p>}
              </div>
              <button type="button" onClick={() => remove(f.id)} className="grid size-10 shrink-0 place-items-center rounded-full text-mute hover:bg-white/10 hover:text-paper" aria-label={`Remover ${f.file.name}`}>
                <X className="size-4" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
