"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, FULL_MOTION } from "@/lib/gsap";

/**
 * A big band of words that drifts on its own, speeds up with your scroll and
 * flips direction when you scroll back up.
 */
export default function Marquee({ words }: { words: string[] }) {
  const root = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, () => {
        const loop = gsap.to(row.current, { xPercent: -50, ease: "none", duration: 38, repeat: -1 });
        // Start deep into the loop so it has room to run backwards too.
        loop.totalTime(loop.duration() * 500);

        let direction = 1;
        let target = 1;
        let speed = 1;
        const tick = () => {
          target += (direction - target) * 0.04; // boost decays back to cruising speed
          speed += (target - speed) * 0.12;
          loop.timeScale(speed);
        };
        gsap.ticker.add(tick);

        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            direction = self.direction;
            target = direction * (1 + Math.min(6, Math.abs(self.getVelocity()) / 250));
          },
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        });
        if (!st.isActive) loop.pause();
        return () => gsap.ticker.remove(tick);
      });
    },
    { scope: root },
  );

  const set = (key: string) =>
    words.map((w, i) => (
      <span key={`${key}${i}`} className="flex items-center gap-[0.35em] pr-[0.35em]">
        <span className={i % 2 ? "marquee-outline" : "text-paper"}>{w}</span>
        <span className="inline-block h-[0.14em] w-[0.14em] bg-copper" />
      </span>
    ));

  return (
    <div ref={root} className="overflow-hidden border-y border-line py-6 md:py-8" aria-hidden="true">
      <div
        ref={row}
        className="flex w-max whitespace-nowrap text-[clamp(3rem,9vw,8.5rem)] font-semibold uppercase leading-none tracking-[-0.04em]"
      >
        {set("a")}
        {set("b")}
      </div>
    </div>
  );
}
