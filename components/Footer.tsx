"use client";

import { useEffect, useState } from "react";
import { t, type Locale } from "@/lib/i18n";
import { footer, person } from "@/content/site";
import { scrollToTarget } from "@/lib/scroll";

/* Scroll up and take keyboard focus along, so the next Tab starts from the top, not the footer. */
function backToTop() {
  scrollToTarget("#top");
  document.getElementById("main")?.focus({ preventScroll: true });
}

export default function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="gutter grid gap-5 py-10 md:grid-cols-2 md:items-center md:gap-x-10 lg:grid-cols-4">
        <p className="label-mono text-mute">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {person.name}
        </p>
        <p className="label-mono text-mute">{t(footer.builtIn, locale)}</p>
        <p className="label-mono flex items-center gap-2 text-mute">
          {t(footer.localTime, locale)}
          <span className="text-paper">
            <LocalTime />
          </span>
        </p>
        <div className="lg:text-right">
          <button type="button" onClick={backToTop} className="tap-area link-underline label-mono -mr-[0.14em] text-paper">
            {t(footer.backToTop, locale)} <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
      <p
        aria-hidden="true"
        className="footer-mark select-none whitespace-nowrap px-[2vw] text-center text-[17.5vw] font-semibold uppercase leading-[0.78] tracking-[-0.05em]"
      >
        {person.lastName}
      </p>
    </footer>
  );
}

/** Montreal's current time, ticking. Rendered after mount so server and client agree. */
function LocalTime() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    // en-GB gives a plain 24h "14:05:09" in both languages. With reduced motion the seconds don't tick.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: still ? undefined : "2-digit",
      hour12: false,
      timeZone: person.timezone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    // a fixed width, so neither the placeholder swap nor the ticking seconds move the row
    <time className="inline-block min-w-[8ch] tabular-nums" suppressHydrationWarning>
      {time}
    </time>
  );
}
