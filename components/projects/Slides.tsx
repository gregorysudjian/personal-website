"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { t, type Locale, type Text } from "@/lib/i18n";

type Slide = {
  src: Text; // can differ per language
  label: Text;
  caption: Text;
  alt: Text;
  fit?: "cover" | "contain";
  scroll?: boolean; // a tall full-page screenshot that scrolls down while it's showing
  duration?: number; // ms this slide stays up
};

const STEP_MS = 4200;
const SCROLL_MS = 10000;

/**
 * Steps through a few real screens of a project. Auto-advances while on screen
 * (never with reduced motion); the step tabs can be clicked at any time.
 * A "scroll" slide glides from the top of its page to the bottom while it shows.
 */
export default function Slides({ slides, locale }: { slides: Slide[]; locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const shots = useRef<(HTMLImageElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [distance, setDistance] = useState(0);
  const current = slides[active];
  const duration = current.duration ?? (current.scroll ? SCROLL_MS : STEP_MS);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const io = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), { threshold: 0.35 });
    io.observe(root.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setActive((i) => (i + 1) % slides.length), duration);
    return () => clearTimeout(id);
  }, [playing, active, duration, slides.length]);

  // How far the active scroll slide has to travel to reach the bottom of its page.
  useLayoutEffect(() => {
    const img = shots.current[active];
    if (!current.scroll || !img || !view.current) return setDistance(0);
    const measure = () => setDistance(Math.max(0, img.offsetHeight - view.current!.clientHeight));
    if (img.complete) measure();
    else img.addEventListener("load", measure, { once: true });
  }, [active, current.scroll]);

  return (
    <div ref={root} className="absolute inset-0 flex flex-col">
      {/* the screens */}
      <div ref={view} className="relative flex-1 overflow-hidden bg-white">
        {slides.map((slide, i) => {
          const on = i === active;
          return (
            <div key={i} className={`slide absolute inset-0 overflow-hidden ${on ? "is-active" : ""}`} aria-hidden={!on}>
              {slide.scroll ? (
                // eslint-disable-next-line @next/next/no-img-element -- tall screenshot needs its natural height
                <img
                  ref={(el) => {
                    shots.current[i] = el;
                  }}
                  src={t(slide.src, locale)}
                  alt={t(slide.alt, locale)}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-x-0 top-0 w-full will-change-transform"
                  style={{
                    transform: `translateY(${on && playing ? -distance : 0}px)`,
                    transition:
                      on && playing
                        ? `transform ${duration - 1600}ms cubic-bezier(0.45, 0, 0.55, 1) 700ms`
                        : "transform 0.6s ease",
                  }}
                />
              ) : (
                <Image
                  src={t(slide.src, locale)}
                  alt={t(slide.alt, locale)}
                  fill
                  sizes="(min-width: 768px) 58vw, 92vw"
                  className={slide.fit === "contain" ? "object-contain" : "object-cover object-top"}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* steps + caption */}
      <div className="shrink-0 border-t border-line bg-ink px-4 pb-3.5 pt-3 md:px-5">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${slides.length}, minmax(0, 1fr))` }}>
          {slides.map((slide, i) => (
            <button key={i} type="button" onClick={() => setActive(i)} aria-pressed={i === active} className="group text-left">
              <span className="relative block h-[2px] overflow-hidden bg-paper/15">
                <span
                  key={i === active ? `on-${active}` : "off"}
                  className={`absolute inset-0 origin-left bg-copper ${
                    i === active ? (playing ? "slide-progress" : "") : i < active ? "" : "scale-x-0"
                  }`}
                  style={i === active ? { animationDuration: `${duration}ms` } : undefined}
                />
              </span>
              <span
                className={`label-mono mt-2 block text-[0.6rem] transition-colors ${
                  i === active ? "text-paper" : "text-paper/45 group-hover:text-paper/80"
                }`}
              >
                0{i + 1} · {t(slide.label, locale)}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-2.5 truncate text-[12.5px] leading-snug text-paper/75" aria-live="polite">
          {t(current.caption, locale)}
        </p>
      </div>
    </div>
  );
}
