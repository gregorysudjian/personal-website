"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, REDUCED_MOTION } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";

/** Smooth, weighted scrolling on desktop, kept in sync with GSAP's clock.
 *  Touch devices keep native scrolling (it already feels right, and never lags). */
export default function SmoothScroll() {
  useEffect(() => {
    // Web fonts change text heights; re-measure every scroll animation once they're in.
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    if (window.matchMedia(REDUCED_MOTION).matches) return;

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.9,
      anchors: true,
      autoRaf: false,
    });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
