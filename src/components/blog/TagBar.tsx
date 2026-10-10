import Link from "next/link";

export default function TagBar({ tags, active }: { tags: [string, number][]; active?: string }) {
  if (!tags.length) return null;
  const pill = (isActive: boolean) =>
    `shrink-0 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 ${
      isActive
        ? "bg-emerald-400 text-neutral-950 shadow-[0_0_18px_rgba(52,211,153,0.3)]"
        : "border border-white/15 bg-black/30 text-neutral-300 hover:border-white/40 hover:text-white"
    }`;

  return (
    <nav aria-label="Topics" className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Link href="/blog" className={pill(!active)} aria-current={!active ? "page" : undefined}>
        All
      </Link>
      {tags.map(([tag, count]) => (
        <Link
          key={tag}
          href={`/blog/tag/${encodeURIComponent(tag)}`}
          className={pill(active === tag)}
          aria-current={active === tag ? "page" : undefined}
        >
          {tag} <span className="opacity-60">{count}</span>
        </Link>
      ))}
    </nav>
  );
}
