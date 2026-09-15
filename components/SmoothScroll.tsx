"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, REDUCED_MOTION } from "@/lib/gsap";

declare global {
  interface Window {
    __gsReady?: boolean;
  }
}
import { ANCHOR_KEY, jumpTo, readAnchor, saveAnchor, setLenis, type Anchor } from "@/lib/scroll";

/** Smooth, weighted scrolling on desktop, kept in sync with GSAP's clock.
 *  Touch devices keep native scrolling (it already feels right, and never lags). */
export default function SmoothScroll() {
  useEffect(() => {
    window.__gsReady = true; // the head script's no-JS failsafe stands down
    // If that failsafe already fired (very slow load), switch the animated page back on.
    document.documentElement.classList.add("js");

    // After a reload, Back/Forward or a language switch, return to the same place
    // (the browser's own restore is off, see layout). That beats a leftover #hash in the address.
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    let restore: Anchor | null = null;
    try {
      const saved = JSON.parse(sessionStorage.getItem(ANCHOR_KEY) || "null");
      if (saved?.path === location.pathname && (saved.carry || nav?.type === "reload" || nav?.type === "back_forward"))
        restore = saved;
      if (saved?.carry) sessionStorage.removeItem(ANCHOR_KEY);
    } catch {}

    // Web fonts change text heights; re-measure every scroll animation once they're in.
    // A link to a section (#projects) lands on it once the page has its final height.
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
      const target = location.hash.length > 1 ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
      if (restore) jumpTo(restore);
      else if (target) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY);
    });

    // Keep the reader's place through window resizes and rotations (not the phone toolbar's small resizes).
    let anchor = readAnchor();
    let resizing = false;
    let settle = 0;
    let size = [window.innerWidth, window.innerHeight];
    const onScroll = () => {
      if (!resizing) anchor = readAnchor();
    };
    const onResize = () => {
      const [w, h] = size;
      size = [window.innerWidth, window.innerHeight];
      if (w === size[0] && Math.abs(h - size[1]) < 150) return;
      resizing = true;
      clearTimeout(settle);
      settle = window.setTimeout(() => (resizing = false), 1500);
    };
    const onRefresh = () => {
      if (resizing && anchor) jumpTo(anchor);
      resizing = false;
      anchor = readAnchor();
    };
    const onHide = () => {
      // a language switch already saved the place for the other page
      try {
        if (JSON.parse(sessionStorage.getItem(ANCHOR_KEY) || "null")?.carry) return;
      } catch {}
      saveAnchor(location.pathname);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pagehide", onHide);
    ScrollTrigger.addEventListener("refresh", onRefresh);

    // Anything that changes the page height later (a project's "How it's built" panel, a late image)
    // shifts every scroll animation below it: without a re-measure the skills band freezes on screen
    // and later effects fire in the wrong place.
    let measured = document.documentElement.scrollHeight;
    let timer = 0;
    const ro = new ResizeObserver(() => {
      if (Math.abs(document.documentElement.scrollHeight - measured) < 2) return;
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        ScrollTrigger.refresh();
        measured = document.documentElement.scrollHeight;
      }, 250);
    });
    ro.observe(document.body);
    const stopWatching = () => {
      ro.disconnect();
      clearTimeout(timer);
      clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pagehide", onHide);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
    };

    if (window.matchMedia(REDUCED_MOTION).matches) return stopWatching;

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.9,
      anchors: false, // in-page links go through scrollToTarget (focus, address, timing)
      autoRaf: false,
    });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      stopWatching();
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
