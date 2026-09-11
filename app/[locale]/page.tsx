import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import Hero from "@/components/hero/Hero";
import Statement from "@/components/Statement";
import About from "@/components/about/About";
import Focus from "@/components/focus/Focus";
import Projects from "@/components/projects/Projects";
import Experience from "@/components/Experience";
import Skills from "@/components/skills/Skills";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/Footer";
import Reveals from "@/components/motion/Reveals";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <main id="main">
        <Hero locale={locale} />
        <Statement locale={locale} />
        <About locale={locale} />
        <Focus locale={locale} />
        <Projects locale={locale} />
        <Experience locale={locale} />
        <Skills locale={locale} />
        <Contact locale={locale} />
      </main>
      <Footer locale={locale} />
      <Reveals />
    </>
  );
}
