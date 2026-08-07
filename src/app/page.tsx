import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import AboutBlock from "@/components/AboutBlock";
import ExperienceList from "@/components/ExperienceList";
import ProjectGrid from "@/components/ProjectGrid";
import PublicationList from "@/components/PublicationList";
import SkillsBlock from "@/components/SkillsBlock";
import Footer from "@/components/Footer";
import { CATEGORIES, projectsByCategory } from "@/content/projects";
import { experience } from "@/content/experience";

/**
 * Single-page portfolio: About → Experience → Projects (AI/ML, Robotics, SWE)
 * → Publications → Skills → Contact. Conventional section order on purpose —
 * a recruiter should never have to work out where anything is.
 */
export default function Home() {
  return (
    <>
      <Navbar />

      <main className="mx-auto w-full max-w-[1120px] px-6">
        <Hero />

        <section
          id="about"
          aria-labelledby="about-heading"
          className="section-rhythm scroll-mt-24"
        >
          <SectionHeader index="01" label="About" id="about-heading" />
          <AboutBlock />
        </section>

        <section
          id="experience"
          aria-labelledby="experience-heading"
          className="section-rhythm scroll-mt-24"
        >
          <SectionHeader
            index="02"
            label="Experience"
            id="experience-heading"
            blurb="Research, internships, and the teams I've built with."
          />
          <ExperienceList roles={experience} />
        </section>

        <section
          id="projects"
          aria-labelledby="projects-heading"
          className="section-rhythm scroll-mt-24"
        >
          <SectionHeader
            index="03"
            label="Projects"
            id="projects-heading"
            blurb="Grouped by discipline. Every card opens a short case study — problem, approach, result."
          />

          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              id={category.id}
              className="mt-16 scroll-mt-24 first:mt-12"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-ink/10 pb-3">
                <h3 className="font-display text-xl font-medium tracking-[-0.02em] text-ink">
                  {category.label}
                </h3>
                <p className="max-w-lg text-sm text-graphite">
                  {category.blurb}
                </p>
              </div>
              <ProjectGrid projects={projectsByCategory(category.id)} />
            </div>
          ))}
        </section>

        <section
          id="publications"
          aria-labelledby="publications-heading"
          className="section-rhythm scroll-mt-24"
        >
          <SectionHeader
            index="04"
            label="Publications"
            id="publications-heading"
            blurb="Peer-reviewed work, each with a one-sentence summary for readers who won't open the PDF."
          />
          <PublicationList />
        </section>

        <section
          id="skills"
          aria-labelledby="skills-heading"
          className="section-rhythm scroll-mt-24"
        >
          <SectionHeader index="05" label="Skills" id="skills-heading" />
          <SkillsBlock />
        </section>
      </main>

      <Footer />
    </>
  );
}
