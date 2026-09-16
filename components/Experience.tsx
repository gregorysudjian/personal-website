import { t, type Locale, type Text } from "@/lib/i18n";
import { experience } from "@/content/site";
import CircuitTrace from "./CircuitTrace";
import SectionHeader from "./SectionHeader";

type Item = { org: Text; role: Text; dates: Text; place: Text; text: Text };

/** Each row "powers on" (title brightens, copper line sweeps in) as the signal passes its pad. */
export default function Experience({ locale }: { locale: Locale }) {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative gutter py-32 md:py-48 short:py-20!">
      <CircuitTrace route="rail" padsAt="[data-pad]" />
      <SectionHeader id="experience-title" label={t(experience.label, locale)} heading={t(experience.heading, locale)} />

      <div className="mt-20 flex flex-col gap-20 md:mt-28 md:gap-28">
        <Group id="xp-work" title={t(experience.workLabel, locale)} items={experience.work} locale={locale} />
        <Group id="xp-education" title={t(experience.educationLabel, locale)} items={experience.education} locale={locale} />
      </div>
    </section>
  );
}

function Group({ id, title, items, locale }: { id: string; title: string; items: Item[]; locale: Locale }) {
  return (
    <div>
      <h3 id={id} data-reveal className="label-mono mb-6 flex items-center justify-between text-mute">
        <span>{title}</span>
        <span aria-hidden="true">{String(items.length).padStart(2, "0")}</span>
      </h3>
      <ol aria-labelledby={id} className="border-t border-line">
        {items.map((item) => (
          <li
            key={t(item.org, locale) + t(item.dates, locale)}
            data-pad
            data-reveal
            className="xp-row group relative grid gap-3 border-b border-line py-8 md:py-10 lg:grid-cols-12 lg:gap-8"
          >
            {/* the name comes first for screen readers (jumping by heading); the dates still show first */}
            <div className="lg:col-span-4 lg:col-start-3 lg:row-start-1">
              <h4 className="xp-org text-2xl font-medium tracking-[-0.02em] md:text-3xl">{t(item.org, locale)}</h4>
              <p className="mt-2 text-paper/60">
                {t(item.role, locale)}{" "}
                {/* the slash travels with the place, so a wrapped line never ends on it */}
                <span className="whitespace-nowrap">
                  <span className="text-line" aria-hidden="true">
                    /
                  </span>
                  <span className="sr-only">,</span> {t(item.place, locale)}
                </span>
              </p>
            </div>
            <span className="xp-dates label-mono order-first pt-1.5 leading-[1.45] text-mute lg:order-none lg:col-span-2 lg:col-start-1 lg:row-start-1">
              {t(item.dates, locale)}
            </span>
            <p className="max-w-2xl leading-relaxed text-paper/65 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:max-w-[62ch]">{t(item.text, locale)}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
