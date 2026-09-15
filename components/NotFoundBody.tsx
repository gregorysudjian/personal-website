"use client";

import { useEffect, useState } from "react";
import { person } from "@/content/site";
import Mark from "./Mark";

const COPY = {
  en: { label: "Error 404", title: "Page not found.", back: "Back to the site" },
  fr: { label: "Erreur 404", title: "Page introuvable.", back: "Retour au site" },
};

/** The 404's content. It can't know the language from the server, so a French address (/fr/…)
 *  switches it to French first once it's in the browser. */
export default function NotFoundBody() {
  const [lang, setLang] = useState<"en" | "fr">("en");
  useEffect(() => {
    if (/^\/fr(\/|$)/.test(location.pathname)) {
      setLang("fr");
      document.documentElement.lang = "fr-CA";
    }
  }, []);
  const other = lang === "en" ? "fr" : "en";

  return (
    <main className="gutter relative flex min-h-svh flex-col justify-center py-24">
      <a href={`/${lang}`} className="tap-area mb-16 flex w-fit items-center gap-3 text-paper" aria-label={person.name}>
        <Mark className="h-6 w-6" />
        <span className="label-mono">{person.name}</span>
      </a>
      <p className="label-mono flex items-center gap-3 text-mute">
        <span className="h-px w-8 bg-copper" aria-hidden="true" />
        {COPY[lang].label}
      </p>
      <h1 className="mt-6 text-[clamp(2.6rem,7vw,6rem)] font-medium leading-[1.02] tracking-[-0.04em] text-paper">
        {COPY[lang].title}
        <span lang={other} className="block text-mute">
          {COPY[other].title}
        </span>
      </h1>
      <div className="mt-12 flex flex-wrap gap-3">
        <a href={`/${lang}`} hrefLang={lang} className="btn btn-primary">
          {COPY[lang].back} <span aria-hidden="true">→</span>
        </a>
        <a href={`/${other}`} hrefLang={other} lang={other} className="btn">
          {COPY[other].back} <span aria-hidden="true">→</span>
        </a>
      </div>
    </main>
  );
}
