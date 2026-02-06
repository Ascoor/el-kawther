import React from "react";
import { cn } from "@/lib/utils";

type DotsLoaderProps = {
  className?: string;
  dotClassName?: string;
};

export function DotsLoader({ className, dotClassName }: DotsLoaderProps) {
  const dotClasses = cn("h-2 w-2 rounded-full bg-current opacity-60", dotClassName);

  return (
    <span className={cn("inline-flex items-center gap-1", className)} aria-live="polite">
      <span className={dotClasses} style={{ animation: "dot-bounce 1.2s infinite" }} />
      <span
        className={dotClasses}
        style={{ animation: "dot-bounce 1.2s infinite 0.2s" }}
      />
      <span
        className={dotClasses}
        style={{ animation: "dot-bounce 1.2s infinite 0.4s" }}
      />
    </span>
  );
}
