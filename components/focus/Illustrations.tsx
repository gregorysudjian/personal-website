"use client";

import { useRef } from "react";
import { gsap, useGSAP, REDUCED_MOTION } from "@/lib/gsap";
import { playWhenVisible } from "@/lib/visible";

/* Three living drawings for the Focus panels. Each plays a few times while visible, then rests. */

/* ----------------------------------------------------------- math plot */

// A sine curve on a small grid: x from X0 to X1 in pixels, one unit = U pixels.
const X0 = 60;
const X1 = 350;
const Y0 = 200;
const AMP = 84;
const U = 46;
const fx = (x: number) => Y0 - AMP * Math.sin((x - X0) / U);
const slope = (x: number) => -(AMP / U) * Math.cos((x - X0) / U); // dy/dx in screen space
const CURVE = (() => {
  let d = "";
  for (let x = X0; x <= X1; x += 3) d += (x === X0 ? "M" : "L") + x + " " + fx(x).toFixed(1);
  return d;
})();

export function MathPlot() {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const svg = root.current!;
      const dot = svg.querySelector<SVGCircleElement>(".m-dot")!;
      const tangent = svg.querySelector<SVGLineElement>(".m-tangent")!;
      const dropX = svg.querySelector<SVGLineElement>(".m-drop-x")!;
      const dropY = svg.querySelector<SVGLineElement>(".m-drop-y")!;
      const readX = svg.querySelector<SVGTextElement>(".m-read-x")!;
      const readD = svg.querySelector<SVGTextElement>(".m-read-d")!;

      // Puts the point, its tangent and the readouts at screen x.
      const place = (x: number) => {
        const y = fx(x);
        const m = slope(x);
        const len = 46 / Math.sqrt(1 + m * m);
        dot.setAttribute("cx", x.toFixed(1));
        dot.setAttribute("cy", y.toFixed(1));
        tangent.setAttribute("x1", (x - len).toFixed(1));
        tangent.setAttribute("y1", (y - len * m).toFixed(1));
        tangent.setAttribute("x2", (x + len).toFixed(1));
        tangent.setAttribute("y2", (y + len * m).toFixed(1));
        dropX.setAttribute("x1", x.toFixed(1));
        dropX.setAttribute("x2", x.toFixed(1));
        dropX.setAttribute("y1", y.toFixed(1));
        dropY.setAttribute("y1", y.toFixed(1));
        dropY.setAttribute("y2", y.toFixed(1));
        dropY.setAttribute("x2", x.toFixed(1));
        readX.textContent = "x = " + ((x - X0) / U).toFixed(2);
        readD.textContent = "f′(x) = " + Math.cos((x - X0) / U).toFixed(2);
      };

      const start = X0 + U * (Math.PI / 2);
      place(start);
      if (window.matchMedia(REDUCED_MOTION).matches) return;

      const state = { x: X0 };
      const tl = gsap.timeline({ repeat: 2, paused: true });
      tl.set(q(".m-point"), { autoAlpha: 0 })
        .fromTo(q(".m-curve"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" })
        .add(() => {
          state.x = X0;
          place(X0);
        })
        .to(q(".m-point"), { autoAlpha: 1, duration: 0.3 })
        .to(state, { x: X1, duration: 5, ease: "sine.inOut", onUpdate: () => place(state.x) })
        .to(state, { x: X0, duration: 5, ease: "sine.inOut", onUpdate: () => place(state.x) })
        .to(q(".m-point"), { autoAlpha: 0, duration: 0.3 });
      return playWhenVisible(root.current!, tl);
    },
    { scope: root },
  );

  const grid = [];
  for (let x = X0; x <= X1; x += U / 2) grid.push(<path key={"v" + x} d={"M" + x + " 90V310"} />);
  for (let y = 110; y <= 290; y += U / 2) grid.push(<path key={"h" + y} d={"M" + X0 + " " + y + "H" + X1} />);

  return (
    <svg ref={root} viewBox="0 0 400 400" fill="none" className="h-full w-full" aria-hidden="true">
      <g stroke="var(--color-line)" strokeWidth="0.75" opacity="0.6">
        {grid}
      </g>
      {/* axes */}
      <path d={"M" + X0 + " " + Y0 + "H" + (X1 + 14)} stroke="var(--color-mute)" />
      <path d={"M" + X0 + " 318V82"} stroke="var(--color-mute)" />
      <path d={"M" + (X1 + 14) + " " + Y0 + "l-6 -4v8z"} fill="var(--color-mute)" />
      <path d={"M" + X0 + " 82l-4 6h8z"} fill="var(--color-mute)" />
      <text x={X1 + 8} y={Y0 + 18} fontFamily="var(--font-mono)" fontSize="11" fill="var(--color-mute)">x</text>
      <text x={X0 - 16} y="90" fontFamily="var(--font-mono)" fontSize="11" fill="var(--color-mute)">y</text>

      <path d={CURVE} pathLength={1} strokeDasharray="1 1" className="m-curve" stroke="var(--color-paper)" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" />

      <g className="m-point">
        <line className="m-drop-x" y2={Y0} stroke="var(--color-copper)" strokeOpacity="0.5" strokeDasharray="3 4" />
        <line className="m-drop-y" x1={X0} stroke="var(--color-copper)" strokeOpacity="0.5" strokeDasharray="3 4" />
        <line className="m-tangent" stroke="var(--color-copper)" strokeWidth="2" strokeLinecap="round" />
        <circle className="m-dot" r="6" fill="var(--color-ink)" stroke="var(--color-copper)" strokeWidth="2.5" />
      </g>

      <text x={X0} y="52" fontFamily="var(--font-mono)" fontSize="13" fill="var(--color-paper)">f(x) = sin x</text>
      <text className="m-read-x" x={X0} y="352" fontFamily="var(--font-mono)" fontSize="11" fill="var(--color-mute)" />
      <text className="m-read-d" x={X0 + 120} y="352" fontFamily="var(--font-mono)" fontSize="11" fill="var(--color-copper)" />
    </svg>
  );
}

/* ----------------------------------------------------------- code window */

type Tok = [string, "k" | "f" | "s" | "p" | "c"];
const CODE: Tok[][] = [
  [["def ", "k"], ["run_agent", "f"], ["(task):", "p"]],
  [["    context = ", "p"], ["memory", "s"], [".recall(task)", "p"]],
  [["    plan = ", "p"], ["model", "s"], [".think(task, context)", "p"]],
  [["    ", "p"], ["for ", "k"], ["step ", "p"], ["in ", "k"], ["plan:", "p"]],
  [["        result = ", "p"], ["tools", "s"], [".use(step)", "p"]],
  [["        ", "p"], ["memory", "s"], [".save(step, result)", "p"]],
  [["    ", "p"], ["return ", "k"], ["plan.summary()", "p"]],
  [["# → done. ship it.", "c"]],
];
const TOK_CLASS = { k: "text-copper", f: "text-paper", s: "text-copper-glow/80", p: "text-paper/60", c: "text-mute" };

export function CodeWindow() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia(REDUCED_MOTION).matches) return;
      const lines = gsap.utils.toArray<HTMLElement>(".code-line", root.current);
      gsap.set(lines, { clipPath: "inset(0 100% 0 0)" });
      const tl = gsap.timeline({ repeat: 2, repeatDelay: 1.2, paused: true });
      lines.forEach((line) => {
        const n = line.textContent?.length ?? 10;
        tl.to(line, { clipPath: "inset(0 0% 0 0)", duration: n * 0.035, ease: `steps(${n})` }, "+=0.12");
      });
      // Between rounds the code clears; the last round leaves it on screen.
      tl.to(lines, { opacity: 0, duration: 0.4, delay: 2.2 }).set(lines, { clipPath: "inset(0 100% 0 0)", opacity: 1 });
      tl.eventCallback("onComplete", () => gsap.set(lines, { clipPath: "inset(0 0% 0 0)", opacity: 1 }));
      return playWhenVisible(root.current!, tl);
    },
    { scope: root },
  );

  return (
    // A picture of code, not content to read aloud; the panel around it already has its padding.
    <div ref={root} className="flex h-full w-full items-center justify-center" aria-hidden="true">
      <div className="@container w-full max-w-[460px] overflow-hidden rounded-md border border-line bg-ink shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)]">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="label-mono ml-3 text-[0.62rem] text-mute">agent.py</span>
        </div>
        {/* the code shrinks with its window (the longest line is ~37 characters); in a narrow window the
            line numbers step aside so it stays readable */}
        <pre className="overflow-hidden px-4 py-5 font-mono text-[clamp(0.45rem,calc((100cqi-4.25rem)/23),0.8rem)] leading-[1.9] @max-[20rem]:text-[clamp(0.45rem,calc((100cqi-2.25rem)/23),0.8rem)]">
          {CODE.map((line, i) => (
            <div key={i} className="flex">
              <span className="mr-4 w-4 shrink-0 select-none text-right text-line @max-[20rem]:hidden">{i + 1}</span>
              <span className="code-line whitespace-pre">
                {line.map(([text, kind], j) => (
                  <span key={j} className={TOK_CLASS[kind]}>
                    {text}
                  </span>
                ))}
              </span>
            </div>
          ))}
          <span className="caret ml-8 inline-block h-4 w-2 translate-y-0.5 bg-copper" />
        </pre>
      </div>
    </div>
  );
}

/* -------------------------------------------------------- neural network */

const LAYERS = [
  { x: 80, ys: [120, 200, 280] },
  { x: 200, ys: [90, 160, 240, 310] },
  { x: 320, ys: [160, 240] },
];

export function NeuralNet() {
  const root = useRef<SVGSVGElement>(null);
  const edges: { d: string; stage: number }[] = [];
  for (let l = 0; l < LAYERS.length - 1; l++) {
    for (const y1 of LAYERS[l].ys)
      for (const y2 of LAYERS[l + 1].ys) edges.push({ d: `M${LAYERS[l].x} ${y1}L${LAYERS[l + 1].x} ${y2}`, stage: l });
  }

  useGSAP(
    () => {
      if (window.matchMedia(REDUCED_MOTION).matches) return;
      const tl = gsap.timeline({ repeat: 2, repeatDelay: 0.6, paused: true });
      LAYERS.forEach((_, l) => {
        tl.to(`.node-${l}`, { fill: "#e8823a", stroke: "#ffb27a", duration: 0.25, stagger: 0.06 }, l * 1.1);
        tl.to(`.node-${l}`, { fill: "#0b0c0e", stroke: "#3a3e46", duration: 0.8, stagger: 0.06 }, l * 1.1 + 0.6);
        if (l < LAYERS.length - 1) {
          tl.fromTo(
            `.edge-${l}`,
            { strokeDashoffset: 24 },
            { strokeDashoffset: -100, duration: 0.9, ease: "power1.inOut", stagger: { each: 0.03, from: "random" } },
            l * 1.1 + 0.2,
          );
        }
      });
      return playWhenVisible(root.current!, tl);
    },
    { scope: root },
  );

  return (
    <svg ref={root} viewBox="0 0 400 400" fill="none" className="h-full w-full" aria-hidden="true">
      {edges.map((e, i) => (
        <path key={`b${i}`} d={e.d} stroke="var(--color-line)" />
      ))}
      {edges.map((e, i) => (
        <path
          key={`p${i}`}
          d={e.d}
          pathLength={100}
          strokeDasharray="24 200"
          strokeDashoffset="24"
          stroke="var(--color-copper)"
          strokeWidth="2"
          strokeLinecap="round"
          className={`edge-${e.stage}`}
        />
      ))}
      {LAYERS.map((layer, l) =>
        layer.ys.map((y) => (
          <circle key={`${l}-${y}`} cx={layer.x} cy={y} r="11" fill="#0b0c0e" stroke="#3a3e46" strokeWidth="2" className={`node-${l}`} />
        )),
      )}
      {["input", "hidden", "output"].map((label, l) => (
        <text key={label} x={LAYERS[l].x} y="360" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.5" fill="var(--color-mute)">
          {label.toUpperCase()}
        </text>
      ))}
    </svg>
  );
}
