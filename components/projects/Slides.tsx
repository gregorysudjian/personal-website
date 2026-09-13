"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { t, type Locale, type Text } from "@/lib/i18n";
import Shot from "./Shot";

type Slide = {
  src: Text; // can differ per language
  mobile?: Text; // phone-width capture used on phones
  label: Text;
  caption: Text;
  alt: Text;
  fit?: "cover" | "contain"; // still screens are shown whole ("contain") unless set to "cover"
  scroll?: boolean; // a tall full-page screenshot that scrolls down while it's showing
  duration?: number; // minimum ms this slide stays up
  speed?: number; // scroll slides: px per second (default SCROLL_SPEED)
};

const STEP_MS = 4200;
const SCROLL_MS = 8000;
const SCROLL_SPEED = 220; // px per second: slow enough to read along
const SCROLL_PAUSE = 700; // ms before the glide starts; it also rests at the bottom for as long

/**
 * Steps through a few real screens of a project. Auto-advances while on screen
 * (never with reduced motion); the step tabs can be clicked at any time.
 * A "scroll" slide glides from the top of its page to the bottom while it shows,
 * at a steady reading speed, so a longer page simply stays up longer.
 */
export default function Slides({ slides, locale }: { slides: Slide[]; locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const shots = useRef<(HTMLImageElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [distance, setDistance] = useState(0);
  const current = slides[active];
  const glide = Math.round((distance / (current.speed ?? SCROLL_SPEED)) * 1000);
  const duration = current.scroll
    ? Math.max(current.duration ?? SCROLL_MS, glide + 2 * SCROLL_PAUSE)
    : (current.duration ?? STEP_MS);

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
  // Re-measured when the image loads (or swaps between the phone and laptop version) and on resize.
  useLayoutEffect(() => {
    const img = shots.current[active];
    if (!current.scroll || !img || !view.current) return setDistance(0);
    const measure = () => setDistance(Math.max(0, img.offsetHeight - view.current!.clientHeight));
    if (img.complete) measure();
    img.addEventListener("load", measure);
    window.addEventListener("resize", measure);
    return () => {
      img.removeEventListener("load", measure);
      window.removeEventListener("resize", measure);
    };
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
                <Shot
                  ref={(el) => {
                    shots.current[i] = el;
                  }}
                  src={t(slide.src, locale)}
                  mobile={slide.mobile && t(slide.mobile, locale)}
                  alt={t(slide.alt, locale)}
                  className="absolute inset-x-0 top-0 w-full will-change-transform"
                  style={{
                    transform: `translateY(${on && playing ? -distance : 0}px)`,
                    transition:
                      on && playing
                        ? `transform ${glide}ms cubic-bezier(0.4, 0.1, 0.6, 0.9) ${SCROLL_PAUSE}ms`
                        : "transform 0.6s ease",
                  }}
                />
              ) : (
                <Shot
                  src={t(slide.src, locale)}
                  mobile={slide.mobile && t(slide.mobile, locale)}
                  alt={t(slide.alt, locale)}
                  className={`absolute inset-0 h-full w-full object-top ${slide.fit === "cover" ? "object-cover" : "object-contain"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* steps + caption */}
      <div className="shrink-0 border-t border-line bg-ink px-4 pb-3.5 md:px-5">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${slides.length}, minmax(0, 1fr))` }}>
          {slides.map((slide, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className="group pb-1.5 pt-3 text-left"
            >
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
        {/* two lines reserved so the screen above doesn't jump between short and long captions */}
        <p className="mt-1 line-clamp-2 min-h-[2lh] text-[12.5px] leading-snug text-paper/75" aria-live="polite">
          {t(current.caption, locale)}
        </p>
      </div>
    </div>
  );
}
