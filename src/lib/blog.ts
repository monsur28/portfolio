import { cache } from "react";
import GithubSlugger from "github-slugger";
import prisma from "@/lib/prisma";

const WORDS_PER_MINUTE = 230;

export const getPublishedPosts = cache(async (take?: number) =>
  prisma.post.findMany({
    where: { isPublished: true, publishedAt: { lte: new Date() } },
    orderBy: { publishedAt: "desc" },
    take,
  })
);

// Shared by generateMetadata, the page and the OG image so each request queries once.
export const getPublishedPost = cache(async (slug: string) => {
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.isPublished || !post.publishedAt || post.publishedAt > new Date()) return null;
  return post;
});

export async function getRelatedPosts(postId: string, tags: string[], take = 3) {
  const related = tags.length
    ? await prisma.post.findMany({
        where: { isPublished: true, publishedAt: { lte: new Date() }, id: { not: postId }, tags: { hasSome: tags } },
        orderBy: { publishedAt: "desc" },
        take,
      })
    : [];
  if (related.length >= take) return related;

  // Top up with the newest posts so the section is never half-empty.
  const filler = await prisma.post.findMany({
    where: {
      isPublished: true,
      publishedAt: { lte: new Date() },
      id: { notIn: [postId, ...related.map((p: { id: string }) => p.id)] },
    },
    orderBy: { publishedAt: "desc" },
    take: take - related.length,
  });
  return [...related, ...filler];
}

export function readingMinutes(markdown: string) {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`[\]()!-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export type Heading = { depth: 2 | 3; text: string; id: string };

// Mirrors rehype-slug (github-slugger) so table-of-contents links match the rendered ids.
export function extractHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inFence = false;

  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) continue;

    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const text = match[2]
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[*_`~]/g, "")
      .trim();
    const id = slugger.slug(text);
    const depth = match[1].length;
    if (depth === 2 || depth === 3) headings.push({ depth, text, id });
  }
  return headings;
}

export function parseTags(input: string | string[]): string[] {
  const list = Array.isArray(input) ? input : input.split(",");
  const seen = new Set<string>();
  return list
    .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"))
    .filter((tag) => tag && !seen.has(tag) && seen.add(tag));
}

export function tagCounts(posts: { tags: string[] }[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const post of posts) for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(date);
}
