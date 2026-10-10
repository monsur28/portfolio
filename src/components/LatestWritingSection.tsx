import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Post } from "@prisma/client";
import PostCard from "@/components/blog/PostCard";
import SectionHeading from "@/components/SectionHeading";

export default function LatestWritingSection({ posts, index }: { posts: Post[]; index: string }) {
  if (posts.length === 0) return null;

  return (
    <section id="writing" className="py-[60px] flex flex-col gap-[40px]">
      <SectionHeading
        index={index}
        eyebrow="Latest writing"
        title="NOTES"
        description="What I learn shipping production systems: performance, architecture, and the trade-offs behind them."
        aside={
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[0.8rem] uppercase tracking-[1.5px] text-[var(--color-dim-text)] transition-colors hover:text-white"
          >
            All articles <ArrowRight size={15} />
          </Link>
        }
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
