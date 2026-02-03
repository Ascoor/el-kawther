import React from "react";

import logoLight from "@/assets/logo-light.png";
import patternDark from "@/assets/pattern-dark.png";
import {
  frozenPeas,
  frozenOkra,
  frozenMolokhia,
  chickenBreast,
  wholeChicken,
  mincedBeef,
  halwaniBeefBurger,
  juhaynaMilk,
  juhaynaYogurt,
  domtyCheese,
  egyptianRice,
  pastaPenne,
  sunflowerOil,
} from "@/assets/products";

const productCollection = [
  { src: frozenPeas, alt: "Frozen green peas" },
  { src: frozenOkra, alt: "Frozen okra" },
  { src: frozenMolokhia, alt: "Frozen molokhia" },
  { src: chickenBreast, alt: "Frozen chicken breast" },
  { src: wholeChicken, alt: "Whole frozen chicken" },
  { src: mincedBeef, alt: "Frozen minced meat" },
  { src: halwaniBeefBurger, alt: "Frozen meat patties" },
  { src: juhaynaMilk, alt: "Milk carton" },
  { src: juhaynaYogurt, alt: "Yogurt cups" },
  { src: domtyCheese, alt: "White cheese packs" },
  { src: egyptianRice, alt: "Egyptian rice bag" },
  { src: pastaPenne, alt: "Pasta bags" },
  { src: sunflowerOil, alt: "Sunflower oil bottle" },
];

export function HeroCollection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative min-h-[360px] sm:min-h-[440px] md:min-h-[520px] lg:min-h-[640px]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at top, rgba(255, 255, 255, 0.12), transparent 55%), linear-gradient(135deg, #1b0b10 0%, #2a0f16 45%, #3a1520 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage: `url(${patternDark})`,
            backgroundSize: "460px",
            mixBlendMode: "screen",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/30" />

        <div className="relative container h-full py-10 sm:py-12 lg:py-16">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-center lg:justify-end">
              <img
                src={logoLight}
                alt="Elkawther | الكوثر"
                className="h-16 sm:h-20 md:h-24 w-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
              />
            </div>

            <div className="relative rounded-3xl border border-white/15 bg-white/5 p-4 sm:p-6 lg:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur">
              <div className="pointer-events-none absolute -top-10 left-6 h-24 w-24 rounded-full bg-[#c69a5d]/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 right-6 h-24 w-24 rounded-full bg-[#7c1a2b]/30 blur-3xl" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                {productCollection.map((product) => (
                  <div
                    key={product.alt}
                    className="rounded-2xl bg-white/95 px-3 py-4 shadow-lg ring-1 ring-white/60 flex items-center justify-center"
                  >
                    <img
                      src={product.src}
                      alt={product.alt}
                      className="h-20 sm:h-24 md:h-28 w-auto object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
