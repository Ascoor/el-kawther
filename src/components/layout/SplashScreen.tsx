import React, { useEffect, useMemo, useState } from "react";

import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

type Props = {
  onDone: () => void;
  skipIfSeen?: boolean;
};

type Phase = "idle" | "flash" | "logoIn" | "moveToHeader";

export function SplashScreen({ onDone, skipIfSeen = true }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const { isDark } = useTheme();
  const { isArabic } = useLanguage();

  const logoSrc = useMemo(() => (isDark ? logoDark : logoLight), [isDark]);

  const [moveVars, setMoveVars] = useState<{ dx: string; dy: string; s: string }>({
    dx: "0px",
    dy: "-220px",
    s: "0.5",
  });

  useEffect(() => {
    if (skipIfSeen) {
      const seen = sessionStorage.getItem("seen_splash");
      if (seen === "1") {
        onDone();
        return;
      }
      sessionStorage.setItem("seen_splash", "1");
    }

    const t0 = window.setTimeout(() => setPhase("idle"), 0);
    const t1 = window.setTimeout(() => setPhase("flash"), 2000);
    const t2 = window.setTimeout(() => setPhase("logoIn"), 3000);
    const t3 = window.setTimeout(() => setPhase("moveToHeader"), 3500);
    const t4 = window.setTimeout(() => onDone(), 4100);

    return () => {
      [t0, t1, t2, t3, t4].forEach(window.clearTimeout);
    };
  }, [onDone, skipIfSeen]);

  useEffect(() => {
    const headerLogo = document.querySelector<HTMLElement>("[data-header-logo]");
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const startX = vw / 2;
    const startY = vh / 2;

    const splashSize = 96;

    if (headerLogo) {
      const rect = headerLogo.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;

      const dx = targetX - startX;
      const dy = targetY - startY;

      const s = (rect.height || 40) / splashSize;

      setMoveVars({ dx: `${dx}px`, dy: `${dy}px`, s: `${s}` });
      return;
    }

    const padX = 24;
    const padY = 12;

    const targetX = isArabic ? vw - padX : padX;
    const targetY = padY;

    const dx = targetX - startX;
    const dy = targetY - startY;

    setMoveVars({ dx: `${dx}px`, dy: `${dy}px`, s: "0.42" });
  }, [isArabic]);

  return (
    <div className="fixed inset-0 z-[9999] bg-background">
      {phase === "flash" && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className="rounded-full bg-primary"
            style={{
              width: 18,
              height: 18,
              animation: "splash-flash 1000ms ease-in-out",
            }}
          />
        </div>
      )}

      {(phase === "logoIn" || phase === "moveToHeader") && (
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            ["--dx" as any]: moveVars.dx,
            ["--dy" as any]: moveVars.dy,
            ["--s" as any]: moveVars.s,
            animation:
              phase === "logoIn"
                ? "splash-logo-in 500ms ease-out forwards"
                : "splash-logo-to-header 600ms ease-in forwards",
          }}
        >
          <img
            src={logoSrc}
            alt="Logo"
            className="h-24 w-24 object-contain"
            draggable={false}
          />
        </div>
      )}
    </div>
  );
}
