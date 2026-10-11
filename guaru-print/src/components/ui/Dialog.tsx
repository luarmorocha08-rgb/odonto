"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { useLenis } from "@/components/layout/SmoothScroll";
import { cn } from "@/lib/cn";

/**
 * Diálogo modal acessível baseado em <dialog> (foco preso, Esc fecha,
 * conteúdo de fundo inerte).
 */
export function Dialog({
  open,
  onClose,
  label,
  children,
  className,
  position = "center",
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  className?: string;
  position?: "center" | "top";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      lenis?.stop();
    } else if (!open && dialog.open) {
      dialog.close();
    }
    if (!open) lenis?.start();
  }, [open, lenis]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "m-0 h-auto max-h-none w-full max-w-none bg-transparent p-0 text-paper backdrop:bg-black/70 backdrop:backdrop-blur-sm",
        "open:flex open:min-h-dvh open:justify-center",
        position === "top" ? "open:items-start" : "open:items-center",
      )}
    >
      <div className={cn("relative mx-4 my-6 w-full rounded-3xl border border-line bg-ink-2 shadow-2xl md:my-[8vh]", className)}>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 grid size-11 place-items-center rounded-full text-mute transition hover:bg-white/10 hover:text-paper"
          aria-label="Fechar"
        >
          <X className="size-5" />
        </button>
        {children}
      </div>
    </dialog>
  );
}
