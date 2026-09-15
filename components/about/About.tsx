import { t, type Locale } from "@/lib/i18n";
import { about } from "@/content/site";
import CircuitTrace from "../CircuitTrace";
import SectionHeader from "../SectionHeader";
import Datasheet from "./Datasheet";

export default function About({ locale }: { locale: Locale }) {
  const [first, ...rest] = about.paragraphs;
  return (
    <section id="about" aria-labelledby="about-title" className="relative gutter pb-20 pt-32 md:pb-24 md:pt-48">
      <CircuitTrace route="rail" padsAt="[data-pad]" />

      <div className="grid gap-20 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <div data-reveal className="md:sticky md:top-28">
            <Datasheet locale={locale} />
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <SectionHeader id="about-title" label={t(about.label, locale)} heading={t(about.heading, locale)} />

          <p data-reveal className="mt-12 text-xl leading-relaxed text-paper md:text-2xl md:leading-[1.5]">
            {t(first, locale)}
          </p>
          {rest.map((p, i) => (
            <p key={i} data-reveal className="mt-6 text-lg leading-relaxed text-paper/70">
              {t(p, locale)}
            </p>
          ))}

          <dl data-reveal="stagger" className="mt-14 border-t border-line">
            {about.facts.map((fact) => (
              <div
                key={t(fact.label, locale)}
                className="fact-row group grid grid-cols-[8rem_1fr] items-center gap-6 border-b border-line py-5 md:grid-cols-[10rem_1fr]"
              >
                <dt className="label-mono flex items-center gap-2 text-mute">
                  <span className="h-px w-3 bg-line transition-all duration-500 group-hover:w-6 group-hover:bg-copper" />
                  {t(fact.label, locale)}
                </dt>
                <dd className="text-lg text-paper transition-transform duration-500 group-hover:translate-x-1">
                  {t(fact.value, locale)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
