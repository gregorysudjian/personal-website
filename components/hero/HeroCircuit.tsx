/* Decorative circuit-board traces behind the name. Two layouts: landscape and portrait. */

type Board = {
  viewBox: string;
  traces: string[];
  pads: [number, number][];
  pulses: { d: number; dur: string; delay: string }[]; // index into traces
};

const wide: Board = {
  viewBox: "0 0 1600 1000",
  // Kept to the bands between the eyebrow and the name, and between the name and the footer text.
  traces: [
    "M0 190 H250 L310 250 H560 L600 210 H790",
    "M0 262 H150 L187 225 H240",
    "M1600 178 H1330 L1283 225 H1060 L1020 185 H880",
    "M1600 262 H1440 L1400 222 H1345",
    "M0 790 H200 L250 740 H470",
    "M0 850 H300 L340 810 H560 L600 770 H700",
    "M1600 800 H1400 L1340 740 H1140",
    "M1600 868 H1300 L1250 818 H1060 L1020 858 H930",
  ],
  pads: [[790, 210], [240, 225], [880, 185], [1345, 222], [470, 740], [700, 770], [1140, 740], [930, 858]],
  pulses: [
    { d: 0, dur: "4.8s", delay: "0.4s" },
    { d: 2, dur: "5.4s", delay: "2.1s" },
    { d: 5, dur: "5s", delay: "1.2s" },
    { d: 7, dur: "5.8s", delay: "3s" },
  ],
};

const tall: Board = {
  viewBox: "0 0 400 900",
  traces: [
    "M0 92 H90 L130 132 H250",
    "M400 64 H310 L270 104 H190",
    "M0 176 H50 L90 216 H170",
    "M400 196 H330 L290 236 H240",
    "M0 690 H100 L140 650 H230",
    "M400 728 H300 L260 768 H170",
    "M0 812 H60 L100 852 H190",
    "M400 860 H330 L300 830 H250",
  ],
  pads: [[250, 132], [190, 104], [170, 216], [240, 236], [230, 650], [170, 768], [190, 852], [250, 830]],
  pulses: [
    { d: 0, dur: "4s", delay: "0.3s" },
    { d: 3, dur: "4.8s", delay: "1.8s" },
    { d: 5, dur: "4.4s", delay: "1s" },
  ],
};

function Svg({ board, className }: { board: Board; className: string }) {
  return (
    <svg
      viewBox={board.viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <g stroke="var(--color-trace)" strokeWidth="1.25" strokeLinejoin="round">
        {board.traces.map((d, i) => (
          <path key={i} d={d} pathLength={1000} className="hero-trace" />
        ))}
      </g>
      <g stroke="var(--color-copper)" strokeWidth="2" strokeLinecap="round">
        {board.pulses.map((p, i) => (
          <path
            key={i}
            d={board.traces[p.d]}
            pathLength={1000}
            className="pulse"
            style={{ "--dur": p.dur, "--delay": p.delay } as React.CSSProperties}
          />
        ))}
      </g>
      <g fill="var(--color-ink)" stroke="var(--color-trace)" strokeWidth="1.25">
        {board.pads.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" className="hero-pad" />
        ))}
      </g>
    </svg>
  );
}

export default function HeroCircuit() {
  return (
    <>
      <Svg board={wide} className="absolute inset-0 hidden h-full w-full md:block" />
      <Svg board={tall} className="absolute inset-0 h-full w-full md:hidden" />
    </>
  );
}
