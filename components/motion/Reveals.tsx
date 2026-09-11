"use client";

import { gsap, SplitText, useGSAP, FULL_MOTION } from "@/lib/gsap";

/**
 * One place for every scroll reveal. Mark any element in the markup with:
 *   data-reveal            fade + rise
 *   data-reveal="lines"    text rises line by line from behind a mask
 *   data-reveal="stagger"  its children rise one after another
 *   data-reveal="clip"     wipes open from top to bottom
 *   data-parallax="0.1"    drifts against the scroll (fraction of its height)
 * With reduced motion, everything is simply shown.
 */
export default function Reveals() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(FULL_MOTION, () => {
      const splits: SplitText[] = [];

      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const delay = Number(el.dataset.revealDelay ?? 0);
        const scrollTrigger = { trigger: el, start: "top 88%", once: true };

        switch (el.dataset.reveal) {
          case "lines":
            splits.push(
              SplitText.create(el, {
                type: "lines",
                mask: "lines",
                autoSplit: true,
                onSplit: (self) => {
                  gsap.set(el, { visibility: "visible" });
                  return gsap.from(self.lines, {
                    yPercent: 110,
                    duration: 1.4,
                    stagger: 0.09,
                    delay,
                    scrollTrigger,
                    // Unwrap the masks once revealed so glows and hovers aren't clipped.
                    onComplete: () => self.revert(),
                  });
                },
              }),
            );
            break;
          case "stagger":
            gsap.set(el, { visibility: "visible" });
            gsap.from(el.children, { autoAlpha: 0, y: 32, duration: 1.2, stagger: 0.08, delay, scrollTrigger });
            break;
          case "clip":
            gsap.fromTo(
              el,
              { autoAlpha: 1, clipPath: "inset(0% 0% 100% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut", delay, scrollTrigger },
            );
            break;
          default:
            gsap.fromTo(el, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.3, delay, scrollTrigger });
        }
      });

      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax) || 0.1;
        gsap.fromTo(
          el,
          { yPercent: amount * 100 },
          {
            yPercent: -amount * 100,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      return () => splits.forEach((s) => s.revert());
    });
  });

  return null;
}
