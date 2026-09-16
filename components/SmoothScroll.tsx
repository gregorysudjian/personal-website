"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, REDUCED_MOTION } from "@/lib/gsap";

declare global {
  interface Window {
    __gsReady?: boolean;
  }
}
import { clearCarry, jumpTo, readAnchor, readSaved, saveAnchor, scrollToTarget, setLenis, type Anchor } from "@/lib/scroll";

/** Smooth, weighted scrolling on desktop, kept in sync with GSAP's clock.
 *  Touch devices keep native scrolling (it already feels right, and never lags). */
export default function SmoothScroll() {
  useEffect(() => {
    window.__gsReady = true; // the head script's no-JS failsafe stands down
    // If that failsafe already fired (the app arrived very late), the page is already readable as plain
    // content: leave it that way rather than hiding everything again under the reader.
    if (!document.documentElement.classList.contains("js")) return;

    // After a reload, Back/Forward or a language switch, return to the same place
    // (the browser's own restore is off, see layout). That beats a leftover #hash in the address.
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const saved = readSaved(location.pathname);
    const restore: Anchor | null =
      saved && (saved.carry || nav?.type === "reload" || nav?.type === "back_forward") ? saved : null;
    if (saved?.carry) clearCarry(location.pathname);

    // If the visitor has already started reading by the time a slow page is ready, leave them alone.
    let moved = false;
    const startedAt = window.scrollY;
    const noticeMove = () => (moved = true);
    addEventListener("wheel", noticeMove, { passive: true, once: true });
    addEventListener("touchstart", noticeMove, { passive: true, once: true });
    addEventListener("keydown", noticeMove, { once: true });

    // Web fonts change text heights; re-measure every scroll animation once they're in.
    // A link to a section (#projects) lands on it once the page has its final height.
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
      const target = location.hash.length > 1 ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
      if (restore && !moved && window.scrollY === startedAt) jumpTo(restore);
      else if (target) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY);
    });

    // Keep the reader's place through window resizes and rotations (not the phone toolbar's small resizes).
    let anchor = readAnchor();
    let resizing = false;
    let settle = 0;
    // Compared with the size the anchor was taken at, so slowly dragging an edge still counts as one resize.
    let anchorSize = [window.innerWidth, window.innerHeight];
    const onScroll = () => {
      if (resizing) return;
      anchor = readAnchor();
      anchorSize = [window.innerWidth, window.innerHeight];
    };
    const onResize = () => {
      const [w, h] = anchorSize;
      if (w === window.innerWidth && Math.abs(h - window.innerHeight) < 150) return;
      resizing = true;
      clearTimeout(settle);
      settle = window.setTimeout(() => (resizing = false), 1500);
    };
    const onRefresh = () => {
      if (resizing && anchor) jumpTo(anchor);
      resizing = false;
      anchor = readAnchor();
      anchorSize = [window.innerWidth, window.innerHeight];
    };
    const onHide = () => saveAnchor(location.pathname);
    // Back/Forward between the sections the visitor jumped to.
    const onPop = () => {
      const id = location.hash.slice(1);
      scrollToTarget(id ? `#${decodeURIComponent(id)}` : 0);
    };
    window.addEventListener("popstate", onPop);

    // Keyboard focus that lands outside the viewport (Shift+Tab up a long page) is taken there smoothly,
    // so the ring is never on something off screen.
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el?.getBoundingClientRect || !el.matches(":focus-visible")) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 80 && r.top < window.innerHeight - 20) return;
      el.scrollIntoView({ block: "center", behavior: "instant" as ScrollBehavior });
    };
    document.addEventListener("focusin", onFocusIn);

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
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("focusin", onFocusIn);
      removeEventListener("wheel", noticeMove);
      removeEventListener("touchstart", noticeMove);
      removeEventListener("keydown", noticeMove);
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
