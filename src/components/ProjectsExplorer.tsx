"use client";

import { useState } from "react";
import { projects, ALL_TAGS, type Tag } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

type Filter = "All" | Tag;
const filters: Filter[] = ["All", ...ALL_TAGS];

export default function ProjectsExplorer() {
  const [active, setActive] = useState<Filter>("All");

  const visible =
    active === "All"
      ? projects
      : projects.filter((p) => p.tags.includes(active));

  return (
    <div>
      {/* Filter chips */}
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = active === filter;
          return (
            <button
              key={filter}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(filter)}
              className={
                isActive
                  ? "rounded-full border border-accent bg-accent px-3 py-1 text-sm font-medium text-accent-foreground"
                  : "rounded-full border border-border px-3 py-1 text-sm transition-colors hover:border-accent hover:text-accent"
              }
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
