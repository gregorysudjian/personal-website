/** The monogram: a tiny chip with a copper core. Also used for the favicon. */
export default function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="5.5" y="5.5" width="13" height="13" rx="1.5" stroke="currentColor" />
      <rect x="9.5" y="9.5" width="5" height="5" fill="var(--color-copper)" />
      <path d="M1 9h4.5M1 12h4.5M1 15h4.5M18.5 9H23M18.5 12H23M18.5 15H23" stroke="currentColor" />
    </svg>
  );
}
