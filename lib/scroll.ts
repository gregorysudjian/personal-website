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

/* Scrolls started by the site (nav links, CTAs): the header stays put while they run. */
let autoScrolling = false;
export function isAutoScrolling() {
  return autoScrolling;
}

export function scrollToTarget(target: string | number | HTMLElement) {
  const el = typeof target === "number" ? null : typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  // Section links keep the address shareable (#projects) without adding history entries.
  if (typeof target === "string" && target.startsWith("#")) {
    history.replaceState(null, "", target === "#top" ? location.pathname : target);
  }
  if (lenis) {
    autoScrolling = true;
    lenis.scrollTo(target, {
      duration: 1.6,
      easing: (x) => 1 - Math.pow(1 - x, 4),
      onComplete: () => (autoScrolling = false),
    });
  } else {
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

/* Where the reader is, as "this far into that section". Pinned sections change height with the window,
   so a raw scrollY lands somewhere else after a resize, a rotation, a reload or a language switch. */
export const ANCHOR_KEY = "gs-scroll";
export type Anchor = { i: number; f: number };
const blocks = () => Array.from(document.querySelectorAll<HTMLElement>("main > section, body > footer"));

export function readAnchor(): Anchor | null {
  const list = blocks();
  for (let i = 0; i < list.length; i++) {
    const r = list[i].getBoundingClientRect();
    if (r.bottom > 1) return { i, f: Math.min(1, Math.max(0, -r.top / (r.height || 1))) };
  }
  return null;
}

export function jumpTo(a: Anchor) {
  const el = blocks()[a.i];
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + a.f * el.offsetHeight;
  if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
  else window.scrollTo(0, top);
}

/** Remembers the reader's place for the page at `path` (this one on reload, the other language on a switch). */
export function saveAnchor(path: string, carry = false) {
  try {
    sessionStorage.setItem(ANCHOR_KEY, JSON.stringify({ path, carry, ...readAnchor() }));
  } catch {}
}

/* The hero intro waits for the boot sequence (or starts at once if it's skipped). */
let resolveIntro: () => void = () => {};
export const introReady = new Promise<void>((resolve) => {
  resolveIntro = resolve;
});
export function markIntroReady() {
  resolveIntro();
}
