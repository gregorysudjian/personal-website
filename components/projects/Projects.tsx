import { t, type Locale } from "@/lib/i18n";
import { projects } from "@/content/site";
import CircuitTrace from "../CircuitTrace";
import SectionHeader from "../SectionHeader";
import ProjectCard from "./ProjectCard";

export default function Projects({ locale }: { locale: Locale }) {
  return (
    <section id="projects" className="relative gutter py-32 md:py-48">
      <CircuitTrace route="rail" padsAt="[data-pad]" />
      <SectionHeader
        index="03"
        label={t(projects.label, locale)}
        heading={t(projects.heading, locale)}
        intro={t(projects.intro, locale)}
      />
      <div className="mt-20 flex flex-col gap-32 md:mt-28 md:gap-44">
        {projects.items.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} locale={locale} />
        ))}
      </div>
    </section>
  );
}
