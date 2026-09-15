import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import { person } from "@/content/site";
import Mark from "@/components/Mark";

/* Any URL the site doesn't have. The language is unknown here, so it speaks both. */

export const metadata: Metadata = {
  title: `404 — ${person.name}`,
  robots: { index: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0e",
  colorScheme: "dark",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-grid relative min-h-svh">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent,var(--color-ink)_70%)]" />
        <main className="gutter relative flex min-h-svh flex-col justify-center py-24">
          <a href="/en" className="tap-area mb-16 flex w-fit items-center gap-3 text-paper" aria-label={person.name}>
            <Mark className="h-6 w-6" />
            <span className="label-mono">{person.name}</span>
          </a>
          <p className="label-mono flex items-center gap-3 text-mute">
            <span className="h-px w-8 bg-copper" aria-hidden="true" />
            Error 404
          </p>
          <h1 className="mt-6 text-[clamp(2.6rem,7vw,6rem)] font-medium leading-[1.02] tracking-[-0.04em] text-paper">
            Page not found.
            <span lang="fr" className="block text-mute">
              Page introuvable.
            </span>
          </h1>
          <div className="mt-12 flex flex-wrap gap-3">
            <a href="/en" hrefLang="en" className="btn btn-primary">
              Back to the site <span aria-hidden="true">→</span>
            </a>
            <a href="/fr" hrefLang="fr" lang="fr" className="btn">
              Retour au site <span aria-hidden="true">→</span>
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
