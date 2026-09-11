"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { t, type Locale } from "@/lib/i18n";
import { projects, type Project } from "@/content/site";
import ChatPreview from "./ChatPreview";
import LeadsPreview from "./LeadsPreview";

const TILT = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const L = projects.labels;

export default function ProjectCard({ project, index, locale }: { project: Project; index: number; locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const specs = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const specsId = useId();
  const flip = index % 2 === 1;
  const hasSpecs = Boolean(project.problem || project.solution || project.how);

  // Tilt the preview window toward the cursor.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(TILT, () => {
        const f = frame.current!;
        const host = f.parentElement!;
        gsap.set(f, { transformPerspective: 1400 });
        const rx = gsap.quickTo(f, "rotationX", { duration: 1, ease: "power3" });
        const ry = gsap.quickTo(f, "rotationY", { duration: 1, ease: "power3" });
        const move = (e: PointerEvent) => {
          const r = host.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 7);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 6);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        host.addEventListener("pointermove", move);
        host.addEventListener("pointerleave", leave);
        return () => {
          host.removeEventListener("pointermove", move);
          host.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: root },
  );

  const toggle = () => {
    const el = specs.current!;
    const next = !open;
    setOpen(next);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(el, { height: next ? "auto" : 0, duration: reduce ? 0 : 0.8, ease: "expo.inOut" });
    gsap.fromTo(
      el.querySelectorAll(".spec"),
      { autoAlpha: next ? 0 : 1, y: next ? 12 : 0 },
      { autoAlpha: next ? 1 : 0, y: 0, duration: reduce ? 0 : 0.6, stagger: 0.06, delay: next ? 0.15 : 0 },
    );
  };

  return (
    <article ref={root} className="project grid items-center gap-10 md:grid-cols-12 md:gap-12">
      {/* preview window */}
      <div className={`md:col-span-7 ${flip ? "md:order-2 md:col-start-6" : ""}`}>
        <div data-reveal="clip" data-cursor={t(project.preview ? L.preview : L.comingSoon, locale)}>
          <div
            ref={frame}
            className="overflow-hidden rounded-[8px] border border-line bg-graphite shadow-[0_50px_120px_-50px_rgb(0_0_0/0.9)] will-change-transform"
          >
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="label-mono ml-3 truncate text-[0.62rem] text-mute">{project.slug}.preview</span>
              {project.preview && (
                <span className="label-mono ml-auto shrink-0 text-[0.58rem] text-copper/80">{t(L.demo, locale)}</span>
              )}
            </div>
            <div className="relative aspect-[16/11] overflow-hidden bg-ink [contain:layout_paint]">
              {project.preview === "chat" && <ChatPreview locale={locale} />}
              {project.preview === "leads" && <LeadsPreview locale={locale} />}
              {!project.preview && project.media?.type === "image" && (
                <Image
                  src={project.media.src}
                  alt={t(project.media.alt, locale)}
                  fill
                  sizes="(min-width: 768px) 58vw, 92vw"
                  className="object-cover"
                />
              )}
              {!project.preview && project.media?.type === "video" && (
                <video
                  src={project.media.src}
                  aria-label={t(project.media.alt, locale)}
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                />
              )}
              {!project.preview && !project.media && <ComingSoon label={t(L.comingSoon, locale)} />}
            </div>
          </div>
        </div>
      </div>

      {/* details */}
      <div className={`md:col-span-5 ${flip ? "md:order-1 md:col-start-1" : ""}`}>
        <div data-reveal="stagger">
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm text-mute">0{index + 1}</span>
            <span
              className={`label-mono flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.62rem] ${
                project.status === "live" ? "border-paper/30 text-paper" : "border-copper/40 text-copper"
              }`}
            >
              <span className="status-dot" aria-hidden="true" />
              {t(L[project.status], locale)}
            </span>
          </div>

          <h3 className="mt-6 text-[clamp(2rem,3.4vw,3.3rem)] font-medium leading-[1.02] tracking-[-0.035em] text-paper">
            {t(project.title, locale)}
          </h3>
          <p className="mt-5 text-lg leading-relaxed text-paper/70">{t(project.summary, locale)}</p>

          <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-8 gap-y-4 border-t border-line pt-6">
            <dt className="label-mono pt-1 text-mute">{t(L.year, locale)}</dt>
            <dd className="text-paper">{project.year}</dd>
            <dt className="label-mono pt-1 text-mute">{t(L.role, locale)}</dt>
            <dd className="text-paper">{t(project.role, locale)}</dd>
            <dt className="label-mono pt-1.5 text-mute">{t(L.stack, locale)}</dt>
            <dd className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span key={t(s, locale)} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-paper/80">
                  {t(s, locale)}
                </span>
              ))}
            </dd>
          </dl>

          {hasSpecs && (
            <div className="mt-8 border-y border-line">
              <button
                type="button"
                onClick={toggle}
                aria-expanded={open}
                aria-controls={specsId}
                className="group flex w-full items-center justify-between py-4 text-left"
              >
                <span className="label-mono text-paper transition-colors group-hover:text-copper">{t(L.specs, locale)}</span>
                <span className="relative h-3 w-3" aria-hidden="true">
                  <span className="absolute left-0 top-1/2 h-px w-3 bg-copper" />
                  <span
                    className={`absolute left-1/2 top-0 h-3 w-px bg-copper transition-transform duration-500 ${open ? "scale-y-0" : ""}`}
                  />
                </span>
              </button>
              <div ref={specs} id={specsId} className="h-0 overflow-hidden" inert={!open} aria-hidden={!open}>
                <div className="flex flex-col gap-6 pb-6">
                  {(["problem", "solution", "how"] as const).map((key) =>
                    project[key] ? (
                      <div key={key} className="spec grid gap-2 md:grid-cols-[7.5rem_1fr] md:gap-6">
                        <p className="label-mono pt-1 text-copper">{t(L[key], locale)}</p>
                        <p className="leading-relaxed text-paper/75">{t(project[key]!, locale)}</p>
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-6">
            {project.links.length ? (
              project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline label-mono text-paper"
                >
                  {t(link.label, locale)} ↗
                </a>
              ))
            ) : (
              <span className="label-mono text-mute">{t(L.codeSoon, locale)}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div className="scanline absolute inset-x-0 h-24" />
      <p className="label-mono relative text-mute">{label}</p>
    </div>
  );
}
