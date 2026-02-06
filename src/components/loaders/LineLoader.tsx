import React from "react";
import { cn } from "@/lib/utils";

type LineLoaderProps = {
  className?: string;
};

export function LineLoader({ className }: LineLoaderProps) {
  return (
    <span
      className={cn(
        "relative block h-2 w-full overflow-hidden rounded-full bg-muted/40",
        className,
      )}
      aria-live="polite"
    >
      <span className="absolute inset-y-0 left-0 w-1/2 animate-shimmer rounded-full bg-gradient-to-r from-transparent via-muted to-transparent" />
    </span>
  );
}
