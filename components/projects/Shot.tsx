import type { CSSProperties, Ref } from "react";

/**
 * A project screenshot. When a phone-width capture exists, phones get that one instead:
 * a laptop screen shrunk to phone size is too small to read.
 * Plain <img>: the files are already sized, sharp 2x WebP captures.
 */
export default function Shot({
  src,
  mobile,
  alt,
  className,
  style,
  ref,
}: {
  src: string;
  mobile?: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLImageElement>;
}) {
  return (
    <picture>
      {mobile && <source media="(max-width: 767px)" srcSet={mobile} />}
      {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized captures; tall ones need their natural height */}
      <img ref={ref} src={src} alt={alt} loading="lazy" decoding="async" className={className} style={style} />
    </picture>
  );
}
