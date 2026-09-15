import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";
import "lenis/dist/lenis.css";
import "../globals.css";

import { isLocale, locales, t } from "@/lib/i18n";
import { siteUrl } from "@/lib/site-url";
import { meta, person, ui } from "@/content/site";
import SmoothScroll from "@/components/SmoothScroll";
import Boot from "@/components/Boot";
import Nav from "@/components/Nav";
import Cursor from "@/components/motion/Cursor";
import ScrollProgress from "@/components/motion/ScrollProgress";

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const title = t(meta.title, locale);
  const description = t(meta.description, locale);
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    authors: [{ name: person.name }],
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", fr: "/fr", "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      siteName: person.name,
      title,
      description,
      locale: locale === "fr" ? "fr_CA" : "en_CA",
      alternateLocale: locale === "fr" ? "en_CA" : "fr_CA",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const viewport: Viewport = {
  themeColor: "#0b0c0e",
  colorScheme: "dark",
};

/* Runs before first paint: flags JS, and skips the boot sequence on repeat visits, when the visitor
   prefers reduced motion, or when the link points at a section (#projects…) so it can land there. */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('gs-booted')||location.hash||matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('booted')}catch(e){d.classList.add('booted')}})();`;

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={locale === "fr" ? "fr-CA" : "en-CA"}
      className={`${GeistSans.variable} ${GeistMono.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link label-mono">
          {t(ui.skipToContent, locale)}
        </a>
        <SmoothScroll />
        <Boot />
        <Nav locale={locale} />
        {children}
        <ScrollProgress />
        <Cursor />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
