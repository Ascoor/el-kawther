import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

type BrandSplashLoaderProps = {
  isOpen?: boolean;
  auto?: boolean;
  onDone?: () => void;
  minDurationMs?: number;
  className?: string;
};

const DEFAULT_MIN_DURATION = 2000;
const EXIT_DURATION = 0.25;

export function BrandSplashLoader({
  isOpen,
  auto = false,
  onDone,
  minDurationMs = DEFAULT_MIN_DURATION,
  className,
}: BrandSplashLoaderProps) {
  const { isDark } = useTheme();
  const fallbackIsDark =
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false;
  const resolvedIsDark = isDark ?? fallbackIsDark;
  const [open, setOpen] = useState(auto ? true : Boolean(isOpen));
  const startRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const logoSrc = useMemo(() => (resolvedIsDark ? logoDark : logoLight), [resolvedIsDark]);

  useEffect(() => {
    if (!auto) return;
    startRef.current = Date.now();
    setOpen(true);

    const timer = window.setTimeout(() => {
      setOpen(false);
    }, minDurationMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [auto, minDurationMs]);

  useEffect(() => {
    if (auto) return;

    if (isOpen) {
      startRef.current = Date.now();
      setOpen(true);
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
      return;
    }

    if (!isOpen && open) {
      const elapsed = startRef.current ? Date.now() - startRef.current : minDurationMs;
      const remaining = Math.max(minDurationMs - elapsed, 0);
      closeTimerRef.current = window.setTimeout(() => {
        setOpen(false);
      }, remaining);
    }

    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, [auto, isOpen, minDurationMs, open]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        onDone?.();
      }}
    >
      {open && (
        <motion.div
          key="brand-splash"
          className={cn(
            "fixed inset-0 z-[9999] flex items-center justify-center",
            className,
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_DURATION, ease: "easeOut" }}
          role="status"
          aria-live="polite"
        >
          <div
            className={cn(
              "absolute inset-0",
              resolvedIsDark
                ? "bg-gradient-to-br from-[#0b0f14] via-[#111722] to-[#0a0d12]"
                : "bg-gradient-to-br from-[#fef7ea] via-[#f7edde] to-[#f5e3cc]",
            )}
          />
          {resolvedIsDark && (
            <div
              className="absolute inset-0 opacity-30 mix-blend-soft-light"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E\")",
              }}
            />
          )}
          <motion.img
            src={logoSrc}
            alt="El Kawther"
            className={cn(
              "relative h-24 w-24 md:h-28 md:w-28 object-contain",
              resolvedIsDark
                ? "drop-shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
                : "drop-shadow-[0_14px_32px_rgba(120,82,36,0.25)]",
            )}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{
              opacity: [0, 1, 1],
              scale: [0.98, 1.03, 1],
            }}
            transition={{
              duration: 2,
              ease: [0.16, 1, 0.3, 1],
              times: [0, 0.45, 1],
            }}
            draggable={false}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
