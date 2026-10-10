"use client";

import { useMemo, useState } from "react";
import type { Project } from "@prisma/client";
import ProjectCard from "@/components/ui/project-card";
import SelectedWorkBadge from "@/components/ui/selected-work-badge";
import { buildFilters, matchesFilter } from "@/lib/project-meta";

export default function ProjectExplorer({ projects }: { projects: Project[] }) {
  const filters = useMemo(() => buildFilters(projects), [projects]);
  const [active, setActive] = useState("all");

  const visible = useMemo(
    () => projects.filter((project) => matchesFilter(project, active)),
    [projects, active]
  );

  return (
    <>
      {/* Category Filter Pills (Matching Photo 2) */}
      <div className="mb-10">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((filter) => {
            const isActive = filter.id === active;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActive(filter.id)}
                aria-pressed={isActive}
                className={`shrink-0 rounded-full px-5 py-2 text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-teal-400 text-neutral-950 shadow-[0_0_18px_rgba(45,212,191,0.35)] scale-[1.02]"
                    : "bg-black/30 border border-white/20 text-neutral-300 hover:text-white hover:border-white/40"
                }`}
              >
                <span>{filter.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-black/20 text-neutral-950" : "bg-white/10 text-neutral-400"
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Grid matching Photo 2 */}
      <div key={active} className="grid-settle flex flex-col gap-8 pb-12">
        {visible.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-black/40 py-20 text-center backdrop-blur-md">
            <p className="text-neutral-400 text-sm">
              No projects found matching this filter.
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {visible.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {/* Circular Rotating 'SELECTED WORK' Badge at bottom center */}
            <div className="flex justify-center -mt-6 sm:-mt-8 relative z-30 pointer-events-none">
              <SelectedWorkBadge className="pointer-events-auto" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
