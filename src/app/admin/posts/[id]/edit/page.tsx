import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import PostForm from '@/components/admin/PostForm';
import { siteUrl } from '@/lib/site';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <main className="min-h-screen pt-[120px] pb-[60px] bg-[#0a0a0a]">
      <div className="container mx-auto px-6 md:px-12 max-w-[1400px]">
        <h1 className="text-4xl font-sans font-bold text-white mb-8 tracking-tighter">EDIT POST</h1>
        <PostForm post={post} siteUrl={siteUrl} />
      </div>
    </main>
  );
}
