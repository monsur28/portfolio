"use client";

import { useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { Project } from "@prisma/client";
import { parseTopics, projectLanguages, projectTitle, hasLiveSite } from "@/lib/project-meta";
import { cloudinaryUrl } from "@/lib/cloudinary-url";

const GithubIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

function dedupeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  return tags.filter((tag) => {
    const key = tag.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Generate project-specific color accents and layout styles for mock screens
function getProjectTheme(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("commerce") || lower.includes("store") || lower.includes("mart")) {
    return {
      type: "ecommerce",
      gradient: "from-sky-950 via-slate-900 to-indigo-950",
      accent: "bg-amber-400 text-black",
      pill: "bg-sky-500/20 text-sky-300 border-sky-500/30",
      badge: "STOREFRONT",
    };
  }
  if (lower.includes("management") || lower.includes("admin") || lower.includes("erp") || lower.includes("hrm")) {
    return {
      type: "dashboard",
      gradient: "from-zinc-950 via-neutral-900 to-stone-950",
      accent: "bg-teal-400 text-black",
      pill: "bg-teal-500/20 text-teal-300 border-teal-500/30",
      badge: "DASHBOARD",
    };
  }
  if (lower.includes("hajj") || lower.includes("umrah") || lower.includes("travel")) {
    return {
      type: "travel",
      gradient: "from-emerald-950 via-teal-950 to-slate-950",
      accent: "bg-emerald-400 text-black",
      pill: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      badge: "PORTAL",
    };
  }
  if (lower.includes("tool") || lower.includes("api") || lower.includes("vibe") || lower.includes("vortex")) {
    return {
      type: "developer",
      gradient: "from-violet-950 via-slate-950 to-neutral-950",
      accent: "bg-indigo-400 text-white",
      pill: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      badge: "DEV SUITE",
    };
  }
  return {
    type: "webapp",
    gradient: "from-slate-950 via-neutral-900 to-stone-950",
    accent: "bg-teal-400 text-black",
    pill: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    badge: "FULL STACK",
  };
}

// Multi-Device Mockup Renderer (Laptop Center, Phone Left, Tablet Right)
function MultiDeviceShowcase({
  title,
  imageUrl,
}: {
  title: string;
  imageUrl?: string | null;
}) {
  const [imgError, setImgError] = useState(false);
  const theme = getProjectTheme(title);
  const isDirectImage = imageUrl && !imgError && !imageUrl.includes("vercel.app/categories");
  // Cloudinary uploads get auto format/quality and a sane width for device screens.
  const shot = imageUrl ? cloudinaryUrl(imageUrl, 900) ?? imageUrl : "";

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
      {/* Studio Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f3f4f6] via-[#e5e7eb] to-[#d4d8e0]">
        {/* Subtle radial studio light spot */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.9)_0%,rgba(225,228,235,0.4)_65%,rgba(200,205,215,0.8)_100%)]" />
      </div>

      {/* Author / Brand Watermark Monogram (Top-Right, matching Photo 2's HS logo) */}
      <div className="absolute top-3.5 right-4 z-20 flex items-center gap-1.5 opacity-85 group-hover:opacity-100 transition-opacity">
        <span className="font-serif italic font-extrabold text-lg sm:text-xl text-neutral-800 tracking-tight">
          AM
        </span>
        <div className="h-5 w-[1.5px] bg-neutral-400 mx-0.5" />
        <div className="flex flex-col text-[7px] sm:text-[8px] font-sans font-extrabold uppercase tracking-[0.2em] leading-[1.1] text-neutral-700">
          <span>ABUL</span>
          <span>MONSUR</span>
        </div>
      </div>

      {/* Ambient floor shadow */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-5 bg-black/20 blur-md rounded-full pointer-events-none" />

      {/* Devices Cluster with Smooth Hover Float */}
      <div className="relative z-10 w-full max-w-[560px] h-[80%] flex items-center justify-center px-4 sm:px-6 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
        {/* --- 1. LEFT DEVICE: SMARTPHONE (iPhone style) --- */}
        <div className="absolute left-2 sm:left-4 bottom-2 sm:bottom-4 z-20 w-[18%] sm:w-[19%] max-w-[95px] transition-transform duration-500 group-hover:-translate-x-1">
          <div className="relative rounded-xl sm:rounded-2xl bg-[#0d0f12] p-1 pb-1.5 shadow-[0_15px_30px_rgba(0,0,0,0.35)] ring-1 ring-neutral-700/60 border border-neutral-800">
            {/* Dynamic Island / Speaker */}
            <div className="w-3.5 sm:w-4 h-0.5 sm:h-1 bg-black rounded-full mx-auto mb-1" />

            {/* Mobile Screen Display */}
            <div className={`aspect-[9/19] rounded-[7px] overflow-hidden relative bg-gradient-to-b ${theme.gradient} text-white p-1.5 flex flex-col justify-between border border-white/5`}>
              {isDirectImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={shot}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-left-top"
                  onError={() => setImgError(true)}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-[6px] font-bold tracking-wider uppercase text-white/90 truncate max-w-[32px]">
                      {theme.badge}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>

                  <div className="my-auto text-left">
                    <div className="w-8 h-1 rounded bg-white/20 mb-1" />
                    <p className="text-[6px] font-bold leading-tight text-white line-clamp-2">
                      {title}
                    </p>
                    <div className="w-6 h-0.5 rounded bg-white/10 mt-1" />
                  </div>

                  <div className="w-full py-0.5 rounded bg-white/15 text-[5px] text-center font-bold text-white/90">
                    OPEN
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* --- 2. CENTER DEVICE: LAPTOP (MacBook style) --- */}
        <div className="relative z-10 w-[62%] sm:w-[64%] max-w-[340px] transition-transform duration-500">
          {/* Laptop Screen & Bezel */}
          <div className="rounded-t-lg sm:rounded-t-xl bg-[#0c0d10] p-1.5 sm:p-2 pb-0 shadow-[0_20px_45px_rgba(0,0,0,0.4)] ring-1 ring-neutral-700/40 border-t border-x border-neutral-700/60">
            {/* Webcam dot */}
            <div className="w-1 h-1 rounded-full bg-neutral-700 mx-auto mb-1 opacity-75" />

            {/* Screen Content */}
            <div className={`aspect-[16/10] rounded-t-sm overflow-hidden relative bg-gradient-to-br ${theme.gradient} text-white flex flex-col justify-between p-2 sm:p-3 border border-white/5`}>
              {isDirectImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={shot}
                  alt={`${title} mockup preview`}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  onError={() => setImgError(true)}
                />
              ) : (
                <>
                  {/* Mock Browser Header */}
                  <div className="flex items-center justify-between pb-1 border-b border-white/10">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500/80" />
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/80" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="text-[7px] text-white/40 tracking-wider font-mono truncate max-w-[120px]">
                      monsur.dev/work/{title.toLowerCase().replace(/\s+/g, "-")}
                    </div>
                    <span className={`text-[6px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full border ${theme.pill}`}>
                      {theme.badge}
                    </span>
                  </div>

                  {/* Mock Web Hero Interface */}
                  <div className="my-auto py-1 text-left">
                    <span className="text-[7px] uppercase tracking-[2px] text-white/50 font-semibold block mb-0.5">
                      FEATURED SYSTEM
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold tracking-tight text-white leading-snug line-clamp-1">
                      {title}
                    </h4>
                    <div className="mt-1 flex items-center gap-1.5">
                      <div className={`px-2 py-0.5 rounded text-[7px] font-bold uppercase ${theme.accent}`}>
                        LAUNCH
                      </div>
                      <div className="w-12 h-1.5 rounded bg-white/15" />
                    </div>
                  </div>

                  {/* Mock Grid / Feature widgets */}
                  <div className="grid grid-cols-3 gap-1 pt-1 border-t border-white/10">
                    <div className="h-4 rounded bg-white/10 p-0.5 flex flex-col justify-center">
                      <div className="w-4 h-0.5 bg-white/30 rounded mb-0.5" />
                      <div className="w-6 h-1 bg-white/60 rounded" />
                    </div>
                    <div className="h-4 rounded bg-white/10 p-0.5 flex flex-col justify-center">
                      <div className="w-4 h-0.5 bg-white/30 rounded mb-0.5" />
                      <div className="w-5 h-1 bg-white/60 rounded" />
                    </div>
                    <div className="h-4 rounded bg-white/10 p-0.5 flex flex-col justify-center">
                      <div className="w-4 h-0.5 bg-white/30 rounded mb-0.5" />
                      <div className="w-7 h-1 bg-white/60 rounded" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Laptop Base / Aluminum Deck */}
          <div className="relative h-2 sm:h-2.5 w-[108%] -left-[4%] bg-gradient-to-b from-[#cbd5e1] via-[#94a3b8] to-[#64748b] rounded-b-md shadow-lg flex items-center justify-center">
            {/* Center Trackpad Opening Notch */}
            <div className="w-8 sm:w-10 h-0.5 bg-neutral-600/70 rounded-full" />
          </div>
        </div>

        {/* --- 3. RIGHT DEVICE: TABLET (iPad style) --- */}
        <div className="absolute right-2 sm:right-4 bottom-2 sm:bottom-4 z-15 w-[22%] sm:w-[24%] max-w-[120px] transition-transform duration-500 group-hover:translate-x-1">
          <div className="rounded-lg sm:rounded-xl bg-[#111216] p-1 shadow-[0_15px_30px_rgba(0,0,0,0.3)] ring-1 ring-neutral-700/50 border border-neutral-800">
            {/* Tablet Screen Display */}
            <div className={`aspect-[3/4] rounded-sm overflow-hidden relative bg-gradient-to-b ${theme.gradient} text-white p-1.5 flex flex-col justify-between border border-white/5`}>
              {isDirectImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={shot}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-right-top"
                  onError={() => setImgError(true)}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="w-6 h-1 rounded bg-white/20" />
                    <div className="w-1 h-1 rounded-full bg-emerald-400" />
                  </div>

                  <div className="my-auto text-left">
                    <span className="text-[6px] font-bold text-white/90 line-clamp-1 block">
                      {title}
                    </span>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      <div className="h-5 rounded bg-white/10" />
                      <div className="h-5 rounded bg-white/10" />
                    </div>
                  </div>

                  <div className="w-full h-1 rounded bg-white/15" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectCard({
  project,
}: {
  project: Project;
  featured?: boolean;
}) {
  const title = projectTitle(project.name);
  const live = hasLiveSite(project);
  const tags = dedupeTags([...projectLanguages(project), ...parseTopics(project.topics)]).slice(0, 3);
  const primaryHref = live ? project.homepage! : project.htmlUrl;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[26px] sm:rounded-[30px] border border-white/12 bg-[#0a0a0c] transition-all duration-500 hover:border-white/28 hover:shadow-[0_22px_50px_rgba(0,0,0,0.7)]">
      {/* Whole card opens the live site, falling back to the repository */}
      <a
        href={primaryHref}
        target="_blank"
        rel="noopener noreferrer"
        draggable={false}
        className="absolute inset-0 z-10 rounded-[26px] sm:rounded-[30px] outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
        aria-label={live ? `Open live site of ${title}` : `Open source code of ${title}`}
      />

      {/* Top Visual Showcase Area (Strict 16:10 Studio Mockup Dimension) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <MultiDeviceShowcase title={title} imageUrl={project.imageUrl} />
      </div>

      {/* Bottom Info Bar / Dark Section (Matching Photo 2's Lower Card Section) */}
      <div className="relative z-20 flex flex-col justify-between gap-3.5 bg-[#08090b] p-5 sm:p-6 border-t border-white/8">
        {/* Title, Description & Arrow Button */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-sans font-bold text-lg sm:text-xl text-white tracking-tight group-hover:text-teal-400 transition-colors line-clamp-1">
              {title}
            </h3>
            {project.description && (
              <p className="text-xs sm:text-sm text-neutral-400 line-clamp-1 mt-1 leading-normal">
                {project.description}
              </p>
            )}
          </div>

          <span
            className="shrink-0 h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 group-hover:text-black group-hover:bg-teal-400 group-hover:border-teal-400 transition-all duration-300 pointer-events-none"
            aria-hidden="true"
          >
            <ArrowUpRight size={18} />
          </span>
        </div>

        {/* Tags & Action Links */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/5 text-neutral-300 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 ml-auto text-xs pointer-events-auto">
            {live && (
              <a
                href={project.homepage!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300 transition-colors font-medium px-2 py-0.5 rounded hover:bg-teal-400/10"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
                Live Demo
                <ExternalLink size={12} />
              </a>
            )}
            {project.htmlUrl && (
              <a
                href={project.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors px-2 py-0.5 rounded hover:bg-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <GithubIcon size={13} />
                Source
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
