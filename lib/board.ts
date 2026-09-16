import type { Pt } from "./routes";

export type Rect = { x: number; y: number; w: number; h: number };
export type BoardTrace = { d: string; end: Pt; pad: boolean; pulse: boolean; order: number };

/** Small deterministic PRNG so the board looks the same on every visit. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GAP = 22; // spacing between parallel traces
const BEND = 56; // length of each 45° bend

/**
 * Fans traces out from every side of the contact "chip", PCB style: each runs straight
 * out, bends 45° away from the middle, then carries on. Traces nearer a corner bend
 * sooner, so neighbours stay parallel and never cross. The left side stays clear of
 * the rail and of the point where the main trace plugs in.
 */
export function generateBoard(w: number, h: number, c: Rect, rail: number, entryY: number): BoardTrace[] {
  const rand = mulberry32(2026);
  const out: BoardTrace[] = [];
  const entry: Pt = [c.x, entryY];

  const add = (pts: Pt[], pad: boolean) => {
    const [sx, sy] = pts[0];
    out.push({
      d: "M" + pts.map(([x, y]) => `${Math.round(x)} ${Math.round(y)}`).join(" L"),
      end: pts[pts.length - 1],
      pad,
      pulse: out.length % 3 === 0,
      order: Math.hypot(sx - entry[0], sy - entry[1]),
    });
  };

  // Top (-1) and bottom (+1) edges.
  for (const side of [-1, 1] as const) {
    const y0 = side < 0 ? c.y : c.y + c.h;
    const room = side < 0 ? c.y : h - y0;
    if (room < 48) continue;
    const mid = c.x + c.w / 2;
    for (let x = c.x + 28; x <= c.x + c.w - 28; x += GAP) {
      if (rand() < 0.28) continue;
      const dir = x < mid ? -1 : 1;
      const out1 = 14 + (dir < 0 ? x - c.x : c.x + c.w - x) * 0.5;
      const xb = x + dir * BEND;
      if (out1 + BEND + 24 > room || xb < rail + 20 || xb > w - 8) {
        const len = Math.min(room - 14, 18 + rand() * room * 0.6);
        add([[x, y0], [x, y0 + side * len]], true);
        continue;
      }
      const yb = y0 + side * out1;
      const yd = yb + side * BEND;
      // Only the bottom side may run off the edge (into the footer); a top trace ending in open page
      // space under the skills looks cut, so it ends on a pad instead.
      const r = rand();
      const toEdge = side > 0 && r < 0.35;
      const remain = room - out1 - BEND;
      const yEnd = toEdge ? (side < 0 ? -4 : h + 4) : yd + side * (16 + rand() * Math.max(0, remain - 30));
      add([[x, y0], [x, yb], [xb, yd], [xb, yEnd]], !toEdge);
    }
  }

  // Left (-1) and right (+1) edges.
  for (const side of [-1, 1] as const) {
    const x0 = side < 0 ? c.x : c.x + c.w;
    const limit = side < 0 ? rail + 24 : w;
    const room = side < 0 ? x0 - limit : limit - x0;
    if (room < 48) continue;
    const split = side < 0 ? entryY : c.y + c.h / 2;
    for (let y = c.y + 28; y <= c.y + c.h - 28; y += GAP) {
      if (side < 0 && Math.abs(y - entryY) < 36) continue;
      if (rand() < 0.28) continue;
      const dir = y < split ? -1 : 1;
      const out1 = 14 + (dir < 0 ? y - c.y : c.y + c.h - y) * 0.5;
      const yb = y + dir * BEND;
      if (out1 + BEND + 24 > room || yb < 8 || yb > h - 8) {
        const len = Math.min(room - 14, 18 + rand() * room * 0.6);
        add([[x0, y], [x0 + side * len, y]], true);
        continue;
      }
      const xb = x0 + side * out1;
      const xd = xb + side * BEND;
      const toEdge = side > 0 && rand() < 0.35;
      const remain = room - out1 - BEND;
      const xEnd = toEdge ? w + 4 : xd + side * (16 + rand() * Math.max(0, remain - 30));
      add([[x0, y], [xb, y], [xd, yb], [xEnd, yb]], !toEdge);
    }
  }

  return out.sort((a, b) => a.order - b.order);
}
