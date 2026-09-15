"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, FULL_MOTION } from "@/lib/gsap";
import { t, type Locale } from "@/lib/i18n";
import { statement, statementLabel } from "@/content/site";
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
          // Leave the words readable: the default puts aria-hidden on every word and an aria-label on the <p>,
          // which screen readers ignore on a paragraph.
          aria: "none",
          onSplit: (self) => {
            // Dim every word up front, then light them in reading order as the section scrolls.
            gsap.set(self.words, { opacity: 0.2 });
            text.current!.classList.add("is-split");
            return gsap.to(self.words, {
              opacity: 1,
              ease: "none",
              duration: 1,
              stagger: 0.4,
              // Fully lit a little before the pin lets go, so the whole sentence rests on screen for a moment.
              scrollTrigger: { trigger: root.current, start: "top 45%", end: "bottom 130%", scrub: true },
            });
          },
        });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    // With reduced motion it's a normal block of text (nothing to light up, so no pinned, frozen screen).
    <section ref={root} className="relative h-[220vh] motion-reduce:h-auto" aria-labelledby="statement-label">
      <CircuitTrace route="rail" />
      <div className="gutter sticky top-0 flex h-svh flex-col justify-center-safe motion-reduce:static motion-reduce:h-auto motion-reduce:py-32 short:pt-14">
        <p id="statement-label" className="label-mono mb-8 flex items-center gap-3 text-mute md:mb-12 short:mb-4!">
          <span className="h-px w-8 bg-copper" aria-hidden="true" />
          {t(statementLabel, locale)}
        </p>
        {/* sized by height too, so the sentence fits a phone held sideways */}
        <p
          ref={text}
          className="statement-text max-w-[22ch] text-pretty text-[clamp(2rem,min(5.4vw,8.5svh),5.6rem)] font-medium leading-[1.04] tracking-[-0.035em] text-paper md:max-w-[24ch] short:text-[clamp(1.35rem,min(5.4vw,7.2svh),2rem)]!"
        >
          <Rich text={t(statement, locale)} />
        </p>
      </div>
    </section>
  );
}
