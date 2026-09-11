"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/**
 * A small dot that tracks the pointer exactly, and a ring that follows with a little lag.
 * Over links and buttons the ring grows; over anything with data-cursor="Label" it
 * turns into a copper tag showing that label. Desktop only.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia(QUERY).matches) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    const d = dot.current!;
    const r = ring.current!;
    const g = tag.current!;
    gsap.set([d, r, g], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const dx = gsap.quickTo(d, "x", { duration: 0.1, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.1, ease: "power3" });
    const rx = gsap.quickTo([r, g], "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo([r, g], "y", { duration: 0.45, ease: "power3" });

    let shown = false;
    let mode = "";

    const setMode = (next: string, label = "") => {
      if (next === mode && (next !== "tag" || g.textContent === label)) return;
      mode = next;
      if (next === "tag") g.textContent = label;
      gsap.to(r, {
        scale: next === "link" ? 1.9 : next === "tag" ? 0 : 1,
        borderColor: next === "link" ? "rgb(232 130 58 / 0.9)" : "rgb(237 235 230 / 0.35)",
        duration: 0.45,
        ease: "power3.out",
      });
      gsap.to(g, { scale: next === "tag" ? 1 : 0.4, autoAlpha: next === "tag" ? 1 : 0, duration: 0.35, ease: "power3.out" });
      gsap.to(d, { scale: next === "" ? 1 : 0, duration: 0.3 });
    };

    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([d, r], { x: e.clientX, y: e.clientY });
        gsap.set(g, { x: e.clientX, y: e.clientY });
        gsap.to([d, r], { autoAlpha: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      if (labelled) return setMode("tag", labelled.dataset.cursor ?? "");
      if (target?.closest("a, button, [role='button']")) return setMode("link");
      setMode("");
    };

    const hide = () => {
      shown = false;
      gsap.to([d, r, g], { autoAlpha: 0, duration: 0.25 });
    };
    const press = () => gsap.to(r, { scale: 0.75, duration: 0.2 });
    const release = () => {
      const m = mode;
      mode = "_";
      setMode(m);
    };

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerdown", press);
    document.addEventListener("pointerup", release);
    html.addEventListener("pointerleave", hide);

    return () => {
      html.classList.remove("has-cursor");
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("pointerup", release);
      html.removeEventListener("pointerleave", hide);
    };
  }, []);

  return (
    <div aria-hidden="true" className="cursor">
      <div ref={ring} className="cursor-ring" />
      <div ref={dot} className="cursor-dot" />
      <div ref={tag} className="cursor-tag label-mono" />
    </div>
  );
}
