"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { t, type Locale } from "@/lib/i18n";
import { about, person } from "@/content/site";

const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/** A component datasheet for Gregory, the "part". Tilts toward the cursor with a moving glare. */
export default function Datasheet({ locale }: { locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const ds = about.datasheet;

  useGSAP(
    () => {
      const el = root.current!;
      const c = card.current!;
      const mm = gsap.matchMedia();
      mm.add(QUERY, () => {
        gsap.set(c, { transformPerspective: 1100 });
        const rx = gsap.quickTo(c, "rotationX", { duration: 0.9, ease: "power3" });
        const ry = gsap.quickTo(c, "rotationY", { duration: 0.9, ease: "power3" });

        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          ry((x - 0.5) * 16);
          rx(-(y - 0.5) * 12);
          c.style.setProperty("--gx", `${x * 100}%`);
          c.style.setProperty("--gy", `${y * 100}%`);
        };
        const leave = () => {
          rx(0);
          ry(0);
          gsap.to(c, { "--gx": "50%", "--gy": "0%", duration: 0.9, ease: "power3" });
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="datasheet mx-auto w-full max-w-[500px] lg:mx-0 2xl:max-w-[560px] short:max-w-[360px]">
      <div
        ref={card}
        role="group"
        aria-labelledby="datasheet-title"
        className="datasheet-card relative overflow-hidden rounded-[6px] border border-line bg-graphite/70 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)]"
      >
        <div className="bg-grid absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div className="datasheet-glare pointer-events-none absolute inset-0" />

        <div className="relative flex items-center justify-between border-b border-line px-5 py-4">
          <span id="datasheet-title" className="label-mono text-paper">
            {t(ds.title, locale)}
          </span>
          <span className="label-mono text-copper" aria-hidden="true">
            {ds.part}
          </span>
        </div>

        <div className="relative flex aspect-[5/4] items-center justify-center border-b border-line">
          {/* the chip drawing sits behind the portrait: it shows while the photo loads (or if it can't) */}
          {person.photo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Chip />
            </div>
          )}
          {person.photo ? (
            <Image
              src={person.photo.src}
              alt={t(person.photo.alt, locale)}
              fill
              sizes="(min-width: 768px) 500px, 90vw"
              className="object-cover object-[50%_35%]"
            />
          ) : (
            <Chip />
          )}
        </div>

        <dl className="relative divide-y divide-line">
          {ds.rows.map((row) => (
            <div key={t(row.label, locale)} className="grid grid-cols-[5.5rem_1fr] items-center gap-4 px-4 py-3.5 sm:grid-cols-[7rem_1fr] sm:px-5">
              <dt className="label-mono text-mute">{t(row.label, locale)}</dt>
              <dd className="flex items-center gap-2 text-sm text-paper">
                <span>{t(row.value, locale)}</span>
                {row.label.en === "Status" && <span className="status-dot ml-1" aria-hidden="true" />}
              </dd>
            </div>
          ))}
        </dl>

        <div className="relative flex items-end justify-between gap-6 border-t border-line px-5 py-4">
          <p className="max-w-[34ch] text-balance font-mono text-[0.68rem] uppercase leading-relaxed tracking-[0.12em] text-mute">
            {t(ds.footer, locale)}
          </p>
          <Barcode />
        </div>
      </div>
    </div>
  );
}

/** Line-art microchip with a pulsing copper core and pins that light up in turn. */
function Chip() {
  const pins = Array.from({ length: 7 }, (_, i) => 70 + i * 20);
  return (
    <svg viewBox="0 0 260 260" className="relative h-[72%] w-auto" fill="none" aria-hidden="true">
      <g className="chip-pins" stroke="var(--color-trace)" strokeWidth="2" strokeLinecap="round">
        {pins.map((p, i) => (
          <g key={p} style={{ "--i": i } as React.CSSProperties}>
            <path d={`M${p} 38V58`} />
            <path d={`M${p} 202V222`} />
            <path d={`M38 ${p}H58`} />
            <path d={`M202 ${p}H222`} />
          </g>
        ))}
      </g>
      <rect x="58" y="58" width="144" height="144" rx="8" fill="var(--color-ink)" stroke="var(--color-paper)" strokeOpacity="0.7" />
      <rect x="70" y="70" width="120" height="120" rx="4" stroke="var(--color-line)" strokeDasharray="3 5" />
      <circle cx="76" cy="76" r="3" fill="var(--color-mute)" />
      <rect className="chip-core" x="104" y="104" width="52" height="52" rx="2" fill="var(--color-copper)" />
      <text x="130" y="176" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="2" fill="var(--color-mute)">
        GS-26
      </text>
    </svg>
  );
}

function Barcode() {
  const bars = [2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3];
  let x = 0;
  return (
    <svg viewBox="0 0 64 24" className="h-6 w-16 shrink-0" aria-hidden="true">
      {bars.map((w, i) => {
        const rect = i % 2 === 0 ? <rect key={i} x={x} y="0" width={w} height="24" fill="var(--color-mute)" /> : null;
        x += w + 1;
        return rect;
      })}
    </svg>
  );
}
