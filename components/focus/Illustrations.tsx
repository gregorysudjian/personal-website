"use client";

import { useRef } from "react";
import { gsap, useGSAP, REDUCED_MOTION } from "@/lib/gsap";
import { playWhenVisible } from "@/lib/visible";

/* Three living line drawings for the Focus panels. Each loops only while visible. */

/* ------------------------------------------------------------- robot arm */

export function RobotArm() {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia(REDUCED_MOTION).matches) return;
      const tl = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: "power2.inOut", duration: 1.6 } });
      tl.to(".arm-upper", { rotation: -28, svgOrigin: "200 300" }, 0)
        .to(".arm-fore", { rotation: 62, svgOrigin: "200 180" }, 0)
        .to(".arm-grip-l", { rotation: 18, svgOrigin: "200 86" }, 0.9)
        .to(".arm-grip-r", { rotation: -18, svgOrigin: "200 86" }, 0.9)
        .to(".arm-upper", { rotation: 22, svgOrigin: "200 300" }, 2)
        .to(".arm-fore", { rotation: -40, svgOrigin: "200 180" }, 2)
        .to(".arm-grip-l", { rotation: 0, svgOrigin: "200 86" }, 3)
        .to(".arm-grip-r", { rotation: 0, svgOrigin: "200 86" }, 3)
        .to(".arm-upper", { rotation: 0, svgOrigin: "200 300" }, 4)
        .to(".arm-fore", { rotation: 0, svgOrigin: "200 180" }, 4)
        .to(".arm-scan", { opacity: 1, duration: 0.3, yoyo: true, repeat: 3, ease: "none" }, 4.2);
      return playWhenVisible(root.current!, tl);
    },
    { scope: root },
  );

  return (
    <svg ref={root} viewBox="0 0 400 400" fill="none" className="h-full w-full" aria-hidden="true">
      {/* rotation range guides */}
      <path d="M130 300a70 70 0 0 1 140 0" stroke="var(--color-line)" strokeDasharray="2 6" />
      <path d="M150 180a50 50 0 0 1 100 0" stroke="var(--color-line)" strokeDasharray="2 6" />
      <text x="282" y="304" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-mute)">J1</text>
      <text x="262" y="184" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-mute)">J2</text>

      {/* ground + base */}
      <path d="M60 340H340" stroke="var(--color-line)" />
      <path d="M70 348l10-8M90 348l10-8M110 348l10-8M290 348l10-8M310 348l10-8" stroke="var(--color-line)" />
      <rect x="150" y="306" width="100" height="34" rx="4" stroke="var(--color-paper)" strokeOpacity="0.7" />
      <path d="M165 323H235" stroke="var(--color-line)" />

      <g className="arm-upper">
        <rect x="186" y="172" width="28" height="136" rx="14" stroke="var(--color-paper)" strokeOpacity="0.8" />
        <path d="M200 200V280" stroke="var(--color-line)" strokeDasharray="3 4" />
        <g className="arm-fore">
          <rect x="189" y="80" width="22" height="108" rx="11" stroke="var(--color-paper)" strokeOpacity="0.8" />
          <g className="arm-grip-l">
            <path d="M196 86L184 62L190 48" stroke="var(--color-paper)" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
          </g>
          <g className="arm-grip-r">
            <path d="M204 86L216 62L210 48" stroke="var(--color-paper)" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
          </g>
          <path className="arm-scan" d="M200 50L170 10H230Z" fill="var(--color-copper)" fillOpacity="0.12" opacity="0" />
          <circle cx="200" cy="180" r="9" fill="var(--color-ink)" stroke="var(--color-copper)" strokeWidth="2" />
          <circle cx="200" cy="86" r="5" fill="var(--color-copper)" />
        </g>
      </g>
      <circle cx="200" cy="300" r="12" fill="var(--color-ink)" stroke="var(--color-copper)" strokeWidth="2" />
      <circle cx="200" cy="300" r="3" fill="var(--color-copper)" />
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
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2, paused: true });
      lines.forEach((line) => {
        const n = line.textContent?.length ?? 10;
        tl.to(line, { clipPath: "inset(0 0% 0 0)", duration: n * 0.035, ease: `steps(${n})` }, "+=0.12");
      });
      tl.to(lines, { opacity: 0, duration: 0.4, delay: 2.2 }).set(lines, { clipPath: "inset(0 100% 0 0)", opacity: 1 });
      return playWhenVisible(root.current!, tl);
    },
    { scope: root },
  );

  return (
    <div ref={root} className="flex h-full w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-[460px] overflow-hidden rounded-md border border-line bg-ink shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)]">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-copper/80" />
          <span className="label-mono ml-3 text-[0.62rem] text-mute">agent.py</span>
        </div>
        <pre className="overflow-hidden px-4 py-5 font-mono text-[0.72rem] leading-[1.9] md:text-[0.8rem]">
          {CODE.map((line, i) => (
            <div key={i} className="flex">
              <span className="mr-4 w-4 shrink-0 select-none text-right text-line">{i + 1}</span>
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
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, paused: true });
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
