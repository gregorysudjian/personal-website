import { t, type Locale } from "@/lib/i18n";
import { about } from "@/content/site";
import CircuitTrace from "../CircuitTrace";
import SectionHeader from "../SectionHeader";
import Datasheet from "./Datasheet";

export default function About({ locale }: { locale: Locale }) {
  const [first, ...rest] = about.paragraphs;
  return (
    <section id="about" aria-labelledby="about-title" className="relative gutter pb-32 pt-32 md:pb-48 md:pt-48 short:py-20!">
      <CircuitTrace route="rail" padsAt="[data-pad]" />

      {/* Reading order and phones: heading, datasheet, then the text (a nav link to About lands on its heading).
          From lg the heading and text share the right column and the datasheet sits to the left of both.
          Two columns only from lg: at tablet width both would be too narrow. */}
      <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0">
        <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1">
          <SectionHeader id="about-title" label={t(about.label, locale)} heading={t(about.heading, locale)} />
        </div>

        {/* pinned beside the text only on screens tall enough to show the whole card */}
        <div className="lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <div data-reveal className="lg:tall:sticky lg:tall:top-28">
            <Datasheet locale={locale} />
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7 lg:row-start-2">
          <p data-reveal className="max-w-[62ch] text-pretty text-xl leading-relaxed text-paper md:text-2xl md:leading-[1.5] lg:mt-12">
            {t(first, locale)}
          </p>
          {rest.map((p, i) => (
            <p key={i} data-reveal className="mt-6 max-w-[68ch] text-pretty text-lg leading-relaxed text-paper/70">
              {t(p, locale)}
            </p>
          ))}

          <dl data-reveal="stagger" className="mt-14 border-t border-line">
            {about.facts.map((fact) => (
              <div
                key={t(fact.label, locale)}
                className="fact-row group grid grid-cols-[6.5rem_1fr] items-center gap-4 border-b border-line py-5 sm:grid-cols-[8rem_1fr] sm:gap-6 md:grid-cols-[10rem_1fr]"
              >
                <dt className="label-mono flex items-center gap-2 text-mute">
                  <span className="h-px w-3 shrink-0 bg-line transition-all duration-500 group-hover:bg-copper motion-safe:group-hover:w-6" />
                  {t(fact.label, locale)}
                </dt>
                <dd className="text-lg text-paper">
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
