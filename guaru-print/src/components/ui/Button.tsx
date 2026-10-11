"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent, PointerEvent, ReactNode } from "react";
import { trackEvent, type EventName, type EventParams } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { Magnetic } from "./Magnetic";

type Variant = "primary" | "ghost" | "whatsapp" | "cmyk" | "subtle";
type Size = "md" | "lg" | "sm";

type Common = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Cor da "tinta" que se espalha no hover. */
  ink?: "cyan" | "magenta" | "yellow" | "white";
  icon?: ReactNode;
  iconLeft?: ReactNode;
  magnetic?: boolean;
  className?: string;
  track?: { name: EventName; params?: EventParams };
};

type AsLink = Common & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href" | "children" | "className">;
type AsButton = Common & { href?: undefined } & Omit<ComponentProps<"button">, "children" | "className">;

const INK: Record<NonNullable<Common["ink"]>, string> = {
  cyan: "#00AEEF",
  magenta: "#E52B91",
  yellow: "#F7E500",
  white: "#FFFFFF",
};

const VARIANTS: Record<Variant, string> = {
  primary: "bg-paper text-ink hover:text-paper",
  ghost: "border border-white/20 text-paper hover:border-transparent hover:text-ink",
  whatsapp: "bg-[#25D366] text-ink hover:text-ink",
  cmyk: "bg-magenta text-paper hover:text-ink",
  subtle: "bg-white/[0.06] text-paper hover:text-ink",
};

const SIZES: Record<Size, string> = {
  sm: "min-h-10 px-4 text-[0.8rem] gap-2",
  md: "min-h-12 px-6 text-[0.9rem] gap-2.5",
  lg: "min-h-14 px-8 text-base gap-3",
};

function setInkOrigin(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
}

export function Button(props: AsLink | AsButton) {
  const { children, variant = "primary", size = "md", ink, icon, iconLeft, magnetic = true, className, track, ...rest } = props;
  const inkColor = ink ?? (variant === "primary" ? "magenta" : variant === "cmyk" ? "yellow" : variant === "whatsapp" ? "white" : "white");
  const classes = cn(
    "ink-btn inline-flex items-center justify-center rounded-full font-sub font-semibold tracking-[-0.01em] whitespace-nowrap transition-colors duration-500 disabled:pointer-events-none disabled:opacity-40",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
  const style = { "--ink": INK[inkColor] } as React.CSSProperties;
  const content = (
    <>
      <span className="ink" aria-hidden />
      {iconLeft}
      <span>{children}</span>
      {icon}
    </>
  );

  const onTrack = () => track && trackEvent(track.name, track.params);
  let node: ReactNode;

  if ("href" in props && props.href !== undefined) {
    const { href, external, onClick, ...anchorRest } = rest as Omit<AsLink, keyof Common>;
    const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);
    const handle = (e: MouseEvent<HTMLAnchorElement>) => {
      onTrack();
      onClick?.(e);
    };
    node = isExternal ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} style={style} onPointerEnter={setInkOrigin} onClick={handle} {...anchorRest}>
        {content}
      </a>
    ) : (
      <Link href={href} className={classes} style={style} onPointerEnter={setInkOrigin} onClick={handle} {...anchorRest}>
        {content}
      </Link>
    );
  } else {
    const { onClick, type = "button", ...buttonRest } = rest as Omit<AsButton, keyof Common>;
    node = (
      <button
        type={type}
        className={classes}
        style={style}
        onPointerEnter={setInkOrigin}
        onClick={(e) => {
          onTrack();
          onClick?.(e);
        }}
        {...buttonRest}
      >
        {content}
      </button>
    );
  }

  return magnetic ? <Magnetic>{node}</Magnetic> : node;
}
