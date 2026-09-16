"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, REDUCED_MOTION } from "@/lib/gsap";
import { generateBoard, type BoardTrace, type Rect } from "@/lib/board";
import { offsetWithin, railX } from "@/lib/routes";

/**
 * The finale: a whole circuit board wired around the contact box. It sits dark until
 * the main copper trace plugs in, then every trace lights up, rippling outward from
 * where the signal arrived.
 */
export default function Board({ powered }: { powered: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const wasPowered = useRef(false);
  const [geo, setGeo] = useState<{ w: number; h: number; chip: Rect; traces: BoardTrace[] } | null>(null);

  useEffect(() => {
    const section = root.current!.parentElement!;
    const chipEl = section.querySelector<HTMLElement>("[data-chip]");
    if (!chipEl) return;
    let last = "";
    const measure = () => {
      const w = section.offsetWidth;
      const h = section.offsetHeight;
      const chip = offsetWithin(chipEl, section);
      const key = `${w}x${h}:${chip.x},${chip.y},${chip.w},${chip.h}`;
      if (key === last) return;
      last = key;
      const entryY = Math.round(chip.y + Math.min(chip.h * 0.5, 180)); // matches contactRoute
      setGeo({ w, h, chip, traces: generateBoard(w, h, chip, railX(w), entryY) });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    ro.observe(chipEl);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!geo) return;
      const q = gsap.utils.selector(root);
      const instant = window.matchMedia(REDUCED_MOTION).matches;
      const lit = q(".board-lit");
      const pads = q(".board-pad");
      // Already lit and only the size changed (resize/rotation): show the new board lit, don't replay it.
      const replay = !(powered && wasPowered.current);
      wasPowered.current = powered;

      if (powered && !replay) {
        gsap.set(lit, { strokeDashoffset: 0 });
        gsap.set(pads, { fill: "#e8823a", stroke: "#ffb27a" });
        gsap.set(q(".board-glow, .board-pulses"), { autoAlpha: 1 });
      } else if (powered) {
        gsap.to(lit, {
          strokeDashoffset: 0,
          duration: instant ? 0 : 1.1,
          ease: "power2.out",
          stagger: instant ? 0 : { each: 0.014 },
          overwrite: true,
        });
        gsap.to(pads, {
          fill: "#e8823a",
          stroke: "#ffb27a",
          duration: instant ? 0 : 0.4,
          stagger: instant ? 0 : { each: 0.014 },
          delay: instant ? 0 : 0.7,
          overwrite: true,
        });
        gsap.to(q(".board-glow, .board-pulses"), { autoAlpha: 1, duration: instant ? 0 : 1.6, delay: instant ? 0 : 0.4, overwrite: true });
      } else {
        gsap.to(lit, { strokeDashoffset: 1, duration: 0.5, ease: "power2.in", overwrite: true });
        gsap.to(pads, { fill: "#0b0c0e", stroke: "#3a3e46", duration: 0.3, overwrite: true });
        gsap.to(q(".board-glow, .board-pulses"), { autoAlpha: 0, duration: 0.4, overwrite: true });
      }
    },
    { dependencies: [powered, geo], scope: root },
  );

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {geo && (
        <>
          <div
            className="board-glow invisible absolute h-[70vh] w-[110vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(232_130_58/0.16),transparent)] opacity-0"
            style={{ left: geo.chip.x + geo.chip.w / 2, top: geo.chip.y + geo.chip.h / 2 }}
          />
          <svg width={geo.w} height={geo.h} className="absolute inset-0" fill="none" strokeLinejoin="round">
            <g stroke="var(--color-line)">
              {geo.traces.map((tr, i) => (
                <path key={i} d={tr.d} />
              ))}
            </g>
            <g stroke="var(--color-copper)" strokeWidth="1.5" strokeOpacity="0.85">
              {geo.traces.map((tr, i) => (
                <path key={i} d={tr.d} pathLength={1} strokeDasharray="1 1" strokeDashoffset="1" className="board-lit" />
              ))}
            </g>
            <g className="board-pulses invisible opacity-0" stroke="var(--color-copper-glow)" strokeWidth="2" strokeLinecap="round">
              {geo.traces
                .filter((tr) => tr.pulse)
                .map((tr, i) => (
                  <path
                    key={i}
                    d={tr.d}
                    pathLength={1000}
                    className="pulse"
                    style={{ "--dur": `${3 + (i % 5) * 0.7}s`, "--delay": `${(i % 7) * 0.45}s` } as React.CSSProperties}
                  />
                ))}
            </g>
            <g strokeWidth="1.25">
              {geo.traces
                .filter((tr) => tr.pad)
                .map((tr, i) => (
                  <circle key={i} cx={tr.end[0]} cy={tr.end[1]} r="3.5" fill="#0b0c0e" stroke="#3a3e46" className="board-pad" />
                ))}
            </g>
          </svg>
        </>
      )}
    </div>
  );
}
