import React, { useEffect, useState } from "react";

// عدّل مسار الشعار حسب مشروعك
import logo from "@/assets/logo.png";

type Props = {
  onDone: () => void;
  skipIfSeen?: boolean; // لو عايزه يشتغل مرة واحدة في السيشن
};

export function SplashScreen({ onDone, skipIfSeen = true }: Props) {
  const [phase, setPhase] = useState<"flash" | "logoIn" | "moveUp">("flash");

  useEffect(() => {
    if (skipIfSeen) {
      const seen = sessionStorage.getItem("seen_splash");
      if (seen === "1") {
        onDone();
        return;
      }
      sessionStorage.setItem("seen_splash", "1");
    }

    const t1 = window.setTimeout(() => setPhase("logoIn"), 650);   // بعد الوميض
    const t2 = window.setTimeout(() => setPhase("moveUp"), 1650);  // تحريك لفوق
    const t3 = window.setTimeout(() => onDone(), 2150);            // إنهاء

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [onDone, skipIfSeen]);

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
      {/* وميض بالمنتصف */}
      {phase === "flash" && (
        <div
          className="rounded-full bg-primary"
          style={{
            width: 18,
            height: 18,
            animation: "splash-flash 650ms ease-in-out",
          }}
        />
      )}

      {/* الشعار يظهر تدريجيًا ثم يتحرك لفوق */}
      {(phase === "logoIn" || phase === "moveUp") && (
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: "translate(-50%, -50%)",
            animation:
              phase === "logoIn"
                ? "splash-logo-in 550ms ease-out forwards"
                : "splash-logo-move-up 500ms ease-in forwards",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            className="h-20 w-20 md:h-24 md:w-24 object-contain"
            draggable={false}
          />
        </div>
      )}
    </div>
  );
}
