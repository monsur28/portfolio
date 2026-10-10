import type { Metadata } from "next";
import { Rss } from "lucide-react";
import PostCard from "@/components/blog/PostCard";
import TagBar from "@/components/blog/TagBar";
import JsonLd from "@/components/JsonLd";
import { getPublishedPosts, tagCounts } from "@/lib/blog";
import { absoluteUrl, author, blogMeta } from "@/lib/site";

export const revalidate = 3600;

const title = `${blogMeta.title} — ${author.name}`;

export const metadata: Metadata = {
  title,
  description: blogMeta.description,
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": [{ url: "/blog/rss.xml", title }] },
  },
  openGraph: { title, description: blogMeta.description, url: "/blog", type: "website" },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();
  const [featured, ...rest] = posts;

  return (
    <main className="pb-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: title,
          description: blogMeta.description,
          url: absoluteUrl("/blog"),
          author: { "@type": "Person", name: author.name, url: author.url },
          blogPost: posts.slice(0, 20).map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: absoluteUrl(`/blog/${p.slug}`),
            datePublished: p.publishedAt?.toISOString(),
          })),
        }}
      />

      <header className="flex flex-col gap-6 pt-16 pb-12 md:pt-24 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[60ch]">
          <p className="eyebrow">Writing</p>
          <h1 className="mt-4 font-sans text-5xl font-bold tracking-tighter text-white text-balance md:text-7xl">
            Engineering notes
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[var(--color-dim-text)]">{blogMeta.description}</p>
        </div>
        <a
          href="/blog/rss.xml"
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[2px] text-white/70 transition-colors hover:border-orange-400/60 hover:text-orange-300 md:self-auto"
        >
          <Rss size={14} /> RSS
        </a>
      </header>

      <TagBar tags={tagCounts(posts)} />

      {posts.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-white/10 bg-black/40 py-24 text-center">
          <p className="text-neutral-400">The first article is on its way.</p>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-8">
          <PostCard post={featured} featured />
          {rest.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {rest.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
