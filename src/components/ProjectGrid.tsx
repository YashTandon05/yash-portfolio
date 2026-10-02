"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { stagger, viewportOnce } from "@/lib/motion";
import ProjectCard from "./ProjectCard";
import type { Project } from "@/content/projects";

/** Staggered card grid — 1 column on mobile, 2 from `sm`, 3 from `lg`. */
export default function ProjectGrid({
  projects,
  id,
  className = "mt-12",
}: {
  projects: Project[];
  /** Set when something outside needs to point `aria-controls` at the grid. */
  id?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // `whileInView` reveals the children it had at the moment it fired and, with
  // `once`, never revisits them — so a card appended later (a category block
  // being expanded) mounts into `hidden` and sits there invisible, holding its
  // grid slot open. Driving `animate` off the in-view state keeps the target
  // variant declarative instead, so a late-mounting card inherits `visible` and
  // plays its own rise-in.
  const inView = useInView(ref, viewportOnce);

  return (
    <motion.div
      ref={ref}
      id={id}
      variants={stagger}
      initial={reduce ? "visible" : "hidden"}
      animate={reduce || inView ? "visible" : "hidden"}
      className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
    >
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </motion.div>
  );
}
