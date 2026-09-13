import { t, type Locale } from "@/lib/i18n";
import { skills } from "@/content/site";
import CircuitTrace from "../CircuitTrace";
import SectionHeader from "../SectionHeader";
import Marquee from "./Marquee";

/** Skills as little chips: pins on each side that light up on hover. */
export default function Skills({ locale }: { locale: Locale }) {
  return (
    <section id="skills" className="relative py-32 md:py-44">
      <CircuitTrace route="rail" padsAt="[data-pad]" />
      <Marquee words={skills.marquee.map((w) => t(w, locale))} />

      <div className="gutter mt-24 md:mt-32">
        <SectionHeader label={t(skills.label, locale)} heading={t(skills.heading, locale)} intro={t(skills.intro, locale)} />
        <div className="mt-16 grid gap-14 md:mt-20 md:grid-cols-3 md:gap-10">
          {skills.groups.map((group) => (
            <div key={t(group.title, locale)}>
              <p data-reveal className="label-mono mb-6 border-b border-line pb-4 text-mute">
                {t(group.title, locale)}
              </p>
              <ul data-reveal="stagger" className="flex flex-wrap gap-x-5 gap-y-4">
                {group.items.map((item) => (
                  <li key={t(item, locale)} className="chip">
                    {t(item, locale)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
