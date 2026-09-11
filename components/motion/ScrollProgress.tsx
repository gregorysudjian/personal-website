"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** A thin copper meter on the right edge that fills as you read down the page. */
export default function ScrollProgress() {
  const root = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const setFill = gsap.quickSetter(fill.current, "scaleY");
      let shown = false;
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          setFill(self.progress);
          if (count.current) count.current.textContent = String(Math.round(self.progress * 100)).padStart(3, "0");
          const show = self.progress > 0.04 && self.progress < 0.985;
          if (show !== shown) {
            shown = show;
            gsap.to(root.current, { autoAlpha: show ? 1 : 0, duration: 0.5 });
          }
        },
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="invisible fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 opacity-0 lg:flex"
    >
      <div className="relative h-36 w-px bg-line">
        <div ref={fill} className="absolute inset-0 origin-top scale-y-0 bg-copper" />
      </div>
      <span ref={count} className="font-mono text-[0.65rem] tabular-nums tracking-widest text-mute">
        000
      </span>
    </div>
  );
}
