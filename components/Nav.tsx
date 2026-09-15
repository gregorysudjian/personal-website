"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, REDUCED_MOTION } from "@/lib/gsap";
import { introReady, lockScroll, scrollToTarget, unlockScroll } from "@/lib/scroll";
import { otherLocale, t, type Locale } from "@/lib/i18n";
import { person, ui } from "@/content/site";
import Mark from "./Mark";

export default function Nav({ locale }: { locale: Locale }) {
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const other = otherLocale(locale);

  // Intro, then hide on scroll down / reveal on scroll up.
  useGSAP(
    () => {
      const el = header.current!;
      const reduce = window.matchMedia(REDUCED_MOTION).matches;
      let cancelled = false;

      introReady.then(() => {
        if (cancelled) return;
        if (reduce) gsap.set(el, { autoAlpha: 1 });
        else gsap.fromTo(el, { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 1.4, delay: 0.9 });
      });

      let hidden = false;
      const show = (visible: boolean) => {
        if (hidden === !visible) return;
        hidden = !visible;
        gsap.to(el, { yPercent: visible ? 0 : -110, duration: reduce ? 0 : 0.6, ease: "power3.out", overwrite: "auto" });
      };

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          // Away from the top the header gets a solid backdrop, so page text doesn't run through it.
          el.classList.toggle("is-scrolled", self.scroll() > 120);
          if (openRef.current || el.querySelector(":focus-visible")) return;
          if (self.scroll() < 120) show(true);
          else show(self.direction !== 1);
        },
      });

      // Never leave keyboard focus on a header that's slid off screen.
      const onFocus = () => show(true);
      el.addEventListener("focusin", onFocus);

      return () => {
        cancelled = true;
        el.removeEventListener("focusin", onFocus);
      };
    },
    { scope: header },
  );

  // Mobile menu open/close.
  const wasOpen = useRef(false);
  useEffect(() => {
    openRef.current = open;
    const el = menu.current;
    if (!el) return;
    const reduce = window.matchMedia(REDUCED_MOTION).matches;

    // While the menu covers the page, what's behind it can't be reached with Tab or a screen reader.
    const behind = [document.getElementById("main"), document.querySelector<HTMLElement>("body > footer")];

    if (open) {
      wasOpen.current = true;
      lockScroll();
      behind.forEach((b) => b?.setAttribute("inert", ""));
      gsap.set(el, { display: "flex" });
      gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: reduce ? 0 : 0.4, ease: "power2.out" });
      gsap.fromTo(
        el.querySelectorAll(".menu-item"),
        { yPercent: 100 },
        { yPercent: 0, duration: reduce ? 0 : 0.9, stagger: 0.06, ease: "expo.out" },
      );
      el.querySelector<HTMLElement>("a")?.focus();

      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      // The menu only exists below md; growing the window past it closes the menu (and unlocks the page).
      const wide = window.matchMedia("(min-width: 768px)");
      const onWide = () => wide.matches && setOpen(false);
      wide.addEventListener("change", onWide);
      return () => {
        window.removeEventListener("keydown", onKey);
        wide.removeEventListener("change", onWide);
      };
    }

    // Only undo what opening did (never unlock the boot sequence on mount).
    if (!wasOpen.current) return;
    wasOpen.current = false;
    unlockScroll();
    behind.forEach((b) => b?.removeAttribute("inert"));
    gsap.to(el, {
      autoAlpha: 0,
      duration: reduce ? 0 : 0.3,
      onComplete: () => {
        gsap.set(el, { display: "none" });
      },
    });
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const wasOpen = openRef.current;
    setOpen(false);
    if (wasOpen) {
      toggle.current?.focus();
      requestAnimationFrame(() => scrollToTarget(`#${id}`));
    } else scrollToTarget(`#${id}`);
  };

  return (
    <>
      <header ref={header} data-intro className="fixed inset-x-0 top-0 z-50">
        <div className="pointer-events-none absolute inset-0 -bottom-8 bg-gradient-to-b from-ink/90 via-ink/50 to-transparent" />
        <div className="header-solid pointer-events-none absolute inset-0" />
        <div className="gutter relative flex h-16 items-center justify-between md:h-20">
          <a href="#top" onClick={go("top")} className="tap-area flex items-center gap-3 text-paper" aria-label={person.name}>
            <Mark className="h-6 w-6" />
            <span className="label-mono hidden sm:inline">{person.name}</span>
          </a>

          <nav aria-label={locale === "fr" ? "Navigation principale" : "Main navigation"} className="hidden md:block">
            <ul className="flex items-center gap-9">
              {ui.nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={go(item.id)}
                    className="tap-area link-underline label-mono text-mute transition-colors duration-300 hover:text-paper"
                  >
                    {t(item.label, locale)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-5">
            {/* A full page load on purpose: a client-side switch re-renders <html> and drops the
                "js" class set by the boot script, which breaks the scroll-driven sections. */}
            <a
              href={`/${other}`}
              hrefLang={other}
              aria-label={t(ui.switchLanguage, locale)}
              className="tap-area label-mono flex items-center gap-1.5 text-mute transition-colors hover:text-paper"
            >
              <span className={locale === "en" ? "text-paper" : ""}>EN</span>
              <span className="text-line">/</span>
              <span className={locale === "fr" ? "text-paper" : ""}>FR</span>
            </a>
            <button
              ref={toggle}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="tap-area label-mono flex h-10 items-center text-paper md:hidden"
            >
              {t(open ? ui.close : ui.menu, locale)}
            </button>
          </div>
        </div>
      </header>

      <nav
        ref={menu}
        id="mobile-menu"
        className="gutter fixed inset-0 z-40 hidden flex-col justify-end bg-ink pb-16 opacity-0 md:hidden"
        aria-label={t(ui.menu, locale)}
      >
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_top,black,transparent_70%)]" />
        <ul className="relative flex flex-col gap-2">
          {ui.nav.map((item) => (
            <li key={item.id} className="overflow-hidden border-b border-line pb-3">
              <a href={`#${item.id}`} onClick={go(item.id)} className="menu-item flex items-center gap-4 text-paper">
                <span className="h-px w-6 bg-copper" aria-hidden="true" />
                <span className="text-5xl font-medium tracking-tight">{t(item.label, locale)}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
