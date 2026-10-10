import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatDate, readingMinutes } from '@/lib/blog';

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({ orderBy: { updatedAt: 'desc' } });
  const now = new Date();

  return (
    <main className="min-h-screen pt-[120px] pb-[60px] bg-[#0a0a0a]">
      <div className="container mx-auto px-6 md:px-12 max-w-[1200px]">
        <div className="flex flex-wrap justify-between items-center gap-6 mb-12">
          <div>
            <Link href="/admin" className="text-xs tracking-[3px] uppercase text-[var(--color-dim-text)] hover:text-white">&larr; Dashboard</Link>
            <h1 className="text-4xl font-sans font-bold text-white mt-4 mb-2 tracking-tighter">BLOG POSTS</h1>
            <p className="text-[var(--color-dim-text)] text-sm">Write, schedule, and publish articles to /blog</p>
          </div>
          <Link
            href="/admin/posts/new"
            className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded text-sm tracking-wider transition-colors font-medium"
          >
            + NEW POST
          </Link>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-x-auto">
          <table className="w-full min-w-[640px] text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[var(--color-dim-text)] text-xs tracking-wider">
                <th className="p-4 font-medium uppercase">Post</th>
                <th className="p-4 font-medium uppercase">Status</th>
                <th className="p-4 font-medium uppercase">Date</th>
                <th className="p-4 font-medium uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[var(--color-dim-text)]">
                    No posts yet. Write your first one.
                  </td>
                </tr>
              ) : (
                posts.map((post) => {
                  const scheduled = post.isPublished && post.publishedAt && post.publishedAt > now;
                  const status = !post.isPublished ? 'Draft' : scheduled ? 'Scheduled' : 'Published';
                  const tone = !post.isPublished
                    ? 'bg-white/10 text-white/60'
                    : scheduled
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-green-500/20 text-green-300';
                  return (
                    <tr key={post.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <p className="text-white font-medium truncate max-w-[420px]">{post.title}</p>
                        <p className="text-[var(--color-dim-text)] text-xs truncate max-w-[420px]">
                          /blog/{post.slug} · {readingMinutes(post.content)} min · {post.tags.join(', ') || 'no tags'}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${tone}`}>{status}</span>
                      </td>
                      <td className="p-4 text-sm text-white/70 whitespace-nowrap">
                        {formatDate(post.publishedAt ?? post.updatedAt)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-5">
                          {status === 'Published' && (
                            <Link href={`/blog/${post.slug}`} target="_blank" className="text-white/50 hover:text-white text-sm uppercase tracking-wider">
                              View
                            </Link>
                          )}
                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            className="text-white/70 hover:text-white transition-colors text-sm uppercase tracking-wider underline underline-offset-4"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
