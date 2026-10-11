"use client";

import { useRouter } from "next/navigation";
import type { ProductKey } from "@/content/types";
import { trackEvent } from "@/lib/analytics";
import { quoteList } from "@/lib/quote/list-store";
import { ItemForm, toValues } from "./ItemForm";

/**
 * Formulário de orçamento embutido na página do serviço. Ao salvar, o item
 * entra na lista de orçamento e o cliente segue para arte e dados.
 */
export function ServiceQuickQuote({ product, service }: { product: ProductKey; service: string }) {
  const router = useRouter();
  return (
    <ItemForm
      product={product}
      editing={false}
      initial={toValues(product)}
      onBack={() => router.push("/orcamento")}
      onSave={(item, next) => {
        quoteList.add(item);
        trackEvent("quote_list_add", { service, location: "service-page" });
        router.push(next === "another" ? "/orcamento" : "/orcamento?etapa=arte#formulario");
      }}
    />
  );
}
