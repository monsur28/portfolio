"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, type PanInfo } from "motion/react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import type { Project } from "@prisma/client";
import ProjectCard from "@/components/ui/project-card";
import { projectTitle } from "@/lib/project-meta";

const AUTOPLAY_MS = 6000;
const GAP = 28;
const SPRING = { type: "spring", stiffness: 260, damping: 34, mass: 0.9 } as const;

function slideWidthFor(viewport: number) {
  if (viewport < 640) return viewport * 0.86;
  if (viewport < 1024) return viewport * 0.64;
  return Math.min(viewport * 0.44, 640);
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function ProjectCarousel({ projects }: { projects: Project[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);
  const [viewport, setViewport] = useState(0);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const inView = useInView(viewportRef, { amount: 0.4 });

  const total = projects.length;
  const slideW = slideWidthFor(viewport);
  const step = slideW + GAP;
  const trackX = viewport ? (viewport - slideW) / 2 - index * step : 0;
  const playing = !paused && !reduceMotion && inView && !hovered && !focused && total > 1;

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setViewport(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const goTo = useCallback(
    (next: number) => setIndex(((next % total) + total) % total),
    [total]
  );

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => goTo(index + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [playing, index, goTo]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = info.offset.x + info.velocity.x * 0.2;
    const shift = Math.round(-swipe / step);
    // A short flick still advances one slide.
    const delta = shift !== 0 ? shift : Math.abs(swipe) > 60 ? -Math.sign(swipe) : 0;
    setIndex((i) => Math.max(0, Math.min(total - 1, i + delta)));
  };

  if (total === 0) return null;

  const active = projects[index];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Projects"
      className="relative flex flex-col gap-8"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") goTo(index + 1);
        else if (e.key === "ArrowLeft") goTo(index - 1);
        else return;
        e.preventDefault();
      }}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
      }}
    >
      {/* Stage: bleeds to the page edges, faded at the sides */}
      <div
        ref={viewportRef}
        className="relative -mx-6 sm:-mx-12 md:-mx-20 lg:-mx-32 overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,#000_9%,#000_91%,transparent)]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Ambient glow behind the active slide */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400/10 blur-[90px]"
        />

        <motion.div
          className="relative flex cursor-grab touch-pan-y items-center active:cursor-grabbing"
          style={{ gap: GAP, opacity: viewport ? 1 : 0 }}
          animate={{ x: trackX }}
          transition={reduceMotion ? { duration: 0 } : SPRING}
          drag={total > 1 ? "x" : false}
          dragConstraints={{ left: trackX, right: trackX }}
          dragElastic={0.18}
          onDragStart={() => (draggedRef.current = true)}
          onDragEnd={handleDragEnd}
        >
          {projects.map((project, i) => {
            const isActive = i === index;
            const distance = Math.abs(i - index);
            return (
              <motion.div
                key={project.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${total}: ${projectTitle(project.name)}`}
                className={`relative shrink-0 ${isActive ? "" : "cursor-pointer"}`}
                style={{ width: slideW || "86%" }}
                animate={{
                  scale: isActive ? 1 : 0.86,
                  opacity: isActive ? 1 : distance === 1 ? 0.42 : 0.15,
                  filter: isActive || distance > 2 ? "blur(0px)" : "blur(1.5px)",
                }}
                transition={reduceMotion ? { duration: 0 } : SPRING}
                onPointerDown={() => (draggedRef.current = false)}
                onClickCapture={(e) => {
                  // Swallow the click that ends a drag, and use side slides as "go to".
                  if (draggedRef.current || !isActive) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!draggedRef.current) goTo(i);
                  }
                }}
              >
                {/* Inert keeps off-screen links out of the tab order; clicks fall through to the slide. */}
                <div inert={!isActive}>
                  <ProjectCard project={project} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Control bar */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-end gap-5">
          <div className="font-sans font-bold leading-none tracking-tighter text-white tabular-nums">
            <span className="text-4xl sm:text-5xl">{pad(index + 1)}</span>
            <span className="ml-1 text-sm text-neutral-500">/ {pad(total)}</span>
          </div>
          <div className="min-w-0 pb-1">
            <p className="text-[10px] uppercase tracking-[3px] text-neutral-500">Now showing</p>
            <motion.p
              key={active.id}
              aria-live={playing ? "off" : "polite"}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="truncate text-sm font-semibold capitalize text-white sm:text-base"
            >
              {projectTitle(active.name)}
            </motion.p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {total > 1 && !reduceMotion && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Start autoplay" : "Pause autoplay"}
              className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-teal-400"
            >
              {paused ? <Play size={16} /> : <Pause size={16} />}
            </button>
          )}
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={total < 2}
            aria-label="Previous project"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:border-teal-400 hover:bg-teal-400 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400 disabled:opacity-30"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={total < 2}
            aria-label="Next project"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:border-teal-400 hover:bg-teal-400 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400 disabled:opacity-30"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Segmented progress: one tick per project, the active one fills over the autoplay interval */}
      {total > 1 && (
        <div className="flex gap-1.5" aria-hidden="true">
          {projects.map((project, i) => (
            <button
              key={project.id}
              type="button"
              tabIndex={-1}
              onClick={() => goTo(i)}
              className="group relative h-6 flex-1 cursor-pointer"
            >
              <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-white/12 transition-colors group-hover:bg-white/25">
                {i < index && <span className="absolute inset-0 bg-white/45" />}
                {i === index && (
                  <motion.span
                    key={`${index}-${playing}`}
                    className="absolute inset-y-0 left-0 bg-teal-400"
                    initial={{ width: playing ? "0%" : "100%" }}
                    animate={{ width: "100%" }}
                    transition={playing ? { duration: AUTOPLAY_MS / 1000, ease: "linear" } : { duration: 0 }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
