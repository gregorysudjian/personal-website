"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { t, type Locale } from "@/lib/i18n";
import { focus } from "@/content/site";
import CircuitTrace from "../CircuitTrace";
import SectionHeader from "../SectionHeader";
import { CodeWindow, MathPlot, NeuralNet } from "./Illustrations";

const ART = { software: CodeWindow, ai: NeuralNet, math: MathPlot } as const;
// Keep in sync with the focus rules in globals.css. Smaller windows (and portrait tablets, where the
// panels would be too narrow for their drawings) get the stacked list.
const HORIZONTAL = [
  "(min-width: 1000px) and (min-height: 700px)",
  "(min-width: 1200px) and (min-height: 580px)",
]
  .map((size) => `${size} and (prefers-reduced-motion: no-preference)`)
  .join(", ");

/**
 * The page pins and the three focus panels slide past sideways (desktop).
 * The sticky frame + transformed track keeps it smooth; the section's height is set
 * to exactly the horizontal distance so the scroll feels 1:1.
 * On phones, small windows and with reduced motion the panels simply stack.
 */
export default function Focus({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const n = focus.items.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(HORIZONTAL, () => {
        const section = root.current!;
        const panels = gsap.utils.toArray<HTMLElement>(".focus-panel", section);
        const distance = () => Math.max(0, track.current!.scrollWidth - frame.current!.clientWidth);
        const size = () => {
          // Normal sizes unless a panel's text would reach its bottom edge; then the compact sizes (see globals.css).
          section.classList.remove("focus-compact");
          const tooTight = panels.some((p) => {
            const last = p.querySelector(".focus-body")?.lastElementChild;
            return last ? p.getBoundingClientRect().bottom - last.getBoundingClientRect().bottom < 16 : false;
          });
          section.classList.toggle("focus-compact", tooTight);
          section.style.height = `${distance() + window.innerHeight}px`;
        };
        size();
        ScrollTrigger.addEventListener("refreshInit", size);

        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set(bar.current, { scaleX: self.progress });
              // The track travels n-1 panel widths: show the panel that's most in view.
              const i = Math.round(self.progress * (n - 1)) + 1;
              if (count.current) count.current.textContent = String(i).padStart(2, "0");
            },
          },
        });

        // Each panel's art drifts slightly against the motion, for depth.
        panels.forEach((panel) => {
          gsap.fromTo(
            panel.querySelector(".focus-art"),
            { xPercent: 12 },
            {
              xPercent: -12,
              ease: "none",
              scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });

        // (no ScrollTrigger.refresh() here: matchMedia already refreshes when this layout switches on,
        // and a nested refresh sent the page back to the top when a resize crossed the threshold)
        return () => {
          ScrollTrigger.removeEventListener("refreshInit", size);
          section.style.height = "";
          section.classList.remove("focus-compact");
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="focus" aria-labelledby="focus-title" className="focus relative">
      <CircuitTrace route="rail" padsAt="[data-pad]" />

      <div ref={frame} className="focus-frame py-28">
        <div className="gutter flex items-end justify-between gap-10">
          <SectionHeader id="focus-title" label={t(focus.label, locale)} heading={t(focus.heading, locale)} />
          <div className="focus-meter hidden shrink-0 items-center gap-4 pb-3" aria-hidden="true">
            <span className="label-mono text-paper">
              <span ref={count}>01</span>
              <span className="text-mute"> / {String(n).padStart(2, "0")}</span>
            </span>
            <span className="relative h-px w-28 bg-line">
              <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-copper" />
            </span>
          </div>
        </div>

        <div ref={track} className="focus-track gutter mt-14 flex flex-col gap-6 md:mt-12 md:gap-8">
          {focus.items.map((item, i) => {
            const Art = ART[item.id as keyof typeof ART];
            return (
              <article
                key={item.id}
                aria-labelledby={`focus-${item.id}`}
                data-reveal
                className="focus-panel group grid overflow-hidden rounded-[6px] border border-line bg-graphite transition-colors duration-500 hover:border-trace md:grid-cols-2 lg:max-w-[1100px]"
              >
                {/* square on phones, but never taller than most of a sideways phone's screen */}
                <div className="relative aspect-square overflow-hidden border-b border-line max-md:max-h-[60svh] max-md:w-full md:aspect-auto md:border-b-0 md:border-r">
                  <div className="bg-grid absolute inset-0 opacity-30" />
                  <div className="focus-art absolute inset-0 flex items-center justify-center p-4 md:p-10">
                    <Art />
                  </div>
                </div>
                <div className="focus-body flex flex-col justify-between gap-10 p-8 md:p-12">
                  <div className="flex items-center justify-between">
                    <span className="label-mono text-copper" aria-hidden="true">
                      0{i + 1}
                    </span>
                    <span className="h-2 w-2 bg-line transition-colors duration-500 group-hover:bg-copper" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 id={`focus-${item.id}`} className="text-[clamp(2.6rem,5vw,5.2rem)] font-medium leading-none tracking-[-0.045em] text-paper">
                      {t(item.title, locale)}
                    </h3>
                    <p className="mt-6 max-w-[38ch] text-lg leading-relaxed text-paper/70">{t(item.text, locale)}</p>
                  </div>
                  {/* lines only break between keywords */}
                  <p className="label-mono leading-[1.7] text-mute">
                    {t(item.keywords, locale)
                      .split(" · ")
                      .map((k, j, all) => (
                        <span key={k}>
                          <span className="whitespace-nowrap">
                            {k}
                            {j < all.length - 1 ? " ·" : ""}
                          </span>
                          {j < all.length - 1 ? " " : ""}
                        </span>
                      ))}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
