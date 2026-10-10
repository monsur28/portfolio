import type { Project } from "@prisma/client";

export function parseTopics(raw: string | null): string[] {
  if (!raw) return [];

  const asArray = (value: unknown): string[] | null =>
    Array.isArray(value) ? value.filter((t): t is string => typeof t === "string") : null;

  try {
    const direct = asArray(JSON.parse(raw));
    if (direct) return direct;
  } catch {
    // Some synced records have prose appended after the JSON array.
    const bracketed = raw.match(/\[[\s\S]*\]/);
    if (bracketed) {
      try {
        const salvaged = asArray(JSON.parse(bracketed[0]));
        if (salvaged) return salvaged;
      } catch {
        return [];
      }
    }
  }

  return [];
}

export function projectLanguages(project: Project): string[] {
  if (!project.language) return [];
  return project.language
    .split(",")
    .map((lang: string) => lang.trim())
    .filter(Boolean);
}

export function projectTitle(name: string): string {
  return name.replace(/[-_]+/g, " ").trim();
}

export function hasLiveSite(project: Project): boolean {
  return Boolean(project.homepage?.trim());
}

export type Filter = { id: string; label: string; count: number };

export const CATEGORY_FILTERS = [
  { id: "all", label: "All" },
  { id: "fullstack", label: "Full Stack" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "erp", label: "ERP system" },
  { id: "frontend", label: "FrontEnd" },
  { id: "3d", label: "3D Website" },
  { id: "backend", label: "BackEnd" },
  { id: "cms", label: "CMS" },
];

export function matchesFilter(project: Project, filterId: string): boolean {
  if (!filterId || filterId === "all") return true;
  if (filterId === "live") return hasLiveSite(project);
  if (filterId.startsWith("lang:")) {
    return projectLanguages(project).includes(filterId.slice(5));
  }

  const name = project.name.toLowerCase();
  const desc = (project.description || "").toLowerCase();
  const topics = parseTopics(project.topics).map((t) => t.toLowerCase());
  const langs = projectLanguages(project).map((l) => l.toLowerCase());
  const allText = `${name} ${desc} ${topics.join(" ")} ${langs.join(" ")}`;

  switch (filterId) {
    case "fullstack":
      return (
        allText.includes("next") ||
        allText.includes("full") ||
        allText.includes("mern") ||
        allText.includes("vortex") ||
        allText.includes("client") ||
        allText.includes("management") ||
        topics.includes("nextjs15")
      );
    case "ecommerce":
      return (
        allText.includes("commerce") ||
        allText.includes("store") ||
        allText.includes("mart") ||
        allText.includes("shop") ||
        topics.some((t) => t.includes("e-commerce"))
      );
    case "erp":
      return (
        allText.includes("management") ||
        allText.includes("admin") ||
        allText.includes("erp") ||
        allText.includes("inventory") ||
        allText.includes("hrm") ||
        allText.includes("ticketing") ||
        allText.includes("doctor") ||
        allText.includes("camp")
      );
    case "frontend":
      return (
        langs.includes("html") ||
        langs.includes("css") ||
        langs.includes("javascript") ||
        langs.includes("typescript") ||
        allText.includes("tailwind") ||
        allText.includes("client")
      );
    case "3d":
      return (
        allText.includes("3d") ||
        allText.includes("canvas") ||
        allText.includes("travel") ||
        allText.includes("hajj") ||
        allText.includes("vortex") ||
        topics.includes("3d-visualization")
      );
    case "backend":
      return (
        allText.includes("server") ||
        allText.includes("backend") ||
        allText.includes("socket") ||
        allText.includes("api") ||
        allText.includes("asp.net") ||
        allText.includes("laravel")
      );
    case "cms":
      return (
        allText.includes("cms") ||
        allText.includes("doc") ||
        allText.includes("book") ||
        allText.includes("portfolio") ||
        allText.includes("blog")
      );
    default:
      return true;
  }
}

export function buildFilters(projects: Project[]): Filter[] {
  // Return the reference categories from Photo 2 that have matching projects
  const categories = CATEGORY_FILTERS.map((cat) => {
    const count = projects.filter((p) => matchesFilter(p, cat.id)).length;
    return { ...cat, count };
  }).filter((cat) => cat.id === "all" || cat.count > 0);

  return categories;
}

