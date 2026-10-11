"use client";

import { ArrowUpRight } from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button } from "./Button";
import { WhatsAppIcon } from "./BrandIcons";

export function WhatsAppButton({
  message,
  label = "Falar no WhatsApp",
  location,
  service,
  size = "md",
  variant = "whatsapp",
  className,
}: {
  message?: string;
  label?: string;
  location: string;
  service?: string;
  size?: "sm" | "md" | "lg";
  variant?: "whatsapp" | "ghost" | "primary";
  className?: string;
}) {
  return (
    <Button
      href={whatsappUrl(message)}
      external
      variant={variant}
      size={size}
      className={className}
      iconLeft={<WhatsAppIcon className="size-5" />}
      icon={<ArrowUpRight className="size-4" aria-hidden />}
      track={{ name: "whatsapp_click", params: { location, service } }}
      aria-label={`${label} (abre o WhatsApp em nova aba)`}
    >
      {label}
    </Button>
  );
}
