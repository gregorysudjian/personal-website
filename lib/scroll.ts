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

export function scrollToTarget(target: string | number | HTMLElement, push = false) {
  const el = typeof target === "number" ? null : typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  // Section links keep the address shareable (#projects); from the nav they also add a history entry,
  // so Back walks back through the sections the visitor jumped to.
  if (typeof target === "string" && target.startsWith("#")) {
    const url = target === "#top" ? location.pathname : target;
    if (push && url !== location.pathname + location.hash) history.pushState(null, "", url);
    else history.replaceState(null, "", url);
  } else if (target === 0) {
    history.replaceState(null, "", location.pathname);
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
  // Flagged like any scroll the site starts, so the header doesn't read it as "scrolling down" and hide.
  autoScrolling = true;
  setTimeout(() => (autoScrolling = false), 400);
  if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
  else window.scrollTo(0, top);
}

/** Remembers the reader's place per page, so Back after a language switch still lands in the right section. */
export function saveAnchor(path: string, carry = false) {
  try {
    const all = JSON.parse(sessionStorage.getItem(ANCHOR_KEY) || "{}");
    all[path] = { carry, ...readAnchor() };
    sessionStorage.setItem(ANCHOR_KEY, JSON.stringify(all));
  } catch {}
}

export function readSaved(path: string) {
  try {
    return JSON.parse(sessionStorage.getItem(ANCHOR_KEY) || "{}")[path] ?? null;
  } catch {
    return null;
  }
}

export function clearCarry(path: string) {
  try {
    const all = JSON.parse(sessionStorage.getItem(ANCHOR_KEY) || "{}");
    if (all[path]) delete all[path].carry;
    sessionStorage.setItem(ANCHOR_KEY, JSON.stringify(all));
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
