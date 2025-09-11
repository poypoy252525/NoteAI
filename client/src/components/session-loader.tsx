import { cn } from "@/lib/utils";
import React from "react";

type SessionLoaderVariant = "spinner" | "dots" | "pulse";

interface SessionLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  variant?: SessionLoaderVariant;
}

const Spinner = () => (
  <div
    className="h-5 w-5 rounded-full border-2 border-muted-foreground/40 border-t-transparent animate-spin"
    aria-hidden
  />
);

const Dots = () => (
  <div className="flex items-center gap-1.5" aria-hidden>
    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:-0.2s]" />
    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce" />
    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:0.2s]" />
  </div>
);

const PulseBlocks = () => (
  <div className="flex items-center gap-2" aria-hidden>
    <div className="h-3 w-12 rounded bg-muted animate-pulse" />
    <div className="h-3 w-8 rounded bg-muted animate-pulse" />
    <div className="h-3 w-16 rounded bg-muted animate-pulse" />
  </div>
);

export function SessionLoader({
  message = "Loading…",
  variant = "spinner",
  className,
  ...props
}: SessionLoaderProps) {
  const Indicator =
    variant === "dots" ? Dots : variant === "pulse" ? PulseBlocks : Spinner;

  return (
    <div
      className={cn(
        "min-h-svh grid place-items-center bg-background text-muted-foreground",
        className
      )}
      role="status"
      aria-busy
      {...props}
    >
      <div className="flex items-center gap-3">
        <Indicator />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}

export default SessionLoader;
