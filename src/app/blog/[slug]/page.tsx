import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import PostBody from "@/components/blog/PostBody";
import PostCard from "@/components/blog/PostCard";
import ReadingProgress from "@/components/blog/ReadingProgress";
import ShareLinks from "@/components/blog/ShareLinks";
import TableOfContents from "@/components/blog/TableOfContents";
import JsonLd from "@/components/JsonLd";
import { extractHeadings, formatDate, getPublishedPost, getPublishedPosts, getRelatedPosts, readingMinutes } from "@/lib/blog";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import { absoluteUrl, author } from "@/lib/site";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedPost((await params).slug);
  if (!post) return {};

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const url = `/blog/${post.slug}`;

  return {
    title: `${title} | ${author.name}`,
    description,
    keywords: post.tags,
    authors: [{ name: author.name, url: author.url }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [author.name],
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPublishedPost((await params).slug);
  if (!post) notFound();

  const publishedAt = post.publishedAt ?? post.createdAt;
  const minutes = readingMinutes(post.content);
  const headings = extractHeadings(post.content);
  const related = await getRelatedPosts(post.id, post.tags);
  const url = absoluteUrl(`/blog/${post.slug}`);
  const cover = post.coverImage ? cloudinaryUrl(post.coverImage, 1600) ?? post.coverImage : null;
  // Only surface "updated" when the edit is meaningful, not a same-day typo fix.
  const showUpdated = post.updatedAt.getTime() - publishedAt.getTime() > 1000 * 60 * 60 * 24;

  return (
    <main className="pb-10">
      <ReadingProgress />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.seoDescription || post.excerpt,
            image: cover ? [cover] : [absoluteUrl(`/blog/${post.slug}/opengraph-image`)],
            datePublished: publishedAt.toISOString(),
            dateModified: post.updatedAt.toISOString(),
            wordCount: post.content.split(/\s+/).filter(Boolean).length,
            keywords: post.tags.join(", "),
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            author: { "@type": "Person", name: author.name, url: author.url, sameAs: [author.github] },
            publisher: { "@type": "Person", name: author.name, url: author.url },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Writing", item: absoluteUrl("/blog") },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          },
        ]}
      />

      <article>
        <header className="mx-auto max-w-[860px] pt-14 pb-10 text-center md:pt-20">
          <nav aria-label="Breadcrumb" className="eyebrow flex items-center justify-center gap-2">
            <Link href="/blog" className="hover:text-white">
              Writing
            </Link>
            {post.tags[0] && (
              <>
                <span aria-hidden="true">/</span>
                <Link href={`/blog/tag/${encodeURIComponent(post.tags[0])}`} className="hover:text-white">
                  {post.tags[0]}
                </Link>
              </>
            )}
          </nav>

          <h1 className="mt-6 font-sans text-4xl font-bold leading-[1.05] tracking-tighter text-white text-balance sm:text-5xl md:text-6xl">
            {post.title}
          </h1>
          <p className="mx-auto mt-6 max-w-[62ch] text-lg leading-relaxed text-[var(--color-dim-text)] text-pretty md:text-xl">
            {post.excerpt}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-white/60">
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 font-serif text-xs font-bold italic text-black"
              >
                AM
              </span>
              <span className="text-white/85">{author.name}</span>
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={publishedAt.toISOString()}>{formatDate(publishedAt)}</time>
            <span aria-hidden="true">·</span>
            <span>{minutes} min read</span>
            {showUpdated && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  Updated <time dateTime={post.updatedAt.toISOString()}>{formatDate(post.updatedAt)}</time>
                </span>
              </>
            )}
          </div>
        </header>

        {cover && (
          <figure className="mx-auto mb-14 max-w-[1100px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt="" fetchPriority="high" className="aspect-[2/1] w-full object-cover" />
          </figure>
        )}

        <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="post-body min-w-0 max-w-[72ch] lg:mx-0 mx-auto w-full">
            <PostBody markdown={post.content} />
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>

        <footer className="mx-auto mt-16 flex max-w-[1100px] flex-col gap-10">
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-6">
            <ul className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/blog/tag/${encodeURIComponent(tag)}`}
                    className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs text-white/75 hover:border-emerald-400/50 hover:text-emerald-300"
                  >
                    #{tag}
                  </Link>
                </li>
              ))}
            </ul>
            <ShareLinks url={url} title={post.title} />
          </div>

          <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-7 md:flex-row md:items-center md:justify-between md:p-10">
            <div className="max-w-[56ch]">
              <p className="eyebrow">Written by</p>
              <p className="mt-3 text-2xl font-bold tracking-tight text-white">{author.name}</p>
              <p className="mt-2 leading-relaxed text-[var(--color-dim-text)]">
                {author.role} building fast, scalable products with Next.js, Node.js and PostgreSQL. Available for remote
                engagements.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-text)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[1.5px] text-black hover:bg-white"
              >
                Work with me <ArrowUpRight size={14} />
              </Link>
              <a
                href={author.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-5 py-2.5 text-xs uppercase tracking-[1.5px] text-white hover:bg-white/5"
              >
                GitHub <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </footer>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mx-auto mt-20 max-w-[1100px]">
          <h2 id="related-heading" className="mb-8 text-2xl font-bold tracking-tight text-white">
            Keep reading
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
