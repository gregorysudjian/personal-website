import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { hero, person } from "@/content/site";
import { isLocale, locales, t } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/* The preview card shown when the link is shared (WhatsApp, LinkedIn, iMessage…). */

export const alt = `${person.name} — Computer Engineering, McGill`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fonts = join(process.cwd(), "node_modules/geist/dist/fonts");

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "en";
  const [sans, mono] = await Promise.all([
    readFile(join(fonts, "geist-sans/Geist-SemiBold.ttf")),
    readFile(join(fonts, "geist-mono/GeistMono-Regular.ttf")),
  ]);

  const ink = "#0b0c0e";
  const paper = "#edebe6";
  const mute = "#8a8f98";
  const copper = "#e8823a";
  const line = "#2a2d33";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: ink,
          backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          fontFamily: "Geist",
          color: paper,
        }}
      >
        {/* soften the grid toward the edges + copper horizon glow (one gradient per layer: the image
            renderer drops a background with two) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(11,12,14,0.55), ${ink} 85%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: "radial-gradient(ellipse at 70% 60%, rgba(232,130,58,0.18), transparent 55%)",
          }}
        />

        {/* the copper trace: down the left rail, across into the name */}
        <svg width="1200" height="630" style={{ position: "absolute", inset: 0 }}>
          <path d="M40 0 V300 L90 350 H150" stroke={copper} strokeWidth="3" fill="none" />
          <path d="M40 0 V300 L90 350 H150" stroke={copper} strokeOpacity="0.2" strokeWidth="12" fill="none" />
          <rect x="144" y="344" width="12" height="12" fill={copper} />
          <path d="M40 360 V630" stroke={line} strokeWidth="2" fill="none" />
          <path d="M960 630 V560 L1010 510 H1200" stroke={line} strokeWidth="2" fill="none" />
          <path d="M1040 630 V590 L1070 560 H1200" stroke={line} strokeWidth="2" fill="none" />
          <circle cx="1010" cy="510" r="5" fill={ink} stroke={mute} strokeWidth="2" />
        </svg>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 80px 60px 190px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "Geist Mono", fontSize: 22, letterSpacing: 4, color: mute }}>
            <div style={{ width: 40, height: 2, background: copper }} />
            {t(hero.eyebrow, locale).toUpperCase()}
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontSize: 150, lineHeight: 0.84, letterSpacing: -7 }}>
            <span>{person.firstName.toUpperCase()}</span>
            <span style={{ alignSelf: "flex-end", marginRight: 60 }}>{person.lastName.toUpperCase()}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "Geist Mono", fontSize: 22, letterSpacing: 3, color: paper }}>
            <div style={{ width: 10, height: 10, borderRadius: 10, background: copper }} />
            {t(hero.status, locale).toUpperCase()}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: sans, style: "normal", weight: 600 },
        { name: "Geist Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
