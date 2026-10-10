import type { MetadataRoute } from "next";
import { getPublishedPosts, tagCounts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const latest = posts[0]?.updatedAt ?? new Date();

  return [
    { url: absoluteUrl("/"), lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/blog"), lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    ...posts.map((post: { slug: string; updatedAt: Date }) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...tagCounts(posts).map(([tag]) => ({
      url: absoluteUrl(`/blog/tag/${encodeURIComponent(tag)}`),
      lastModified: latest,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
