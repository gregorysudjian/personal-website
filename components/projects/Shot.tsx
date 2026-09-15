"use client";

import { useEffect, useRef, useState, type CSSProperties, type Ref } from "react";

/**
 * A project screenshot. When a phone-width capture exists, phones get that one instead:
 * a laptop screen shrunk to phone size is too small to read.
 * Plain <img>: the files are already sized, sharp 2x WebP captures.
 * If the file can't load, a quiet panel with its description takes its place (never a broken-image icon).
 */
export default function Shot({
  src,
  mobile,
  alt,
  className,
  style,
  ref,
  onLoad,
}: {
  src: string;
  mobile?: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLImageElement>;
  onLoad?: () => void;
}) {
  const img = useRef<HTMLImageElement | null>(null);
  const [failed, setFailed] = useState(false);

  // An image that finished before hydration never fires onLoad in React; catch that case too.
  useEffect(() => {
    const el = img.current;
    if (el?.complete) {
      if (el.naturalWidth > 0) onLoad?.();
      else setFailed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (failed) {
    return (
      <div role="img" aria-label={alt} className="absolute inset-0 grid place-items-center bg-graphite p-6">
        <span className="label-mono max-w-[32ch] text-center leading-[1.6] text-mute">{alt}</span>
      </div>
    );
  }

  return (
    <picture>
      {mobile && <source media="(max-width: 767px)" srcSet={mobile} />}
      {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized captures; tall ones need their natural height */}
      <img
        ref={(el) => {
          img.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={className}
        style={style}
        onLoad={onLoad}
        onError={() => setFailed(true)}
      />
    </picture>
  );
}
