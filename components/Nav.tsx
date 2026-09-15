"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, REDUCED_MOTION } from "@/lib/gsap";
import { introReady, isAutoScrolling, lockScroll, saveAnchor, scrollToTarget, unlockScroll } from "@/lib/scroll";
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

      // Opacity only (never visibility), so the header's links can be tabbed to while it fades in.
      introReady.then(() => {
        if (cancelled) return;
        if (reduce) gsap.set(el, { opacity: 1 });
        else {
          // not tappable while it's still invisible (the delay), keyboard focus can still reach it
          gsap.set(el, { pointerEvents: "none" });
          gsap.fromTo(el, { opacity: 0, y: -16 }, {
            opacity: 1,
            y: 0,
            duration: 1.4,
            delay: 0.9,
            onStart: () => gsap.set(el, { clearProps: "pointerEvents" }),
          });
        }
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
          // stays in view while a nav link's own scroll runs, so the next section is one click away
          if (openRef.current || el.querySelector(":focus-visible") || isAutoScrolling()) return;
          if (self.scroll() < 120) show(true);
          else show(self.direction !== 1);
        },
      });

      // Never leave keyboard focus on a header that's slid off screen.
      const onFocus = () => {
        gsap.set(el, { opacity: 1 });
        show(true);
      };
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
    const behind = [
      document.getElementById("main"),
      document.querySelector<HTMLElement>("body > footer"),
      document.querySelector<HTMLElement>(".skip-link"),
    ];

    // Quick repeated taps: never let an old open/close tween finish on top of the new state.
    gsap.killTweensOf(el);

    if (open) {
      wasOpen.current = true;
      lockScroll();
      behind.forEach((b) => b?.setAttribute("inert", ""));
      // Visible (but transparent) before the fade, so focus can move into it right away.
      gsap.set(el, { display: "flex", visibility: "visible" });
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: reduce ? 0 : 0.4, ease: "power2.out" });
      gsap.fromTo(
        el.querySelectorAll(".menu-item"),
        { yPercent: 100 },
        { yPercent: 0, duration: reduce ? 0 : 0.9, stagger: 0.06, ease: "expo.out" },
      );
      el.querySelector<HTMLElement>("a")?.focus();

      const close = () => {
        setOpen(false);
        toggle.current?.focus();
      };
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
      window.addEventListener("keydown", onKey);
      // The menu only exists below md; growing the window past it closes the menu (and unlocks the page).
      const wide = window.matchMedia("(min-width: 768px)");
      const onWide = () => wide.matches && close();
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
        if (!openRef.current) gsap.set(el, { display: "none" });
      },
    });
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const wasOpen = openRef.current;
    setOpen(false);
    if (wasOpen) requestAnimationFrame(() => scrollToTarget(`#${id}`));
    else scrollToTarget(`#${id}`);
  };

  return (
    <>
      <header ref={header} className="header fixed inset-x-0 top-0 z-50">
        <div className="pointer-events-none absolute inset-0 -bottom-8 bg-gradient-to-b from-ink/90 via-ink/50 to-transparent" />
        <div className="header-solid pointer-events-none absolute inset-0" />
        {/* three columns from lg, so the links sit at the true centre whatever the logo and switch widths
            (at tablet width there's no room to spare, so they're simply spread out) */}
        <div className="gutter relative flex h-16 items-center justify-between md:h-20 lg:grid lg:grid-cols-[1fr_auto_1fr] short:h-14!">
          <a
            href="#top"
            onClick={go("top")}
            className="tap-area -mx-2 flex w-fit items-center gap-3 px-2 text-paper"
            aria-label={person.name}
          >
            <Mark className="h-6 w-6" />
            <span className="label-mono hidden sm:inline">{person.name}</span>
          </a>

          <nav aria-label={t(ui.mainNav, locale)} className="hidden md:block">
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

          <div className="flex items-center gap-5 lg:justify-self-end">
            {/* A full page load on purpose: a client-side switch re-renders <html> and drops the
                "js" class set by the boot script, which breaks the scroll-driven sections. The other
                language opens at the same place in the page.
                Its name keeps the visible "EN / FR" (for voice control) plus a phrase in the other language. */}
            <a
              href={`/${other}`}
              hrefLang={other}
              onClick={(e) => {
                // a new-tab click (⌘/Ctrl/shift/middle) leaves this page where it is
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) saveAnchor(`/${other}`, true);
              }}
              className="tap-area label-mono flex items-center gap-1.5 text-mute transition-colors hover:text-paper"
            >
              <span className={locale === "en" ? "text-paper" : ""}>EN</span>
              <span className="text-line" aria-hidden="true">
                /
              </span>
              <span className={locale === "fr" ? "text-paper" : ""}>FR</span>
              <span className="sr-only" lang={other}>
                {" "}
                {t(ui.switchLanguage, locale)}
              </span>
            </a>
            {/* Both labels share one cell so switching Menu/Close never shifts the row. */}
            <button
              ref={toggle}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="tap-area label-mono grid h-10 items-center justify-items-end text-paper md:hidden"
            >
              <span className={`col-start-1 row-start-1 ${open ? "invisible" : ""}`}>{t(ui.menu, locale)}</span>
              <span className={`col-start-1 row-start-1 ${open ? "" : "invisible"}`}>{t(ui.close, locale)}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tall enough to clear the header, scrolls on short (sideways) phones; a tap on the empty backdrop closes it. */}
      <nav
        ref={menu}
        id="mobile-menu"
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        className="gutter fixed inset-0 z-40 hidden flex-col overflow-y-auto overscroll-contain bg-ink pb-16 pt-24 opacity-0 md:hidden short:pb-8"
        aria-label={t(ui.mainNav, locale)}
      >
        <div className="bg-grid pointer-events-none fixed inset-0 opacity-40 [mask-image:linear-gradient(to_top,black,transparent_70%)]" />
        <ul className="relative mt-auto flex flex-col gap-2">
          {ui.nav.map((item) => (
            <li key={item.id} className="border-b border-line pb-3">
              {/* the mask for the rise-in sits inside the link, so the focus ring isn't clipped */}
              <a href={`#${item.id}`} onClick={go(item.id)} className="flex min-h-11 items-center gap-4 text-paper">
                <span className="h-px w-6 shrink-0 bg-copper" aria-hidden="true" />
                <span className="overflow-hidden pb-1">
                  <span className="menu-item block text-5xl font-medium tracking-tight short:text-3xl">
                    {t(item.label, locale)}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
