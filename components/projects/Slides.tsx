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
const MAX_GLIDE = 12; // s: very tall (phone) captures glide faster rather than hold a slide for 25s

/**
 * Steps through a few real screens of a project. Auto-advances while on screen (never with reduced
 * motion); a mouse over it or keyboard focus inside holds the current slide, and picking a step stops
 * the autoplay for good (the visitor has taken over). A "scroll" slide glides from the top of its page
 * to the bottom while it shows, at a steady reading speed (never longer than MAX_GLIDE).
 */
export default function Slides({ slides, name, locale }: { slides: Slide[]; name: string; locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const shots = useRef<(HTMLImageElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(false); // autoplay at all (never with reduced motion)
  const [playing, setPlaying] = useState(false); // on screen
  const [held, setHeld] = useState(false); // mouse over it or keyboard focus inside: hold the current slide
  const [stopped, setStopped] = useState(false); // the visitor picked a step: no more autoplay
  const [loaded, setLoaded] = useState<boolean[]>(() => slides.map(() => false));
  const [distance, setDistance] = useState(0);
  const [viewH, setViewH] = useState(560);
  const remaining = useRef(0);
  const current = slides[active];
  // Speeds are tuned for a laptop-sized frame; a smaller frame (a phone) glides proportionally slower.
  const scale = Math.min(1, Math.max(0.5, viewH / 560));
  const speed = Math.max((current.speed ?? SCROLL_SPEED) * scale, distance / MAX_GLIDE);
  const glide = Math.round((distance / speed) * 1000);
  const duration = current.scroll
    ? Math.max(current.duration ?? SCROLL_MS, glide + 2 * SCROLL_PAUSE)
    : (current.duration ?? STEP_MS);
  const advancing = auto && playing && !held && !stopped;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    setAuto(true);
    const io = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), { threshold: 0.35 });
    io.observe(root.current!);
    return () => io.disconnect();
  }, []);

  // A new slide gets its full time; a hold or scrolling away pauses the countdown instead of restarting it.
  useEffect(() => {
    remaining.current = duration;
  }, [active, duration]);

  useEffect(() => {
    if (!advancing) return;
    const started = performance.now();
    const id = setTimeout(() => setActive((i) => (i + 1) % slides.length), remaining.current);
    return () => {
      clearTimeout(id);
      remaining.current = Math.max(0, remaining.current - (performance.now() - started));
    };
  }, [advancing, active, duration, slides.length]);

  // How far the active scroll slide has to travel to reach the bottom of its page.
  // Re-measured when the image loads (or swaps between the phone and laptop version) and on resize.
  useLayoutEffect(() => {
    const img = shots.current[active];
    if (!current.scroll || !img || !view.current) return setDistance(0);
    const measure = () => {
      setViewH(view.current!.clientHeight);
      setDistance(Math.max(0, img.offsetHeight - view.current!.clientHeight));
    };
    if (img.complete) measure();
    img.addEventListener("load", measure);
    window.addEventListener("resize", measure);
    return () => {
      img.removeEventListener("load", measure);
      window.removeEventListener("resize", measure);
    };
  }, [active, current.scroll]);

  const markLoaded = (i: number) => () => setLoaded((l) => (l[i] ? l : l.map((v, k) => (k === i ? true : v))));

  return (
    <div
      ref={root}
      className="absolute inset-0 flex flex-col"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHeld(false)}
      onFocus={(e) => e.target.matches(":focus-visible") && setHeld(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setHeld(false)}
    >
      {/* the screens: a dark ground until each capture has loaded, then white behind "contain" stills */}
      <div ref={view} className="relative flex-1 overflow-hidden bg-graphite">
        {slides.map((slide, i) => {
          const on = i === active;
          const gliding = on && playing && auto;
          // Without motion a tall page can't glide, so it scrolls by hand instead.
          const manual = slide.scroll && !auto;
          return (
            <div
              key={i}
              className={`slide absolute inset-0 ${manual ? "overflow-y-auto overscroll-contain" : "overflow-hidden"} ${on ? "is-active" : ""} ${loaded[i] ? "bg-white" : ""}`}
              aria-hidden={!on}
              {...(manual && on ? { tabIndex: 0, role: "region", "aria-label": t(slide.alt, locale) } : {})}
            >
              {slide.scroll ? (
                <Shot
                  ref={(el) => {
                    shots.current[i] = el;
                  }}
                  src={t(slide.src, locale)}
                  mobile={slide.mobile && t(slide.mobile, locale)}
                  alt={t(slide.alt, locale)}
                  onLoad={markLoaded(i)}
                  className={`${manual ? "relative" : "absolute inset-x-0 top-0"} w-full will-change-transform`}
                  style={{
                    transform: `translateY(${gliding ? -distance : 0}px)`,
                    // an outgoing slide keeps its place until it has faded out, then rewinds unseen
                    transition: gliding
                      ? `transform ${glide}ms cubic-bezier(0.4, 0.1, 0.6, 0.9) ${SCROLL_PAUSE}ms`
                      : "transform 0s linear 0.8s",
                  }}
                />
              ) : (
                <Shot
                  src={t(slide.src, locale)}
                  mobile={slide.mobile && t(slide.mobile, locale)}
                  alt={t(slide.alt, locale)}
                  onLoad={markLoaded(i)}
                  className={`absolute inset-0 h-full w-full object-top ${slide.fit === "cover" ? "object-cover" : "object-contain"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* steps + caption */}
      <div className="shrink-0 border-t border-line bg-ink px-4 pb-3.5 md:px-5">
        <div
          role="group"
          aria-label={name}
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${slides.length}, minmax(0, 1fr))` }}
        >
          {slides.map((slide, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setActive(i);
                setStopped(true);
              }}
              aria-pressed={i === active}
              className="group relative pb-1.5 pt-3 text-left before:absolute before:inset-x-0 before:-inset-y-1.5 before:content-['']"
            >
              {/* only the current step is copper; steps already shown stay as a faint trail */}
              <span className="relative block h-[2px] overflow-hidden bg-paper/15">
                <span
                  key={i === active ? `on-${active}` : "off"}
                  className={`absolute inset-0 origin-left ${
                    i === active ? `bg-copper ${advancing || (auto && !stopped) ? "slide-progress" : ""}` : i < active ? "bg-paper/30" : "scale-x-0 bg-copper"
                  }`}
                  style={
                    i === active
                      ? { animationDuration: `${duration}ms`, animationPlayState: advancing ? "running" : "paused" }
                      : undefined
                  }
                />
              </span>
              <span
                className={`label-mono mt-2 block truncate whitespace-nowrap text-[0.6rem] transition-colors max-sm:text-[0.66rem] max-sm:tracking-[0.08em] ${
                  i === active ? "text-paper" : "text-paper/55 group-hover:text-paper/80"
                }`}
              >
                <span className="max-sm:hidden">0{i + 1} · </span>
                {t(slide.label, locale)}
              </span>
            </button>
          ))}
        </div>
        {/* room for three lines on phones and two above, so the screen above doesn't jump between captions;
            announced only when the visitor changes the slide, not on every automatic step */}
        <p className="mt-1 min-h-[3lh] text-[12.5px] leading-snug text-paper/75 md:min-h-[2lh]" aria-live={advancing ? "off" : "polite"}>
          {t(current.caption, locale)}
        </p>
      </div>
    </div>
  );
}
