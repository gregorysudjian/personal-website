import { t, type Locale, type Text } from "@/lib/i18n";
import { experience } from "@/content/site";
import CircuitTrace from "./CircuitTrace";
import SectionHeader from "./SectionHeader";

type Item = { org: Text; role: Text; dates: Text; place: Text; text: Text };

/** Each row "powers on" (title brightens, copper line sweeps in) as the signal passes its pad. */
export default function Experience({ locale }: { locale: Locale }) {
  return (
    <section id="experience" className="relative gutter py-32 md:py-48">
      <CircuitTrace route="rail" padsAt="[data-pad]" />
      <SectionHeader index="04" label={t(experience.label, locale)} heading={t(experience.heading, locale)} />

      <div className="mt-20 flex flex-col gap-20 md:mt-28 md:gap-28">
        <Group title={t(experience.workLabel, locale)} items={experience.work} locale={locale} />
        <Group title={t(experience.educationLabel, locale)} items={experience.education} locale={locale} />
      </div>
    </section>
  );
}

function Group({ title, items, locale }: { title: string; items: Item[]; locale: Locale }) {
  return (
    <div>
      <p data-reveal className="label-mono mb-6 flex items-center justify-between text-mute">
        <span>{title}</span>
        <span>{String(items.length).padStart(2, "0")}</span>
      </p>
      <ol className="border-t border-line">
        {items.map((item) => (
          <li
            key={t(item.org, locale) + t(item.dates, locale)}
            data-pad
            data-reveal
            className="xp-row group relative grid gap-3 border-b border-line py-8 md:grid-cols-12 md:gap-8 md:py-10"
          >
            <span className="xp-dates label-mono pt-1.5 text-mute md:col-span-3">{t(item.dates, locale)}</span>
            <div className="md:col-span-4">
              <h3 className="xp-org text-2xl font-medium tracking-[-0.02em] md:text-3xl">{t(item.org, locale)}</h3>
              <p className="mt-2 text-paper/60">
                {t(item.role, locale)} <span className="text-line">/</span> {t(item.place, locale)}
              </p>
            </div>
            <p className="leading-relaxed text-paper/65 md:col-span-5">{t(item.text, locale)}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
