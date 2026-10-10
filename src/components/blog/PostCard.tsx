import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@prisma/client";
import { formatDate, readingMinutes } from "@/lib/blog";
import { cloudinaryUrl } from "@/lib/cloudinary-url";

export default function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const cover = post.coverImage ? cloudinaryUrl(post.coverImage, featured ? 1200 : 720) ?? post.coverImage : null;
  const date = post.publishedAt ?? post.createdAt;

  return (
    <article
      className={`group relative flex overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0e]/85 backdrop-blur-md transition-all duration-500 hover:border-white/25 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.55)] ${
        featured ? "flex-col lg:flex-row" : "flex-col"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-emerald-950/70 via-neutral-900 to-stone-950 ${
          featured ? "aspect-[16/9] lg:aspect-auto lg:w-[55%]" : "aspect-[16/9]"
        }`}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            loading={featured ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 flex items-end p-6">
            <span className="font-mono text-[11px] uppercase tracking-[3px] text-emerald-300/70">
              {post.tags[0] ?? "engineering"}
            </span>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />
          </div>
        )}
      </div>

      <div className={`flex flex-1 flex-col gap-4 ${featured ? "p-7 md:p-10 lg:justify-center" : "p-6"}`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[2px] text-white/50">
          <time dateTime={date.toISOString()}>{formatDate(date)}</time>
          <span aria-hidden="true">·</span>
          <span>{readingMinutes(post.content)} min read</span>
        </div>

        <h3
          className={`font-sans font-bold tracking-tight text-white text-balance transition-colors group-hover:text-emerald-300 ${
            featured ? "text-2xl md:text-4xl leading-[1.1]" : "text-xl leading-snug"
          }`}
        >
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none after:rounded-3xl focus-visible:after:ring-2 focus-visible:after:ring-emerald-400">
            {post.title}
          </Link>
        </h3>

        <p className={`text-[var(--color-dim-text)] leading-relaxed ${featured ? "text-base md:text-lg line-clamp-3" : "text-sm line-clamp-2"}`}>
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <ul className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-300"
              >
                {tag}
              </li>
            ))}
          </ul>
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-300 group-hover:border-emerald-400 group-hover:bg-emerald-400 group-hover:text-black"
          >
            <ArrowUpRight size={17} />
          </span>
        </div>
      </div>
    </article>
  );
}
