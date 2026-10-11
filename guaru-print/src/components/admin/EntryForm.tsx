"use client";

import { useActionState } from "react";
import { saveEntry } from "@/app/admin/actions";
import type { AdminField } from "@/lib/admin/entities";

function toText(field: AdminField, value: unknown) {
  if (value == null) return "";
  if (field.type === "list" || field.type === "images") return (value as string[]).join("\n");
  if (field.type === "pairs") return (value as { label: string; value: string }[]).map((p) => `${p.label}: ${p.value}`).join("\n");
  return String(value);
}

/** Formulário genérico do painel, desenhado a partir da definição da entidade. */
export function EntryForm({ entity, fields, data, published, previousKey, disabled }: { entity: string; fields: readonly AdminField[]; data: Record<string, unknown>; published: boolean; previousKey: string; disabled: boolean }) {
  const [state, action, pending] = useActionState(saveEntry, undefined);
  return (
    <form action={action} className="max-w-3xl space-y-6">
      <input type="hidden" name="__entity" value={entity} />
      <input type="hidden" name="__previous" value={previousKey} />
      <fieldset disabled={disabled || pending} className="space-y-6 disabled:opacity-60">
        {fields.map((f) => {
          const id = `f-${f.name}`;
          const value = data[f.name];
          return (
            <div key={f.name}>
              {f.type !== "boolean" && (
                <label htmlFor={id} className="label">
                  {f.label}
                  {f.required && <span className="text-magenta"> *</span>}
                </label>
              )}
              {f.type === "textarea" || f.type === "list" || f.type === "pairs" ? (
                <textarea id={id} name={f.name} rows={f.type === "textarea" ? 5 : 4} defaultValue={toText(f, value)} className="field" />
              ) : f.type === "select" ? (
                <select id={id} name={f.name} defaultValue={String(value ?? "")} className="field">
                  {f.options!.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : f.type === "boolean" ? (
                <label className="flex items-center gap-3">
                  <input id={id} type="checkbox" name={f.name} defaultChecked={Boolean(value)} className="size-5 accent-cyan" />
                  <span className="font-sub font-semibold">{f.label}</span>
                </label>
              ) : f.type === "image" ? (
                <div className="space-y-2">
                  {typeof value === "string" && value && (
                    // eslint-disable-next-line @next/next/no-img-element -- prévia no painel
                    <img src={value} alt="" className="h-32 rounded-xl object-cover" />
                  )}
                  <input id={id} name={f.name} defaultValue={String(value ?? "")} placeholder="URL da imagem" className="field" />
                  <input type="file" name={`${f.name}__file`} accept="image/jpeg,image/png,image/webp,image/avif" className="block text-sm" aria-label={`Enviar ${f.label}`} />
                  {Boolean(value) && (
                    <label className="flex items-center gap-2 text-sm text-mute">
                      <input type="checkbox" name={`${f.name}__remove`} /> Remover imagem
                    </label>
                  )}
                </div>
              ) : f.type === "images" ? (
                <div className="space-y-2">
                  <textarea id={id} name={f.name} rows={3} defaultValue={toText(f, value)} placeholder="Uma URL por linha" className="field" />
                  <input type="file" multiple name={`${f.name}__file`} accept="image/jpeg,image/png,image/webp,image/avif" className="block text-sm" aria-label={`Adicionar ${f.label}`} />
                </div>
              ) : (
                <input id={id} name={f.name} type={f.type === "number" ? "number" : "text"} defaultValue={String(value ?? "")} required={f.required} className="field" />
              )}
              {f.hint && <p className="mt-1.5 text-xs text-mute">{f.hint}</p>}
            </div>
          );
        })}
        {entity !== "settings" && (
          <label className="flex items-center gap-3">
            <input type="checkbox" name="__published" defaultChecked={published} className="size-5 accent-cyan" />
            <span className="font-sub font-semibold">Publicado no site</span>
          </label>
        )}
        {entity === "settings" && <input type="hidden" name="__published" value="on" />}
      </fieldset>
      {state?.error && (
        <p role="alert" className="rounded-xl bg-magenta/10 p-3 text-sm text-[#ff8cc6]">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={disabled || pending} className="min-h-12 rounded-full bg-paper px-8 font-sub font-semibold text-ink disabled:opacity-50">
        {pending ? "Salvando…" : "Salvar"}
      </button>
    </form>
  );
}
