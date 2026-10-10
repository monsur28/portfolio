import PostForm from '@/components/admin/PostForm';
import { siteUrl } from '@/lib/site';

export default function NewPostPage() {
  return (
    <main className="min-h-screen pt-[120px] pb-[60px] bg-[#0a0a0a]">
      <div className="container mx-auto px-6 md:px-12 max-w-[1400px]">
        <h1 className="text-4xl font-sans font-bold text-white mb-8 tracking-tighter">NEW POST</h1>
        <PostForm siteUrl={siteUrl} />
      </div>
    </main>
  );
}
