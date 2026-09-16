"use client";

import { useEffect, useId, useRef, useState } from "react";
import { gsap, useGSAP, REDUCED_MOTION } from "@/lib/gsap";
import { playWhenVisible } from "@/lib/visible";
import { t, type Locale } from "@/lib/i18n";
import { projects, ui, type Project } from "@/content/site";
import ChatPreview from "./ChatPreview";
import Shot from "./Shot";
import Slides from "./Slides";

const HOVER = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const TOUCH = "(hover: none) and (prefers-reduced-motion: no-preference)";
const L = projects.labels;

export default function ProjectCard({ project, index, locale }: { project: Project; index: number; locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const specs = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // before hydration the panel must not be inert (see globals.css)
  const specsId = useId();
  const titleId = useId();
  const flip = index % 2 === 1;
  const hasSpecs = Boolean(project.problem || project.solution || project.how);
  const media = project.media;

  const cursorLabel = project.preview
    ? t(L.cursorDemo, locale)
    : media?.type === "scroll"
      ? t(L.cursorScroll, locale)
      : media?.type === "slides"
        ? t(L.cursorSlides, locale)
        : t(L.cursorImage, locale);

  useEffect(() => setMounted(true), []);

  useGSAP(
    () => {
      const f = frame.current!;
      const host = f.parentElement!;
      const shot = f.querySelector<HTMLElement>(".scroll-shot");
      const view = shot?.parentElement;
      const distance = () => (shot && view ? Math.max(0, shot.offsetHeight - view.clientHeight) : 0);
      const mm = gsap.matchMedia();

      // Desktop: tilt toward the cursor; a full-page screenshot scrolls while hovered.
      mm.add(HOVER, () => {
        gsap.set(f, { transformPerspective: 1400 });
        const rx = gsap.quickTo(f, "rotationX", { duration: 1, ease: "power3" });
        const ry = gsap.quickTo(f, "rotationY", { duration: 1, ease: "power3" });
        const move = (e: PointerEvent) => {
          const r = host.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 6);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 5);
        };
        const enter = () => {
          if (shot) gsap.to(shot, { y: -distance(), duration: Math.max(2, distance() / 420), ease: "power1.inOut", overwrite: true });
        };
        const leave = () => {
          rx(0);
          ry(0);
          if (shot) gsap.to(shot, { y: 0, duration: 1.2, ease: "power3.out", overwrite: true });
        };
        host.addEventListener("pointermove", move);
        host.addEventListener("pointerenter", enter);
        host.addEventListener("pointerleave", leave);
        return () => {
          host.removeEventListener("pointermove", move);
          host.removeEventListener("pointerenter", enter);
          host.removeEventListener("pointerleave", leave);
        };
      });

      // Touch screens: the screenshot scrolls down and back on its own while visible.
      mm.add(TOUCH, () => {
        if (!shot) return;
        const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1.2, paused: true, delay: 1 });
        tl.to(shot, { y: () => -distance(), duration: () => Math.max(4, distance() / 260), ease: "power1.inOut" });
        return playWhenVisible(f, tl, 0.4);
      });
    },
    { scope: root },
  );

  const toggle = () => {
    const el = specs.current!;
    const next = !open;
    setOpen(next);
    const reduce = window.matchMedia(REDUCED_MOTION).matches;
    gsap.to(el, { height: next ? "auto" : 0, duration: reduce ? 0 : 0.8, ease: "expo.inOut" });
    gsap.fromTo(
      el.querySelectorAll(".spec"),
      { autoAlpha: next ? 0 : 1, y: next ? 12 : 0 },
      { autoAlpha: next ? 1 : 0, y: 0, duration: reduce ? 0 : 0.6, stagger: 0.06, delay: next ? 0.15 : 0 },
    );
  };

  return (
    <article ref={root} aria-labelledby={titleId} className="project grid items-start gap-10 xl:grid-cols-12 xl:gap-12">
      {/* details */}
      {/* The name block comes first in the markup (screen readers hear the project before its screens) and
          second on screen below xl; the preview after it keeps Tab moving forwards through the card. */}
      <div
        className={`max-w-2xl xl:col-span-5 xl:row-start-1 xl:max-w-none ${flip ? "xl:col-start-1" : "xl:col-start-8"}`}
      >
        <div data-reveal="stagger">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`label-mono flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.62rem] max-sm:text-[0.66rem] max-sm:tracking-[0.08em] ${
                project.status === "in-progress" ? "border-copper/40 text-copper" : "border-paper/25 text-paper/85"
              }`}
            >
              <span className="status-dot" aria-hidden="true" />
              {t(L[project.status], locale)}
            </span>
            <span className="label-mono text-mute">{project.year}</span>
          </div>

          <p className="label-mono mt-7 text-copper/90">{t(project.kicker, locale)}</p>
          <h3 id={titleId} className="mt-3 text-[clamp(2rem,3.4vw,3.3rem)] font-medium leading-[1.02] tracking-[-0.035em] text-paper">
            {t(project.title, locale)}
          </h3>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-paper/70">{t(project.summary, locale)}</p>

        </div>
      </div>

      {/* preview window (stays in view while the details scroll past); stacked full width above the text
          below 1280px so tablets get a big, readable preview, but never taller than ~3/4 of the screen.
          It comes after the details in the markup (name first for screen readers) and is placed first by CSS. */}
      <div
        className={`order-first md:max-xl:max-w-[calc(75svh*16/11)] xl:sticky xl:top-28 xl:order-none xl:col-span-7 xl:row-span-2 xl:row-start-1 ${flip ? "xl:col-start-6" : "xl:col-start-1"}`}
      >
        <div data-reveal="clip" data-cursor={cursorLabel}>
          <div
            ref={frame}
            className="overflow-hidden rounded-[6px] border border-line bg-graphite shadow-[0_50px_120px_-50px_rgb(0_0_0/0.9)] will-change-transform"
          >
            {/* the window dots give way on phones so the name and badge both fit */}
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span className="hidden h-2.5 w-2.5 rounded-full bg-line sm:block" />
              <span className="hidden h-2.5 w-2.5 rounded-full bg-line sm:block" />
              <span className="hidden h-2.5 w-2.5 rounded-full bg-line sm:block" />
              <span className="label-mono truncate text-[0.62rem] text-mute max-sm:text-[0.66rem] max-sm:tracking-[0.08em] sm:ml-3" aria-hidden="true">
                {project.slug}
              </span>
              {(project.preview || media?.type === "slides") && (
                <span className="label-mono ml-auto shrink-0 text-[0.62rem] text-copper max-sm:text-[0.66rem] max-sm:tracking-[0.08em]">
                  {t(project.preview ? L.demo : L.slidesBadge, locale)}
                </span>
              )}
            </div>
            {/* taller on phones, where a wide frame would leave the screens too small to read; on a phone
                held sideways it's capped to the screen height so the tabs and caption stay in view */}
            <div className="relative aspect-[3/4] overflow-hidden bg-ink [contain:layout_paint] md:aspect-[16/11] short:aspect-auto! short:h-[85svh]">
              {project.preview === "chat" && <ChatPreview locale={locale} />}
              {media?.type === "slides" && <Slides slides={media.slides} name={t(project.title, locale)} locale={locale} />}
              {media?.type === "image" && (
                <Shot
                  src={t(media.src, locale)}
                  mobile={media.mobile && t(media.mobile, locale)}
                  alt={t(media.alt, locale)}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              )}
              {media?.type === "scroll" && (
                // eslint-disable-next-line @next/next/no-img-element -- tall screenshot needs its natural height
                <img
                  src={t(media.src, locale)}
                  alt={t(media.alt, locale)}
                  loading="lazy"
                  decoding="async"
                  className="scroll-shot absolute inset-x-0 top-0 w-full will-change-transform"
                />
              )}
              {media?.type === "video" && (
                <video
                  src={t(media.src, locale)}
                  aria-label={t(media.alt, locale)}
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`max-w-2xl xl:col-span-5 xl:row-start-2 xl:max-w-none ${flip ? "xl:col-start-1" : "xl:col-start-8"}`}
      >
        <div data-reveal="stagger">
          <ul className="mt-7 flex flex-col gap-3">
            {project.highlights.map((h) => (
              <li key={t(h, locale)} className="flex gap-3 leading-relaxed text-paper/85">
                <span className="mt-[0.7em] h-px w-3 shrink-0 bg-copper" aria-hidden="true" />
                {t(h, locale)}
              </li>
            ))}
          </ul>

          {/* one label column shared with the "How it's built" list below */}
          <dl className="mt-8 grid grid-cols-1 gap-y-2 border-t border-line pt-6 sm:grid-cols-[auto_1fr] sm:gap-x-8 sm:gap-y-4 md:grid-cols-[8.5rem_1fr] md:gap-x-6">
            <dt className="label-mono pt-1 text-mute">{t(L.role, locale)}</dt>
            <dd className="text-paper">{t(project.role, locale)}</dd>
            <dt className="label-mono pt-1.5 text-mute max-sm:mt-3">{t(L.stack, locale)}</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <li key={t(s, locale)} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-paper/80">
                    {t(s, locale)}
                  </li>
                ))}
              </ul>
            </dd>
          </dl>

          {hasSpecs && (
            <div className="mt-8 border-y border-line">
              <button
                type="button"
                onClick={toggle}
                aria-expanded={open}
                aria-controls={specsId}
                className="specs-toggle group flex w-full items-center justify-between py-4 text-left"
              >
                <span className="label-mono text-paper transition-colors group-hover:text-copper">{t(L.specs, locale)}</span>
                <span className="relative h-3 w-3" aria-hidden="true">
                  <span className="absolute left-0 top-1/2 h-px w-3 bg-copper" />
                  <span
                    className={`absolute left-1/2 top-0 h-3 w-px bg-copper transition-transform duration-500 ${open ? "scale-y-0" : ""}`}
                  />
                </span>
              </button>
              <div
                ref={specs}
                id={specsId}
                className="specs-panel h-0 overflow-hidden"
                inert={mounted ? !open : undefined}
                aria-hidden={mounted ? !open : undefined}
              >
                <dl className="flex flex-col gap-6 pb-6">
                  {(["problem", "solution", "how"] as const).map((key) =>
                    project[key] ? (
                      <div key={key} className="spec grid gap-2 md:grid-cols-[8.5rem_1fr] md:gap-6">
                        <dt className="label-mono pt-1 text-copper">{t(L[key], locale)}</dt>
                        <dd className="leading-relaxed text-paper/75">{t(project[key]!, locale)}</dd>
                      </div>
                    ) : null,
                  )}
                </dl>
              </div>
            </div>
          )}

          {(project.links.length > 0 || project.privateRepo) && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {project.links.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`btn btn-sm ${i === 0 ? "btn-primary" : ""}`}
                >
                  {t(link.label, locale)} <span aria-hidden="true">↗</span>
                  <span className="sr-only"> {t(ui.newTab, locale)}</span>
                </a>
              ))}
              {project.privateRepo && (
                <span className="label-mono flex items-center gap-2 text-mute">
                  <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <rect x="3" y="7" width="10" height="7" rx="1" />
                    <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
                  </svg>
                  {t(L.privateRepo, locale)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
