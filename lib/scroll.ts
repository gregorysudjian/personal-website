"use client";

import type Lenis from "lenis";

/* Shared scroll + intro state, so components don't need a React context. */

let lenis: Lenis | null = null;
let locked = false;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
  if (lenis && locked) lenis.stop();
}

export function getLenis() {
  return lenis;
}

export function lockScroll() {
  locked = true;
  document.documentElement.classList.add("is-locked");
  lenis?.stop();
}

export function unlockScroll() {
  locked = false;
  document.documentElement.classList.remove("is-locked");
  lenis?.start();
}

export function scrollToTarget(target: string | number | HTMLElement) {
  const el = typeof target === "number" ? null : typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (x) => 1 - Math.pow(1 - x, 4) });
  else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
    if (typeof target === "number") window.scrollTo({ top: target, behavior });
    else el?.scrollIntoView({ behavior });
  }
  // Keyboard focus goes along with the scroll, so the next Tab continues from the section just reached.
  if (el) {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    requestAnimationFrame(() => el.focus({ preventScroll: true }));
  }
}

/* The hero intro waits for the boot sequence (or starts at once if it's skipped). */
let resolveIntro: () => void = () => {};
export const introReady = new Promise<void>((resolve) => {
  resolveIntro = resolve;
});
export function markIntroReady() {
  resolveIntro();
}
