import Rich from "./Rich";

/** "[01] About" label + big heading + optional intro. The label gets a pad on the copper rail. */
export default function SectionHeader({
  index,
  label,
  heading,
  intro,
  className = "",
}: {
  index: string;
  label: string;
  heading: string;
  intro?: string;
  className?: string;
}) {
  return (
    <header className={className}>
      <p data-pad data-reveal className="section-label label-mono flex items-center gap-3 text-mute">
        <span className="section-index text-copper">[{index}]</span>
        {label}
      </p>
      <h2
        data-reveal="lines"
        className="mt-6 max-w-[16ch] text-[clamp(2.6rem,6vw,6.2rem)] font-medium leading-[1.02] tracking-[-0.04em] text-paper"
      >
        <Rich text={heading} />
      </h2>
      {intro && (
        <p data-reveal className="mt-8 max-w-[46ch] text-lg leading-relaxed text-paper/70">
          {intro}
        </p>
      )}
    </header>
  );
}
