"use client";

import { useRef, useState } from "react";
import { t, type Locale } from "@/lib/i18n";
import { contact, person, ui } from "@/content/site";
import CircuitTrace from "../CircuitTrace";
import Magnetic from "../motion/Magnetic";
import Rich from "../Rich";
import Board from "./Board";

export default function Contact({ locale }: { locale: Locale }) {
  const [powered, setPowered] = useState(false);
  const [user, domain] = person.email.split("@");

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className={`contact relative overflow-hidden gutter py-32 md:py-48 short:py-20! ${powered ? "is-powered" : ""}`}
    >
      <Board powered={powered} />
      <CircuitTrace route="contact" onPowered={setPowered} className="z-[1]" />

      <div
        data-chip
        className="chip-box relative z-[2] mx-auto max-w-5xl rounded-[6px] border border-line bg-ink/90 px-6 py-14 md:px-16 md:py-20 short:py-12!"
      >
        <span className="chip-corner left-0 top-0 border-l border-t" aria-hidden="true" />
        <span className="chip-corner right-0 top-0 border-r border-t" aria-hidden="true" />
        <span className="chip-corner bottom-0 left-0 border-b border-l" aria-hidden="true" />
        <span className="chip-corner bottom-0 right-0 border-b border-r" aria-hidden="true" />

        <p data-reveal className="label-mono flex items-center gap-3 text-mute">
          <span className="section-index h-px w-8 bg-copper" aria-hidden="true" />
          {t(contact.label, locale)}
        </p>
        {/* phones get a smaller minimum so a long word ("Construisons") still fits the box at 320px */}
        <h2
          id="contact-title"
          data-reveal="lines"
          className="mt-6 text-[clamp(2.3rem,11.5vw,3rem)] font-medium leading-[0.96] tracking-[-0.045em] text-paper md:text-[clamp(3rem,8.2vw,8.6rem)]"
        >
          <Rich text={t(contact.heading, locale)} />
        </h2>
        <p data-reveal className="mt-8 max-w-[44ch] text-lg leading-relaxed text-paper/70 md:text-xl">
          {t(contact.text, locale)}
        </p>

        <div data-reveal className="mt-12 flex flex-wrap items-baseline gap-x-6 gap-y-5 border-t border-line pt-8">
          <span className="label-mono text-mute">{t(contact.emailLabel, locale)}</span>
          {/* wraps before the @ if it has to, never in the middle of a word */}
          <a
            href={`mailto:${person.email}`}
            className="link-underline text-[clamp(1.15rem,2.5vw,2.1rem)] tracking-[-0.02em] text-paper [overflow-wrap:anywhere]"
          >
            {user}
            <wbr />@{domain}
          </a>
          <CopyEmail
            copy={t(contact.copy, locale)}
            copied={t(contact.copied, locale)}
            label={t(contact.copyLabel, locale)}
            status={t(contact.copiedStatus, locale)}
          />
        </div>

        <div data-reveal className="mt-10 flex flex-wrap gap-3 md:gap-4">
          <Magnetic>
            <a href={person.cv} download className="btn btn-primary">
              {t(contact.cvLabel, locale)} <span aria-hidden="true">↓</span>
              <span className="sr-only"> (PDF)</span>
            </a>
          </Magnetic>
          {person.socials.map((s) => (
            <Magnetic key={s.href}>
              <a href={s.href} target="_blank" rel="noreferrer" className="btn">
                {s.label} <span aria-hidden="true">↗</span>
                <span className="sr-only"> {t(ui.newTab, locale)}</span>
              </a>
            </Magnetic>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Copies the address. Falls back to the old copy command where the Clipboard API is missing
 *  (plain-http previews, older browsers); if both fail, the address is selected for a manual copy. */
function CopyEmail({ copy, copied, label, status }: { copy: string; copied: string; label: string; status: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef(0);

  const fallback = () => {
    const field = document.createElement("textarea");
    field.value = person.email;
    field.setAttribute("readonly", "");
    // 16px so iOS doesn't zoom; focus + an explicit range because iOS ignores select() on its own.
    field.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none;font-size:16px";
    document.body.appendChild(field);
    field.focus({ preventScroll: true });
    field.select();
    field.setSelectionRange(0, field.value.length);
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {}
    field.remove();
    return ok;
  };

  const onCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    let ok = false;
    try {
      await navigator.clipboard.writeText(person.email);
      ok = true;
    } catch {
      ok = fallback();
      button.focus({ preventScroll: true }); // the fallback borrowed focus
    }
    if (!ok) {
      const link = document.querySelector<HTMLAnchorElement>(`#contact a[href^="mailto:"]`);
      if (link) window.getSelection()?.selectAllChildren(link);
      return;
    }
    setDone(true);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setDone(false), 1800);
  };

  return (
    <>
      {/* Both labels share one cell, so the pill keeps its width when it switches to "Copied". */}
      <button
        type="button"
        onClick={onCopy}
        aria-label={label}
        className="tap-area label-mono grid min-h-11 items-center rounded-full border border-line px-4 text-paper/80 transition-colors hover:border-copper hover:text-copper"
      >
        <span className={`col-start-1 row-start-1 text-center ${done ? "invisible" : ""}`}>{copy}</span>
        <span className={`col-start-1 row-start-1 text-center ${done ? "" : "invisible"}`}>
          {copied} <span aria-hidden="true">✓</span>
        </span>
      </button>
      <span role="status" className="sr-only">
        {done ? status : ""}
      </span>
    </>
  );
}
