"use client";

import { useEffect, useState } from "react";
import { t, type Locale } from "@/lib/i18n";
import { footer, person } from "@/content/site";
import { scrollToTarget } from "@/lib/scroll";

export default function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="gutter grid gap-5 py-10 md:grid-cols-4 md:items-center">
        <p className="label-mono text-mute">
          © {new Date().getFullYear()} {person.name}
        </p>
        <p className="label-mono text-mute">{t(footer.builtIn, locale)}</p>
        <p className="label-mono flex items-center gap-2 text-mute">
          {t(footer.localTime, locale)}
          <span className="text-paper">
            <LocalTime />
          </span>
        </p>
        <div className="md:text-right">
          <button type="button" onClick={() => scrollToTarget(0)} className="tap-area link-underline label-mono text-paper">
            {t(footer.backToTop, locale)} ↑
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
    // en-GB gives a plain 24h "14:05:09" in both languages.
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: person.timezone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <time className="tabular-nums" suppressHydrationWarning>
      {time}
    </time>
  );
}
