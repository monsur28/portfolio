"use client";

import { useMemo, useState } from "react";
import ProjectCarousel from "@/components/ui/project-carousel";
import SectionHeading from "@/components/SectionHeading";
import { CATEGORY_FILTERS, matchesFilter } from "@/lib/project-meta";
import type { Project } from "@prisma/client";

export default function ProjectsSection({ projects = [] }: { projects?: Project[] }) {
  const [activeFilter, setActiveFilter] = useState("all");

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => matchesFilter(project, activeFilter));
  }, [projects, activeFilter]);

  return (
    <section id="projects" className="work-section py-[60px] flex flex-col gap-[36px]">
      <SectionHeading
        index="03"
        eyebrow="Selected work"
        title="PROJECTS"
        description="Fast, scalable, SEO-friendly products, from storefronts and ERPs to developer tools, built across the full stack."
        aside={
          <p className="eyebrow">
            {filteredProjects.length} of {projects.length} projects
          </p>
        }
      />

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORY_FILTERS.map((cat) => {
          const isActive = cat.id === activeFilter;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveFilter(cat.id)}
              aria-pressed={isActive}
              className={`shrink-0 rounded-full px-5 py-2 text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-teal-400 text-neutral-950 shadow-[0_0_18px_rgba(45,212,191,0.35)] scale-[1.02]"
                  : "bg-black/30 border border-white/20 text-neutral-300 hover:text-white hover:border-white/40"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-black/40 py-20 text-center backdrop-blur-md">
          <p className="text-neutral-400 text-sm">
            No projects found in this category yet.
          </p>
        </div>
      ) : (
        // Keyed by filter so the carousel restarts at the first slide.
        <ProjectCarousel key={activeFilter} projects={filteredProjects} />
      )}
    </section>
  );
}
