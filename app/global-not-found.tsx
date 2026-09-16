import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import { person } from "@/content/site";
import NotFoundBody from "@/components/NotFoundBody";

/* Any URL the site doesn't have. It speaks both languages, French first on a /fr/… address. */

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
        <NotFoundBody />
      </body>
    </html>
  );
}
