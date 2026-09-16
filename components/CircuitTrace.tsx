"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, REDUCED_MOTION } from "@/lib/gsap";
import { offsetWithin, railX, routes, type Pt, type RouteName } from "@/lib/routes";

type Props = {
  route: RouteName; // which path to draw (see lib/routes.ts)
  anchor?: string; // the viewport line the glowing tip travels along
  /** Elements in this section that get a pad on the rail and "power on" when the signal reaches them. */
  padsAt?: string;
  /** Called when the signal reaches the end of this segment (true) or retreats from it (false). */
  onPowered?: (on: boolean) => void;
  className?: string;
};

type Geo = { w: number; h: number; pts: Pt[]; pads: Pt[]; targets: (HTMLElement | null)[] };

/* Horizontal runs cost less scroll than vertical ones, so the glowing tip stays
   close to the same height on screen while it travels. */
const HORIZONTAL_WEIGHT = 0.4;

/**
 * One segment of the copper trace. A dim "unpowered" track shows the route; a lit
 * copper line with a spark at its tip is drawn along it as the section scrolls by.
 * Only stroke-dashoffset and a transform change per frame.
 */
export default function CircuitTrace({ route, anchor = "62%", padsAt, onPowered, className = "" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const core = useRef<SVGPathElement>(null);
  const halo = useRef<SVGPathElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);
  const powered = useRef(onPowered);
  powered.current = onPowered;

  useEffect(() => {
    const el = wrap.current!;
    const section = el.parentElement!;
    let last = "";

    const measure = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const targets = padsAt ? Array.from(section.querySelectorAll<HTMLElement>(padsAt)) : [];
      // A pad sits level with a small label's copper dash, or on the top edge of a larger row.
      const tops = targets.map((t) => {
        const o = offsetWithin(t, section);
        return Math.round(o.h <= 48 ? o.y + o.h / 2 : o.y);
      });
      const key = `${w}x${h}:${tops.join(",")}`;
      if (!w || !h || key === last) return;
      last = key;

      const r = routes[route](w, h, el);
      const rx = railX(w);
      setGeo({
        w,
        h,
        pts: r.pts,
        pads: [...r.pads.map((i) => r.pts[i]), ...tops.map((y) => [rx, y] as Pt)],
        targets: [...r.pads.map(() => null), ...targets],
      });
    };

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    document.fonts.ready.then(() => measure());
    return () => ro.disconnect();
  }, [route, padsAt]);

  useGSAP(
    () => {
      if (!geo) return;
      const corePath = core.current!;
      const haloPath = halo.current!;
      const spark = head.current!;
      const padEls = Array.from(wrap.current!.querySelectorAll<HTMLElement>(".trace-pad"));

      const L = corePath.getTotalLength();
      const N = Math.max(2, Math.ceil(L / 6));
      const xs = new Float32Array(N + 1);
      const ys = new Float32Array(N + 1);
      const vs = new Float32Array(N + 1);
      let v = 0;
      for (let i = 0; i <= N; i++) {
        const p = corePath.getPointAtLength((L * i) / N);
        if (i > 0) v += Math.abs(p.y - ys[i - 1]) + Math.abs(p.x - xs[i - 1]) * HORIZONTAL_WEIGHT;
        xs[i] = p.x;
        ys[i] = p.y;
        vs[i] = v;
      }
      const V = v || 1;

      // Where along the trace each pad sits (nearest sample).
      const padAt = geo.pads.map(([px, py]) => {
        let best = 0;
        let bestD = Infinity;
        for (let i = 0; i <= N; i++) {
          const d = (xs[i] - px) ** 2 + (ys[i] - py) ** 2;
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        }
        return vs[best];
      });

      const setPad = (k: number, on: boolean) => {
        padEls[k]?.classList.toggle("is-on", on);
        geo.targets[k]?.classList.toggle("is-powered", on);
      };

      const setDraw = (len: number) => {
        const off = String(L - len);
        corePath.style.strokeDashoffset = off;
        haloPath.style.strokeDashoffset = off;
      };

      for (const p of [corePath, haloPath]) p.style.strokeDasharray = `${L} ${L + 2}`;

      const mm = gsap.matchMedia();
      mm.add(REDUCED_MOTION, () => {
        setDraw(L);
        geo.pads.forEach((_, k) => setPad(k, true));
        powered.current?.(true);
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lit = geo.pads.map(() => false);
        let done = false;

        const render = (progress: number) => {
          const target = progress * V;
          let lo = 0;
          let hi = N;
          while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (vs[mid] < target) lo = mid + 1;
            else hi = mid;
          }
          const i = Math.max(1, lo);
          const span = vs[i] - vs[i - 1] || 1;
          const f = Math.min(1, Math.max(0, (target - vs[i - 1]) / span));
          setDraw(((i - 1 + f) / N) * L);

          const x = xs[i - 1] + (xs[i] - xs[i - 1]) * f;
          const y = ys[i - 1] + (ys[i] - ys[i - 1]) * f;
          spark.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          spark.style.opacity = progress > 0.001 && progress < 0.999 ? "1" : "0";

          padAt.forEach((at, k) => {
            const on = target >= at - 0.5;
            if (on !== lit[k]) {
              lit[k] = on;
              setPad(k, on);
            }
          });

          const end = progress >= 0.995;
          if (end !== done) {
            done = end;
            powered.current?.(end);
          }
        };

        // Drawing starts when the route's first point reaches the anchor line and ends with its last.
        const yStart = geo.pts[0][1];
        const yEnd = geo.pts[geo.pts.length - 1][1];
        const st = ScrollTrigger.create({
          trigger: wrap.current,
          start: `top+=${yStart} ${anchor}`,
          end: `top+=${yEnd} ${anchor}`,
          onUpdate: (self) => render(self.progress),
          onRefresh: (self) => render(self.progress),
        });
        render(st.progress);
      });

      return () => mm.revert();
    },
    { dependencies: [geo], scope: wrap, revertOnUpdate: true },
  );

  const d = geo ? "M" + geo.pts.map(([x, y]) => `${x} ${y}`).join(" L") : "";

  return (
    <div ref={wrap} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {geo && (
        <>
          <svg
            width={geo.w}
            height={geo.h}
            viewBox={`0 0 ${geo.w} ${geo.h}`}
            className="absolute inset-0 overflow-visible"
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path d={d} stroke="var(--color-line)" strokeWidth="1" />
            <path ref={halo} d={d} stroke="var(--color-copper)" strokeOpacity="0.16" strokeWidth="7" />
            <path ref={core} d={d} stroke="var(--color-copper)" strokeWidth="1.5" />
          </svg>
          {geo.pads.map(([x, y], k) => (
            <span key={k} className="trace-pad" style={{ left: x, top: y }} />
          ))}
          <div ref={head} className="trace-head" />
        </>
      )}
    </div>
  );
}
