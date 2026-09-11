"use client";

import { useState } from "react";
import { t, type Locale } from "@/lib/i18n";
import { contact, person } from "@/content/site";
import CircuitTrace from "../CircuitTrace";
import Magnetic from "../motion/Magnetic";
import Rich from "../Rich";
import Board from "./Board";

export default function Contact({ locale }: { locale: Locale }) {
  const [powered, setPowered] = useState(false);

  return (
    <section id="contact" className={`contact relative overflow-hidden gutter py-32 md:py-48 ${powered ? "is-powered" : ""}`}>
      <Board powered={powered} />
      <CircuitTrace route="contact" onPowered={setPowered} className="z-[1]" />

      <div
        data-chip
        className="chip-box relative z-[2] mx-auto max-w-5xl rounded-[6px] border border-line bg-ink/90 px-6 py-14 md:px-16 md:py-20"
      >
        <span className="chip-corner left-0 top-0 border-l border-t" aria-hidden="true" />
        <span className="chip-corner right-0 top-0 border-r border-t" aria-hidden="true" />
        <span className="chip-corner bottom-0 left-0 border-b border-l" aria-hidden="true" />
        <span className="chip-corner bottom-0 right-0 border-b border-r" aria-hidden="true" />

        <p data-reveal className="label-mono flex items-center gap-3 text-mute">
          <span className="h-px w-8 bg-copper" aria-hidden="true" />
          {t(contact.label, locale)}
        </p>
        <h2
          data-reveal="lines"
          className="mt-8 text-[clamp(3rem,8.2vw,8.6rem)] font-medium leading-[0.96] tracking-[-0.045em] text-paper"
        >
          <Rich text={t(contact.heading, locale)} />
        </h2>
        <p data-reveal className="mt-8 max-w-[44ch] text-lg leading-relaxed text-paper/70 md:text-xl">
          {t(contact.text, locale)}
        </p>

        <div data-reveal className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-8">
          <span className="label-mono text-mute">{t(contact.emailLabel, locale)}</span>
          <a
            href={`mailto:${person.email}`}
            className="link-underline break-all text-[clamp(1.15rem,2.5vw,2.1rem)] tracking-[-0.02em] text-paper"
          >
            {person.email}
          </a>
          <CopyEmail copy={t(contact.copy, locale)} copied={t(contact.copied, locale)} />
        </div>

        <div data-reveal className="mt-10 flex flex-wrap gap-3 md:gap-4">
          <Magnetic>
            <a href={person.cv} download className="btn btn-primary">
              {t(contact.cvLabel, locale)} <span aria-hidden="true">↓</span>
            </a>
          </Magnetic>
          {person.socials.map((s) => (
            <Magnetic key={s.href}>
              <a href={s.href} target="_blank" rel="noreferrer" className="btn">
                {s.label} <span aria-hidden="true">↗</span>
              </a>
            </Magnetic>
          ))}
        </div>
      </div>
    </section>
  );
}

function CopyEmail({ copy, copied }: { copy: string; copied: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard?.writeText(person.email).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        })
      }
      className="label-mono rounded-full border border-line px-3 py-2 text-mute transition-colors hover:border-copper hover:text-copper"
    >
      <span aria-live="polite">{done ? `${copied} ✓` : copy}</span>
    </button>
  );
}
