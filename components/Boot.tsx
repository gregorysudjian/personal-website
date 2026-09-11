"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { lockScroll, markIntroReady, unlockScroll } from "@/lib/scroll";
import { person, ui } from "@/content/site";
import { t, type Locale } from "@/lib/i18n";

export const BOOT_KEY = "gs-booted";

/** First-visit boot sequence: a counter powers up, then the screen splits open. */
export default function Boot({ locale }: { locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const status = useRef<HTMLSpanElement>(null);
  const lines = ui.boot.map((line) => t(line, locale));

  useGSAP(
    () => {
      const html = document.documentElement;
      if (html.classList.contains("booted")) {
        markIntroReady();
        return;
      }

      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      lockScroll();

      const power = { value: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem(BOOT_KEY, "1");
          } catch {}
          html.classList.add("booted");
          unlockScroll();
        },
      });

      tl.to(
          power,
          {
            value: 100,
            duration: 1.7,
            ease: "power3.inOut",
            onUpdate: () => {
              const v = Math.round(power.value);
              if (counter.current) counter.current.textContent = String(v).padStart(3, "0");
              if (status.current) {
                status.current.textContent = lines[Math.min(lines.length - 1, Math.floor((v / 100) * lines.length))];
              }
            },
          },
          0.1,
        )
        .to(".boot-bar", { scaleX: 1, duration: 1.7, ease: "power3.inOut" }, 0.1)
        .to(".boot-chrome, .boot-readout", { autoAlpha: 0, duration: 0.35, ease: "power2.in" }, "+=0.15")
        .to(".boot-bar", { scaleY: 3, duration: 0.25, ease: "power2.in" }, "<")
        .addLabel("split")
        .add(() => markIntroReady(), "split+=0.35")
        .to(".boot-half--top", { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "split")
        .to(".boot-half--bottom", { yPercent: 100, duration: 1.1, ease: "expo.inOut" }, "split")
        .to(".boot-bar", { autoAlpha: 0, duration: 0.4 }, "split+=0.1");
    },
    { scope: root },
  );

  return (
    <div ref={root} className="boot fixed inset-0 z-[90]" aria-hidden="true">
      <div className="boot-half--top absolute inset-x-0 top-0 h-1/2 bg-ink" />
      <div className="boot-half--bottom absolute inset-x-0 bottom-0 h-1/2 bg-ink" />

      <div className="boot-bar absolute inset-x-0 top-1/2 h-px origin-left scale-x-0 bg-copper shadow-[0_0_18px_2px_rgb(232_130_58/0.6)]" />

      <div className="boot-readout absolute inset-x-0 top-1/2 gutter flex -translate-y-full items-end justify-between pb-5">
        <span ref={counter} className="font-mono text-5xl tabular-nums tracking-tight text-paper md:text-7xl">
          000
        </span>
        <span ref={status} className="label-mono pb-2 text-mute">
          {lines[0]}
        </span>
      </div>

      <div className="boot-chrome label-mono absolute left-[var(--gutter)] top-7 text-paper">{person.name}</div>
      <div className="boot-chrome label-mono absolute right-[var(--gutter)] top-7 text-mute">
        {locale === "fr" ? "Montréal" : "Montreal"}
      </div>
      <div className="boot-chrome label-mono absolute bottom-7 left-[var(--gutter)] text-mute">{person.coordinates}</div>
      <div className="boot-chrome label-mono absolute bottom-7 right-[var(--gutter)] text-mute">SYS/26</div>
    </div>
  );
}
