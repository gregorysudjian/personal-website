"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, FULL_MOTION } from "@/lib/gsap";
import { t, type Locale } from "@/lib/i18n";
import { statement } from "@/content/site";
import CircuitTrace from "./CircuitTrace";
import Rich from "./Rich";

/** One sentence, pinned on screen, lighting up word by word as you scroll. */
export default function Statement({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const text = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, () => {
        const split = SplitText.create(text.current!, {
          type: "words",
          autoSplit: true,
          onSplit: (self) => {
            // Dim every word up front, then light them in reading order as the section scrolls.
            gsap.set(self.words, { opacity: 0.13 });
            return gsap.to(self.words, {
              opacity: 1,
              ease: "none",
              duration: 1,
              stagger: 0.4,
              scrollTrigger: { trigger: root.current, start: "top 45%", end: "bottom 105%", scrub: true },
            });
          },
        });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-[220vh]" aria-label={locale === "fr" ? "En une phrase" : "In one sentence"}>
      <CircuitTrace route="rail" />
      <div className="gutter sticky top-0 flex h-svh flex-col justify-center">
        <p className="label-mono mb-8 flex items-center gap-3 text-mute md:mb-12">
          <span className="h-px w-8 bg-copper" aria-hidden="true" />
          {locale === "fr" ? "En une phrase" : "In one sentence"}
        </p>
        <p
          ref={text}
          className="max-w-[22ch] text-[clamp(2rem,5.4vw,5.6rem)] font-medium leading-[1.04] tracking-[-0.035em] text-paper md:max-w-[24ch]"
        >
          <Rich text={t(statement, locale)} />
        </p>
      </div>
    </section>
  );
}
