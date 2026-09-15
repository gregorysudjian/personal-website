"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, FULL_MOTION, FINE_POINTER, REDUCED_MOTION } from "@/lib/gsap";
import { introReady, scrollToTarget } from "@/lib/scroll";
import { t, type Locale } from "@/lib/i18n";
import { hero, person } from "@/content/site";
import CircuitTrace from "../CircuitTrace";
import HeroCircuit from "./HeroCircuit";

/**
 * Opening scene. Four depth layers (glow, grid floor, circuit, name) sit in a sticky
 * frame. Scrolling flies you through the name: its letters part like a gate while the
 * layers behind rush past at their own speeds, and the copper signal starts below.
 * Each layer is nested scroll-wrapper > mouse-wrapper > content so the scroll
 * timeline, the cursor parallax and the intro never fight over the same transform.
 */
export default function Hero({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const circuit = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const q = gsap.utils.selector(root);
      const reduce = window.matchMedia(REDUCED_MOTION).matches;
      const lines = q(".hero-name-line") as HTMLElement[];
      let cancelled = false;

      // Split the name once; the intro raises the letters, the scroll parts them.
      const splits = reduce ? [] : lines.map((line) => SplitText.create(line, { type: "chars" }));
      const allChars = splits.flatMap((s) => s.chars);
      if (allChars.length) gsap.set(allChars, { yPercent: 118 });

      /* ---------- intro (after the boot sequence) ---------- */
      const play = contextSafe!(() => {
        const reveal = () => gsap.set(q("[data-intro]"), { visibility: "visible" });
        if (reduce) return reveal();

        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          // Letters can now fly past their line's edges when the gate opens.
          onComplete: () => gsap.set(lines, { overflow: "visible" }),
        });

        tl.from(q(".hero-glow"), { autoAlpha: 0, scale: 0.5, duration: 2.6 }, 0)
          .from(q(".hero-floor"), { autoAlpha: 0, yPercent: 14, duration: 2.4 }, 0)
          .fromTo(
            q(".hero-trace"),
            { strokeDasharray: 1000, strokeDashoffset: 1000 },
            { strokeDashoffset: 0, duration: 2.4, ease: "power2.inOut", stagger: { each: 0.06, from: "random" } },
            0.1,
          )
          .from(q(".hero-pad"), { scale: 0, transformOrigin: "50% 50%", duration: 0.9, stagger: { each: 0.05, from: "random" } }, 1)
          .to(allChars, { yPercent: 0, duration: 1.6, stagger: 0.045 }, 0.15)
          .from(q(".hero-hud"), { autoAlpha: 0, y: 18, duration: 1.3, stagger: 0.08 }, 0.9);

        reveal();
      });

      Promise.all([introReady, document.fonts.ready]).then(() => {
        if (!cancelled) play();
      });

      /* ---------- scroll + cursor ---------- */
      const mm = gsap.matchMedia();
      mm.add({ full: FULL_MOTION, fine: FINE_POINTER, small: "(max-width: 767px)" }, (ctx) => {
        const { full, fine, small } = ctx.conditions as Record<string, boolean>;
        if (!full) return;

        const s = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: fine ? true : 0.4,
            invalidateOnRefresh: true,
          },
        });

        // The gate: letters spread out from the centre of each line, lines split apart.
        splits.forEach((split, li) => {
          const n = split.chars.length;
          s.to(
            split.chars,
            {
              x: (i: number) => ((i - (n - 1) / 2) / ((n - 1) / 2)) * window.innerWidth * (small ? 0.42 : 0.5),
              ease: "power2.in",
              duration: 0.75,
            },
            0,
          );
          s.to(lines[li], { yPercent: li === 0 ? -55 : 55, ease: "power2.in", duration: 0.75 }, 0);
        });

        s.to(q(".hero-hud-scroll, .hero-eyebrow"), { autoAlpha: 0, y: -28, duration: 0.15 }, 0)
          .to(q(".hero-name-scroll"), { scale: small ? 1.35 : 1.55, ease: "power2.in", duration: 0.75 }, 0)
          .to(q(".hero-name-scroll"), { autoAlpha: 0, duration: 0.32 }, 0.4)
          .to(q(".hero-circuit-scroll"), { scale: small ? 1.45 : 1.7, duration: 1 }, 0)
          .to(q(".hero-circuit-scroll"), { autoAlpha: 0, duration: 0.35 }, 0.5)
          .to(q(".hero-floor-scroll"), { scale: 1.25, duration: 1 }, 0)
          .to(q(".hero-floor-scroll"), { autoAlpha: 0, duration: 0.3 }, 0.55)
          .to(q(".hero-glow-scroll"), { scale: 1.6, duration: 1 }, 0)
          .to(q(".hero-glow-scroll"), { autoAlpha: 0, duration: 0.3 }, 0.6)
          .to(q(".hero-fade"), { autoAlpha: 1, duration: 0.15 }, 0.85);

        if (!fine) return;

        const layers: [string, number][] = [
          [".hero-glow-mouse", 14],
          [".hero-floor-mouse", 10],
          [".hero-circuit-mouse", 22],
          [".hero-name-mouse", 38],
        ];
        const movers = layers.map(([sel, amount]) => ({
          amount,
          x: gsap.quickTo(q(sel), "x", { duration: 1.4, ease: "power3" }),
          y: gsap.quickTo(q(sel), "y", { duration: 1.4, ease: "power3" }),
        }));
        const onMove = (e: PointerEvent) => {
          const nx = (e.clientX / window.innerWidth) * 2 - 1;
          const ny = (e.clientY / window.innerHeight) * 2 - 1;
          for (const m of movers) {
            m.x(-nx * m.amount);
            m.y(-ny * m.amount * 0.6);
          }
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      });

      /* ---------- pause the circuit pulses once the hero is off screen ---------- */
      const io = new IntersectionObserver(([entry]) => {
        circuit.current?.toggleAttribute("data-paused", !entry.isIntersecting);
      });
      io.observe(root.current!);

      return () => {
        cancelled = true;
        io.disconnect();
        mm.revert();
        splits.forEach((s) => s.revert());
      };
    },
    { scope: root },
  );

  const toProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToTarget("#projects");
  };

  return (
    <section ref={root} id="top" className="relative h-[170vh] md:h-[190vh]">
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        {/* Layer 0 — horizon glow */}
        <div className="hero-glow-scroll pointer-events-none absolute inset-x-0 top-[58%] flex -translate-y-1/2 justify-center">
          <div className="hero-glow-mouse">
            <div
              data-intro
              className="hero-glow h-[55vh] w-[110vw] max-w-[1500px] rounded-[50%] bg-[radial-gradient(closest-side,rgb(232_130_58/0.2),rgb(232_130_58/0.06)_55%,transparent)]"
            />
          </div>
        </div>

        {/* Layer 1 — perspective grid floor, vanishing at the horizon (58%) */}
        <div className="hero-floor-scroll pointer-events-none absolute inset-0 origin-[50%_58%]">
          <div className="hero-floor-mouse absolute inset-0">
            <div
              data-intro
              className="hero-floor absolute inset-0 [perspective:640px] [perspective-origin:50%_58%] [mask-image:linear-gradient(to_bottom,transparent_58%,rgb(0_0_0/0.6)_72%,rgb(0_0_0/0.3)_100%)]"
            >
              <div className="bg-grid absolute -left-[80%] -right-[80%] top-[58%] h-[600px] origin-top [transform:rotateX(78deg)]" />
            </div>
          </div>
        </div>

        {/* Layer 2 — circuit traces */}
        <div ref={circuit} className="hero-circuit-scroll pointer-events-none absolute inset-0">
          <div className="hero-circuit-mouse absolute inset-[-3%]">
            <div data-intro className="hero-circuit-mask absolute inset-0 opacity-75">
              <HeroCircuit />
            </div>
          </div>
        </div>

        {/* Layer 3 — the name, with one quiet line above it.
            Short screens: it fills the space above the bottom row so the two never overlap. */}
        <div className="hero-name-scroll relative flex min-h-0 flex-1 items-center pt-16 md:pt-20 roomy:absolute roomy:inset-0 roomy:pt-0!">
          <div className="hero-name-mouse gutter w-full">
            {/* wrapper fades on scroll; inner line is revealed by the intro (never both on one element) */}
            <div className="hero-eyebrow mb-6 md:mb-9 short:mb-3!">
              <p data-intro className="hero-hud label-mono flex items-center gap-3 leading-[1.6] text-mute">
                <span className="h-px w-8 shrink-0 bg-copper" aria-hidden="true" />
                <span className="text-balance">{t(hero.eyebrow, locale)}</span>
              </p>
            </div>
            <h1
              data-intro
              aria-label={person.name}
              className="hero-name relative font-semibold uppercase leading-[0.8] tracking-[-0.045em] text-paper [font-kerning:none] text-[clamp(3.4rem,min(18vw,15svh),17.5rem)] md:text-[clamp(3.4rem,16.4vw,17.5rem)] short:text-[clamp(3.4rem,min(16.4vw,26svh),17.5rem)]!"
            >
              <span aria-hidden="true" className="hero-name-line block overflow-hidden pb-[0.03em]">
                {person.firstName}
              </span>
              <span aria-hidden="true" className="hero-name-line block overflow-hidden pb-[0.03em] text-right">
                {person.lastName}
              </span>
            </h1>
          </div>
        </div>

        {/* Layer 4 — bottom row: who, what next, status */}
        <div className="hero-hud-scroll gutter pointer-events-none relative pb-8 md:pb-10 roomy:absolute roomy:inset-x-0 roomy:bottom-0">
          <div className="grid items-end gap-6 md:grid-cols-[1fr_auto_1fr] short:grid-cols-[auto_1fr]!">
            <div data-intro className="hero-hud pointer-events-auto">
              <p className="max-w-[36ch] text-base leading-relaxed text-paper/80 md:text-lg short:hidden">
                {t(hero.tagline, locale)}
              </p>
              <div className="mt-5 flex flex-wrap gap-3 short:mt-0!">
                <a href="#projects" onClick={toProjects} className="btn btn-primary btn-sm">
                  {t(hero.ctaProjects, locale)} <span aria-hidden="true">↓</span>
                </a>
                <a href={person.cv} download className="btn btn-sm">
                  {t(hero.ctaCv, locale)}
                </a>
              </div>
            </div>
            <div data-intro className="hero-hud hidden flex-col items-center gap-3 md:flex short:hidden!" aria-hidden="true">
              <span className="label-mono text-mute">{t(hero.scrollHint, locale)}</span>
              <span className="hint-wire" />
            </div>
            <p data-intro className="hero-hud label-mono flex items-center gap-3 text-paper/80 md:justify-end md:pb-3 short:justify-end! short:pb-3!">
              <span className="status-dot" aria-hidden="true" />
              {t(hero.status, locale)}
            </p>
          </div>
        </div>

        {/* Hand-off to the next chapter */}
        <div className="hero-fade pointer-events-none invisible absolute inset-0 bg-ink opacity-0" />
      </div>

      {/* The copper signal starts here and runs through the whole page */}
      <CircuitTrace route="hero" className="z-10" />
    </section>
  );
}
