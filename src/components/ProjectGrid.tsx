"use client";

import { motion, useReducedMotion } from "framer-motion";
import { stagger, viewportOnce } from "@/lib/motion";
import ProjectCard from "./ProjectCard";
import type { Project } from "@/content/projects";

/** Staggered card grid — 1 column on mobile, 2 from `sm`, 3 from `lg`. */
export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      variants={stagger}
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
      className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </motion.div>
  );
}
