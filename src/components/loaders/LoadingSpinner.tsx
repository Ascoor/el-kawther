import React from "react";
import { cn } from "@/lib/utils";

type LoadingSpinnerProps = {
  size?: number;
  className?: string;
};

export function LoadingSpinner({ size = 14, className }: LoadingSpinnerProps) {
  return (
    <span
      className={cn("inline-flex items-center justify-center", className)}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="animate-spin text-current"
        fill="none"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-80"
          d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

type ButtonLoadingProps = {
  label?: string;
  className?: string;
  spinnerSize?: number;
};

export function ButtonLoading({ label = "جاري...", className, spinnerSize }: ButtonLoadingProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LoadingSpinner size={spinnerSize ?? 14} />
      <span>{label}</span>
    </span>
  );
}
