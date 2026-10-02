import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import AboutBlock from "@/components/AboutBlock";
import ProjectCategoryBlock from "@/components/ProjectCategoryBlock";
import ProjectFilterBar from "@/components/ProjectFilterBar";
import PublicationList from "@/components/PublicationList";
import SkillsBlock from "@/components/SkillsBlock";
import SkillFilterProvider from "@/components/SkillFilterProvider";
import FilterPill from "@/components/FilterPill";
import Footer from "@/components/Footer";
import { CATEGORIES, projectsByCategory } from "@/content/projects";

/**
 * Single-page portfolio: About → Skills → Projects (AI/ML, Robotics, SWE) →
 * Publications → Contact.
 *
 * Skills sits *above* Projects, which is the unconventional call on this page and
 * the one that makes the skill filter work: the chips and the grids they act on
 * are one scroll apart, so selecting a skill and seeing the result needs no
 * navigation. It also reads as a natural claim-then-proof order.
 */
export default function Home() {
  return (
    <>
      <Navbar />

      <SkillFilterProvider>
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
            id="skills"
            aria-labelledby="skills-heading"
            className="section-rhythm scroll-mt-24"
          >
            <SectionHeader
              index="02"
              label="Skills"
              id="skills-heading"
              blurb="Select any combination of skills to filter the projects below."
            />
            <SkillsBlock />
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
              blurb="Projects grouped across AI/ML, Robotics, and SWE."
            />

            <ProjectFilterBar />

            {CATEGORIES.map((category) => (
              <ProjectCategoryBlock
                key={category.id}
                category={category}
                projects={projectsByCategory(category.id)}
              />
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
              blurb="Research on autonomous vehicles that can perceive, reason, and act safely around people, published mostly through IEEE ITSC so far. One more paper is on its way to ICRA."
            />
            <PublicationList />
          </section>
        </main>

        <FilterPill />
      </SkillFilterProvider>

      <Footer />
    </>
  );
}
