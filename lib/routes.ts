/* Routes for the copper trace. Each section draws its own segment; they line up
   because every segment enters and leaves on the same "rail" (x) as its neighbours. */

export type Pt = [number, number];
/** Returns the trace's points (px, relative to its section) and which points get a solder pad. */
export type Route = (w: number, h: number, wrap: HTMLElement) => { pts: Pt[]; pads: number[] };

/** The left rail sits in the middle of the page gutter. */
export function railX(w: number) {
  const gutter = Math.min(56, Math.max(24, w * 0.04));
  return Math.round(gutter / 2);
}

/** Layout position of `el` inside `ancestor`, ignoring transforms (so reveal animations don't skew it). */
export function offsetWithin(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

function clean(pts: Pt[]) {
  return pts.filter((p, i) => i === 0 || p[0] !== pts[i - 1][0] || p[1] !== pts[i - 1][1]);
}

/** Starts under the hero's "scroll to power on" wire, then runs across and down onto the rail. */
export const heroRoute: Route = (w, h) => {
  const vh = window.innerHeight;
  const cx = Math.round(w / 2);
  const r = railX(w);
  const y0 = w < 768 ? vh + 24 : vh - 30;
  const yA = y0 + 36;
  const span = cx - r;
  const diag = Math.min(span, Math.max(0, h - yA - 48));
  const flat = span - diag;
  const pts = clean([
    [cx, y0],
    [cx, yA],
    [cx - flat, yA],
    [r, yA + diag],
    [r, h],
  ]);
  return { pts, pads: [0, pts.length - 2] };
};

/** Straight down the rail. */
export const railRoute: Route = (w, h) => {
  const r = railX(w);
  return { pts: [[r, 0], [r, h]], pads: [] };
};

/** Down the rail, then a 45° bend into the left edge of the contact "chip". */
export const contactRoute: Route = (w, h, wrap) => {
  const section = wrap.parentElement!;
  const chip = section.querySelector<HTMLElement>("[data-chip]");
  if (!chip) return railRoute(w, h, wrap);
  const r = railX(w);
  const c = offsetWithin(chip, section);
  const ty = Math.round(c.y + Math.min(c.h * 0.5, 180));
  const tx = Math.round(c.x) - 5; // the end pad sits just outside the chip's border, not half under it
  const d = Math.max(0, Math.min(tx - r, 64));
  const pts = clean([
    [r, 0],
    [r, ty - d],
    [r + d, ty],
    [tx, ty],
  ]);
  return { pts, pads: [pts.length - 1] };
};

/** Routes are picked by name so server components can choose one for a client component. */
export const routes = { hero: heroRoute, rail: railRoute, contact: contactRoute } satisfies Record<string, Route>;
export type RouteName = keyof typeof routes;
