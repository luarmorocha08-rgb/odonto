"use client";

import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = ComponentProps<"a"> & {
  event: Parameters<typeof trackEvent>[0];
  params?: Parameters<typeof trackEvent>[1];
};

/** Link externo com registro de evento de conversão. */
export function TrackedAnchor({ event, params, onClick, ...props }: Props) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackEvent(event, params);
        onClick?.(e);
      }}
    />
  );
}
