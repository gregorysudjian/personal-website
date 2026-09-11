"use client";

import { useRef } from "react";
import { gsap, useGSAP, REDUCED_MOTION } from "@/lib/gsap";
import { playWhenVisible } from "@/lib/visible";
import { t, type Locale } from "@/lib/i18n";
import { projects } from "@/content/site";

const PINS: [number, number][] = [
  [22, 30],
  [64, 22],
  [40, 62],
  [78, 58],
];
const FOCUS = 1; // the lead whose site gets generated

/** Demo: the agent scans a map, logs businesses as leads, then generates a site for one. */
export default function LeadsPreview({ locale }: { locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const L = projects.previews.leads;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (window.matchMedia(REDUCED_MOTION).matches) return;
      const pins = q(".pin");
      const rows = q(".lead-row");
      const blocks = q(".site-block");

      const status = (row: Element, s: number) => {
        row.querySelectorAll<HTMLElement>(".st").forEach((el, k) => (el.style.display = k === s ? "" : "none"));
        row.classList.toggle("is-ready", s === 2);
      };
      const reset = () => {
        rows.forEach((r) => status(r, 0));
        gsap.set(pins, { scale: 0, autoAlpha: 0, transformOrigin: "50% 100%" });
        gsap.set(rows, { autoAlpha: 0, x: -10 });
        gsap.set(blocks, { autoAlpha: 0, y: 8 });
        gsap.set(q(".site-bar"), { scaleX: 0 });
        rows[FOCUS]?.classList.remove("is-focus");
      };
      reset();

      const tl = gsap.timeline({ repeat: -1, paused: true, onRepeat: reset, defaults: { ease: "expo.out" } });
      pins.forEach((pin, i) => {
        tl.to(pin, { scale: 1, autoAlpha: 1, duration: 0.6, ease: "back.out(2)" }, 0.4 + i * 0.55);
        tl.to(rows[i], { autoAlpha: 1, x: 0, duration: 0.6 }, "<0.1");
      });
      tl.add(() => rows.forEach((r) => status(r, 1)), "+=0.5");
      tl.add(() => rows[FOCUS]?.classList.add("is-focus"), "+=0.4");
      tl.to(q(".site-bar"), { scaleX: 1, duration: 2.6, ease: "power1.inOut" }, "<");
      tl.to(blocks, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.32 }, "<0.1");
      tl.add(() => status(rows[FOCUS], 2), ">");
      tl.to({}, { duration: 2.6 });

      return playWhenVisible(root.current!, tl);
    },
    { scope: root },
  );

  const business = t(L.businesses[FOCUS], locale).split(" — ")[0];

  return (
    <div ref={root} className="@container absolute inset-0 flex text-[12px]">
      {/* map + leads */}
      <div className="flex min-w-0 flex-1 flex-col border-line @min-[520px]:border-r">
        <div className="relative flex-[1.1] overflow-hidden border-b border-line">
          <div className="bg-grid absolute inset-0 opacity-50 [background-size:28px_28px]" />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path d="M0 42 L100 30 M0 78 L100 70 M30 0 L38 100 M70 0 L62 100" stroke="var(--color-trace)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="radar absolute left-1/2 top-1/2 h-[180%] w-[180%] -translate-x-1/2 -translate-y-1/2" />
          {PINS.map(([x, y], i) => (
            <span key={i} className="pin absolute -ml-1.5 -mt-3" style={{ left: `${x}%`, top: `${y}%` }}>
              <span className="block h-3 w-3 rounded-full rounded-br-none rotate-45 border border-copper-glow bg-copper" />
            </span>
          ))}
          <p className="label-mono absolute left-3 top-3 flex items-center gap-2 text-[0.58rem] text-paper/80">
            <span className="status-dot" aria-hidden="true" />
            {t(L.scanning, locale)}
          </p>
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="label-mono border-b border-line px-3 py-2 text-[0.58rem] text-mute">{t(L.leads, locale)}</p>
          <ul>
            {L.businesses.map((b, i) => (
              <li key={i} className="lead-row flex items-center gap-3 border-b border-line/60 px-3 py-[0.42rem]">
                <span className="w-6 shrink-0 font-mono text-[11px] text-copper">{L.scores[i]}</span>
                <span className="min-w-0 flex-1 truncate text-paper/85">{t(b, locale)}</span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider">
                  {L.statuses.map((s, k) => (
                    <span key={k} className={`st ${k === 2 ? "text-copper" : k === 1 ? "text-paper/70" : "text-mute"}`} style={k ? { display: "none" } : undefined}>
                      {t(s, locale)}
                      {k === 2 ? " ✓" : ""}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* site being generated */}
      <div className="hidden w-[44%] flex-col @min-[520px]:flex">
        <div className="border-b border-line px-3 py-2.5">
          <p className="label-mono text-[0.58rem] text-mute">{t(L.building, locale)}</p>
          <span className="relative mt-2 block h-px w-full bg-line">
            <span className="site-bar absolute inset-0 origin-left scale-x-0 bg-copper" />
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3">
          <div className="site-block flex items-center justify-between rounded-sm border border-line px-2 py-1.5">
            <span className="h-1.5 w-8 rounded-full bg-paper/60" />
            <span className="flex items-center gap-1 font-mono text-[8px] tracking-wider">
              <span className="rounded-sm bg-paper/80 px-1 text-ink">FR</span>
              <span className="text-mute">EN</span>
            </span>
          </div>
          <div className="site-block rounded-sm border border-copper/30 bg-copper/10 px-3 py-4">
            <p className="text-[15px] font-medium leading-tight tracking-tight text-paper">{business}</p>
            <span className="mt-2 block h-1 w-3/4 rounded-full bg-paper/25" />
            <span className="mt-1 block h-1 w-1/2 rounded-full bg-paper/25" />
            <span className="mt-3 inline-block rounded-full bg-copper px-2 py-0.5 text-[9px] font-medium text-ink">→</span>
          </div>
          <div className="site-block grid flex-1 grid-cols-3 gap-2">
            <span className="rounded-sm border border-line bg-graphite" />
            <span className="rounded-sm border border-line bg-graphite" />
            <span className="rounded-sm border border-line bg-graphite" />
          </div>
          <div className="site-block flex items-center gap-2">
            <span className="h-1 flex-1 rounded-full bg-line" />
            <span className="h-1 w-10 rounded-full bg-line" />
          </div>
        </div>
      </div>
    </div>
  );
}
