import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostCard from "@/components/blog/PostCard";
import TagBar from "@/components/blog/TagBar";
import { getPublishedPosts, tagCounts } from "@/lib/blog";
import { author } from "@/lib/site";

export const revalidate = 3600;

type Props = { params: Promise<{ tag: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return tagCounts(posts).map(([tag]) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = decodeURIComponent((await params).tag);
  const title = `Articles about ${tag} — ${author.name}`;
  const description = `Articles by ${author.name} on ${tag}: practical engineering notes, lessons from production, and how-tos.`;
  const url = `/blog/tag/${encodeURIComponent(tag)}`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url } };
}

export default async function TagPage({ params }: Props) {
  const tag = decodeURIComponent((await params).tag);
  const posts = await getPublishedPosts();
  const tagged = posts.filter((p) => p.tags.includes(tag));
  if (!tagged.length) notFound();

  return (
    <main className="pb-10">
      <header className="pt-16 pb-12 md:pt-24">
        <Link href="/blog" className="eyebrow hover:text-white">
          &larr; All writing
        </Link>
        <h1 className="mt-4 font-sans text-5xl font-bold tracking-tighter text-white md:text-7xl break-words">
          <span className="text-white/40">#</span>
          {tag}
        </h1>
        <p className="mt-5 text-lg text-[var(--color-dim-text)]">
          {tagged.length} {tagged.length === 1 ? "article" : "articles"}
        </p>
      </header>

      <TagBar tags={tagCounts(posts)} active={tag} />

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tagged.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
