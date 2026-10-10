import slugify from "slugify";
import { revalidatePath } from "next/cache";
import type { Post } from "@prisma/client";
import { parseTags } from "@/lib/blog";

export type PostInput = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  tags?: string | string[];
  seoTitle?: string;
  seoDescription?: string;
  isPublished?: boolean;
  publishedAt?: string | null;
};

const clean = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const orNull = (value: unknown) => clean(value) || null;

export function toPostData(input: PostInput, existing?: Post) {
  const title = clean(input.title);
  const excerpt = clean(input.excerpt);
  const content = typeof input.content === "string" ? input.content : "";
  if (!title) return { error: "Title is required." } as const;
  if (!excerpt) return { error: "Excerpt is required — it is the search snippet and card summary." } as const;
  if (!content.trim()) return { error: "Content is required." } as const;

  const slug = slugify(clean(input.slug) || title, { lower: true, strict: true });
  if (!slug) return { error: "Slug must contain letters or numbers." } as const;

  const isPublished = Boolean(input.isPublished);
  const requested = input.publishedAt ? new Date(input.publishedAt) : null;
  if (requested && Number.isNaN(requested.getTime())) return { error: "Publish date is invalid." } as const;
  // Keep the original date on re-saves so URLs in feeds don't jump to the top.
  const publishedAt = isPublished ? requested ?? existing?.publishedAt ?? new Date() : requested;

  return {
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImage: orNull(input.coverImage),
      tags: parseTags(input.tags ?? []),
      seoTitle: orNull(input.seoTitle),
      seoDescription: orNull(input.seoDescription),
      isPublished,
      publishedAt,
    },
  } as const;
}

export function revalidateBlog(...slugs: string[]) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog/rss.xml");
  revalidatePath("/sitemap.xml");
  for (const slug of slugs) revalidatePath(`/blog/${slug}`);
}

export function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && (error as { code?: string }).code === "P2002";
}
