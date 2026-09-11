"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/** Pulls its child toward the cursor while hovered, then springs back. */
export default function Magnetic({
  children,
  strength = 0.3,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add(QUERY, () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
        let rect: DOMRect | null = null;

        const enter = () => {
          gsap.set(el, { x: 0, y: 0 });
          rect = el.getBoundingClientRect();
        };
        const move = (e: PointerEvent) => {
          if (!rect) rect = el.getBoundingClientRect();
          xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
          yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
        };
        const leave = () => {
          rect = null;
          xTo(0);
          yTo(0);
        };

        el.addEventListener("pointerenter", enter);
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointerenter", enter);
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
