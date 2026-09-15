"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { lockScroll, markIntroReady, unlockScroll } from "@/lib/scroll";
import { person } from "@/content/site";
import Mark from "./Mark";

export const BOOT_KEY = "gs-booted";

/** First-visit intro: the mark appears, a copper line charges across, then the screen splits open. */
export default function Boot() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      if (html.classList.contains("booted")) {
        markIntroReady();
        return;
      }

      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      lockScroll();
      // Nothing behind the overlay can be focused while it plays.
      const page = [document.querySelector<HTMLElement>("header"), document.getElementById("main"), document.querySelector<HTMLElement>("body > footer")];
      page.forEach((el) => el?.setAttribute("inert", ""));

      const tl = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem(BOOT_KEY, "1");
          } catch {}
          html.classList.add("booted");
          page.forEach((el) => el?.removeAttribute("inert"));
          unlockScroll();
          window.removeEventListener("keydown", skip);
          window.removeEventListener("pointerdown", skip);
        },
      });
      // Any key or tap skips the rest of the intro.
      const skip = () => tl.progress(1);
      window.addEventListener("keydown", skip, { once: true });
      window.addEventListener("pointerdown", skip, { once: true });

      tl.to(".boot-mark", { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.1)
        .to(".boot-bar", { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0.2)
        .to(".boot-mark", { autoAlpha: 0, y: -8, duration: 0.35, ease: "power2.in" }, "+=0.1")
        .addLabel("split")
        .add(() => markIntroReady(), "split+=0.3")
        .to(".boot-half--top", { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "split")
        .to(".boot-half--bottom", { yPercent: 100, duration: 1.1, ease: "expo.inOut" }, "split")
        .to(".boot-bar", { autoAlpha: 0, duration: 0.4 }, "split+=0.1");
    },
    { scope: root },
  );

  return (
    <div ref={root} className="boot fixed inset-0 z-[90]" aria-hidden="true">
      <div className="boot-half--top absolute inset-x-0 top-0 h-1/2 bg-ink" />
      <div className="boot-half--bottom absolute inset-x-0 bottom-0 h-1/2 bg-ink" />
      <div className="boot-bar absolute inset-x-0 top-1/2 h-px origin-center scale-x-0 bg-copper shadow-[0_0_18px_2px_rgb(232_130_58/0.6)]" />
      <div className="boot-mark invisible absolute inset-x-0 top-1/2 flex translate-y-[-3.25rem] items-center justify-center gap-3 text-paper opacity-0">
        <Mark className="h-6 w-6" />
        <span className="label-mono">{person.name}</span>
      </div>
    </div>
  );
}
