import { Fragment } from "react";

/** Renders copy where *starred* words get the copper serif accent. */
export default function Rich({ text }: { text: string }) {
  // a full stop (or comma…) right after an accented word joins it, so it isn't set in another face
  const parts = text.replace(/\*([^*]+)\*([.,!?;:]+)/g, "*$1$2*").split(/\*(.+?)\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <em key={i} className="accent">
            {part}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
