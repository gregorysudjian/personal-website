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
 * Only opacity is animated (never autoAlpha/visibility): content waiting to be revealed must stay
 * focusable and readable by screen readers.
 */
export default function Reveals() {
  useGSAP(() => {
    // The head script's failsafe has turned the page into plain content: leave it alone.
    if (!document.documentElement.classList.contains("js")) return;
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
                  gsap.set(el, { opacity: 1 });
                  return gsap.from(self.lines, {
                    yPercent: 110,
                    duration: 1,
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
            gsap.set(el, { opacity: 1 });
            gsap.from(el.children, { opacity: 0, y: 32, duration: 0.9, stagger: 0.06, delay, scrollTrigger });
            break;
          case "clip":
            gsap.fromTo(
              el,
              { opacity: 1, clipPath: "inset(0% 0% 100% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut", delay, scrollTrigger },
            );
            break;
          default:
            gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, delay, scrollTrigger });
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

      // Keyboard focus landing inside content that hasn't finished revealing shows it at once,
      // so the focus ring is never on something invisible.
      const onFocus = (e: FocusEvent) => {
        const host = (e.target as Element | null)?.closest?.<HTMLElement>("[data-reveal]");
        if (!host) return;
        const targets = host.dataset.reveal === "stagger" ? [host, ...Array.from(host.children)] : [host];
        gsap.to(targets, { opacity: 1, y: 0, clipPath: "none", duration: 0.25, overwrite: "auto" });
      };
      document.addEventListener("focusin", onFocus);

      return () => {
        document.removeEventListener("focusin", onFocus);
        splits.forEach((s) => s.revert());
      };
    });
  });

  return null;
}
