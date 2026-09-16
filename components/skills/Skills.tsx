import { t, type Locale } from "@/lib/i18n";
import { skills } from "@/content/site";
import CircuitTrace from "../CircuitTrace";
import SectionHeader from "../SectionHeader";
import Marquee from "./Marquee";

/** Skills as little chips: pins on each side that light up on hover. */
export default function Skills({ locale }: { locale: Locale }) {
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative pb-24 pt-16 md:pb-28 md:pt-24 short:py-20!">
      <CircuitTrace route="rail" padsAt="[data-pad]" />
      <Marquee words={skills.marquee.map((w) => t(w, locale))} />

      <div className="gutter mt-24 md:mt-32 short:mt-14!">
        <SectionHeader id="skills-title" label={t(skills.label, locale)} heading={t(skills.heading, locale)} intro={t(skills.intro, locale)} />
        <div className="mt-16 grid gap-14 md:mt-20 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {skills.groups.map((group, i) => (
            <div key={t(group.title, locale)}>
              <h3 id={`skills-group-${i}`} data-reveal className="label-mono mb-6 border-b border-line pb-4 text-mute">
                {t(group.title, locale)}
              </h3>
              <ul aria-labelledby={`skills-group-${i}`} data-reveal="stagger" className="flex flex-wrap gap-x-5 gap-y-4">
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
