"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, Plus } from "lucide-react";
import { useId } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import type { ProductKey } from "@/content/types";
import { cn } from "@/lib/cn";
import { itemSchema, PRODUCT_MAP, type FieldDef, type QuoteItem } from "@/lib/quote/products";
import { calculateDimensions, formatArea, UNITS, type Unit } from "@/lib/units";

export type ItemValues = {
  product: ProductKey;
  quantity: string;
  width: string;
  height: string;
  unit: Unit;
  details: Record<string, string | boolean>;
};

export function toValues(product: ProductKey, item?: Partial<QuoteItem> | null, prefill?: Partial<ItemValues>): ItemValues {
  const def = PRODUCT_MAP[product];
  const details: Record<string, string | boolean> = {};
  for (const f of def.fields) {
    const v = item?.details?.[f.name];
    details[f.name] = f.type === "toggle" ? Boolean(v) : v === undefined || v === null ? "" : String(v);
  }
  return {
    product,
    quantity: item?.quantity ? String(item.quantity) : (prefill?.quantity ?? "1"),
    width: item?.width ? String(item.width) : (prefill?.width ?? ""),
    height: item?.height ? String(item.height) : (prefill?.height ?? ""),
    unit: item?.unit ?? prefill?.unit ?? "cm",
    details,
  };
}

/** Remove campos vazios antes de validar/salvar. */
function clean(values: ItemValues) {
  const details = Object.fromEntries(Object.entries(values.details).filter(([, v]) => v !== "" && v !== false));
  return { ...values, width: values.width.replace(",", "."), height: values.height.replace(",", "."), details };
}

type Props = {
  product: ProductKey;
  initial: ItemValues;
  editing: boolean;
  onSave: (item: QuoteItem, next: "continue" | "another") => void;
  onBack: () => void;
};

/** Etapa 2 — campos específicos de cada produto (definidos em products.ts). */
export function ItemForm({ product, initial, editing, onSave, onBack }: Props) {
  const def = PRODUCT_MAP[product];
  const id = useId();
  const schema = itemSchema(product);
  const {
    register,
    control,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<ItemValues>({
    defaultValues: initial,
    resolver: ((values, ctx, opts) => (zodResolver(schema) as unknown as Resolver<ItemValues>)(clean(values) as ItemValues, ctx, opts)) as Resolver<ItemValues>,
  });

  const submit = (next: "continue" | "another") =>
    handleSubmit(() => {
      // O resolver já validou; re-parse dos valores brutos para obter o item tipado.
      const parsed = schema.parse(clean(getValues())) as QuoteItem;
      onSave(parsed, next);
    });

  const w = Number(watch("width")?.replace(",", "."));
  const h = Number(watch("height")?.replace(",", "."));
  const q = Number(watch("quantity"));
  const dims = calculateDimensions(w, h, watch("unit"), q || 1);
  const detailErrors = (errors.details ?? {}) as Record<string, { message?: string } | undefined>;

  const renderField = (field: FieldDef) => {
    const fid = `${id}-${field.name}`;
    const err = detailErrors[field.name]?.message;
    const name = `details.${field.name}` as const;
    const label = (
      <label htmlFor={fid} className="label">
        {field.label}
        {"required" in field && field.required && <span className="text-magenta"> *</span>}
      </label>
    );
    let control_: React.ReactNode;
    switch (field.type) {
      case "select":
        control_ = (
          <select id={fid} className="field" aria-invalid={Boolean(err)} {...register(name)}>
            <option value="">Selecione…</option>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        );
        break;
      case "choice":
        return (
          <fieldset key={field.name} className="sm:col-span-2">
            <legend className="label">
              {field.label}
              {field.required && <span className="text-magenta"> *</span>}
            </legend>
            <Controller
              control={control}
              name={name}
              render={({ field: f }) => (
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={field.label}>
                  {field.options.map((o) => {
                    const checked = f.value === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        onClick={() => f.onChange(checked && !field.required ? "" : o.value)}
                        className={cn(
                          "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
                          checked ? "border-cyan bg-cyan/15 text-paper" : "border-white/15 text-white/75 hover:border-white/40",
                        )}
                      >
                        <span className={cn("grid size-4 place-items-center rounded-full border transition", checked ? "border-cyan bg-cyan" : "border-white/30")} aria-hidden>
                          {checked && <Check className="size-3 text-ink" strokeWidth={3} />}
                        </span>
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {err && <p className="mt-1.5 text-sm text-magenta">{err}</p>}
          </fieldset>
        );
      case "toggle":
        return (
          <label key={field.name} htmlFor={fid} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-white/10 px-4 sm:col-span-2">
            <input id={fid} type="checkbox" className="peer sr-only" {...register(name)} />
            <span className="relative h-6 w-11 shrink-0 rounded-full bg-white/15 transition peer-checked:bg-cyan peer-focus-visible:ring-2 peer-focus-visible:ring-yellow after:absolute after:top-1 after:left-1 after:size-4 after:rounded-full after:bg-paper after:transition peer-checked:after:translate-x-5" aria-hidden />
            <span className="font-sub font-semibold">{field.label}</span>
          </label>
        );
      case "number":
        control_ = <input id={fid} type="number" inputMode="numeric" min={field.min} max={field.max} step={field.step} className="field" aria-invalid={Boolean(err)} {...register(name)} />;
        break;
      case "textarea":
        return (
          <div key={field.name} className="sm:col-span-2">
            {label}
            <textarea id={fid} rows={4} maxLength={field.maxLength} placeholder={field.placeholder} className="field resize-y" aria-invalid={Boolean(err)} {...register(name)} />
            {err && <p className="mt-1.5 text-sm text-magenta">{err}</p>}
          </div>
        );
      case "text":
        control_ = <input id={fid} maxLength={field.maxLength} placeholder={field.placeholder} className="field" aria-invalid={Boolean(err)} {...register(name)} />;
        break;
    }
    return (
      <div key={field.name}>
        {label}
        {control_}
        {field.hint && <p className="mt-1.5 text-xs text-mute">{field.hint}</p>}
        {err && <p className="mt-1.5 text-sm text-magenta">{err}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={submit("continue")} noValidate>
      <input type="hidden" {...register("product")} />
      <h2 className="font-display text-2xl md:text-3xl">
        Personalize: <span className="text-cyan">{def.label}</span>
      </h2>
      <p className="mt-1 text-sm text-mute">Campos com * são obrigatórios. Na dúvida, escolha “Não sei — quero indicação”.</p>

      {def.dimensions !== "none" && (
        <fieldset className="mt-8">
          <legend className="label">
            Dimensões {def.dimensions === "required" ? <span className="text-magenta">*</span> : <span className="font-normal text-mute">(aproximadas, se souber)</span>}
          </legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_0.9fr]">
            <div>
              <label htmlFor={`${id}-w`} className="sr-only">
                Largura
              </label>
              <input id={`${id}-w`} inputMode="decimal" placeholder="Largura" className="field" aria-invalid={Boolean(errors.width)} {...register("width")} />
              {errors.width && <p className="mt-1.5 text-sm text-magenta">{errors.width.message}</p>}
            </div>
            <div>
              <label htmlFor={`${id}-h`} className="sr-only">
                Altura
              </label>
              <input id={`${id}-h`} inputMode="decimal" placeholder="Altura" className="field" aria-invalid={Boolean(errors.height)} {...register("height")} />
              {errors.height && <p className="mt-1.5 text-sm text-magenta">{errors.height.message}</p>}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor={`${id}-u`} className="sr-only">
                Unidade de medida
              </label>
              <select id={`${id}-u`} className="field" {...register("unit")}>
                {UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {dims && (
            <p className="mt-2 text-sm text-white/60" aria-live="polite">
              Área de cada peça: <strong className="text-paper">{formatArea(dims.areaM2)}</strong>
              {q > 1 && (
                <>
                  {" "}
                  · total: <strong className="text-yellow">{formatArea(dims.totalAreaM2)}</strong>
                </>
              )}
            </p>
          )}
        </fieldset>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-q`} className="label">
            {def.quantityLabel} <span className="text-magenta">*</span>
          </label>
          <input id={`${id}-q`} type="number" inputMode="numeric" min={1} className="field" aria-invalid={Boolean(errors.quantity)} {...register("quantity")} />
          {errors.quantity && <p className="mt-1.5 text-sm text-magenta">{errors.quantity.message}</p>}
        </div>
        {def.fields.map(renderField)}
      </div>

      <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
        <button type="button" onClick={onBack} className="min-h-12 rounded-full px-5 text-sm font-semibold text-mute hover:text-paper">
          Voltar
        </button>
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:justify-end">
          {!editing && (
            <button
              type="button"
              onClick={submit("another")}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-5 font-sub text-sm font-semibold hover:border-white/50"
            >
              <Plus className="size-4" aria-hidden /> Adicionar e escolher outro produto
            </button>
          )}
          <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-paper px-6 font-sub font-semibold text-ink transition hover:bg-cyan">
            {editing ? "Salvar alterações" : "Continuar"} <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </form>
  );
}
