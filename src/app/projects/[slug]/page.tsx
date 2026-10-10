import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import FooterSection from '@/components/FooterSection';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowUpRight } from 'lucide-react';
import { parseTopics } from '@/lib/project-meta';
import { cloudinaryUrl } from '@/lib/cloudinary-url';

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug }
  });

  if (!project) {
    notFound();
  }

  const topicsArray = parseTopics(project.topics);
  const heroImage = project.imageUrl ? cloudinaryUrl(project.imageUrl, 1200) || project.imageUrl : null;

  return (
    <>
      <main className="min-h-screen pt-[120px] pb-[60px]">
        <div className="container mx-auto px-6 md:px-12 max-w-[800px]">
          <Link href="/projects" className="inline-flex items-center text-[var(--color-dim-text)] hover:text-white mb-10 text-xs tracking-[3px] transition-colors uppercase">
            &larr; BACK TO PROJECTS
          </Link>

          <h1 className="text-4xl md:text-6xl font-sans font-bold text-white mb-6 tracking-tighter leading-tight">
            {project.name.replace(/-/g, ' ').toUpperCase()}
          </h1>

          <p className="text-xl text-[var(--color-dim-text)] leading-relaxed mb-8">
            {project.description || 'No brief description available.'}
          </p>

          {heroImage && (
            <div className="mb-10 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImage}
                alt={`${project.name} preview`}
                className="w-full max-h-[500px] object-cover object-top"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-4 mb-16 border-y border-white/10 py-6">
            <div className="flex flex-col gap-1 pr-8 border-r border-white/10">
              <span className="text-[10px] text-white/40 tracking-widest uppercase">Language</span>
              <span className="text-white/80 text-sm font-medium">{project.language || 'N/A'}</span>
            </div>
            
            <div className="flex flex-col gap-1 pr-8 border-r border-white/10">
              <span className="text-[10px] text-white/40 tracking-widest uppercase">Topics</span>
              <div className="flex flex-wrap gap-1">
                {topicsArray.slice(0, 3).map(t => (
                  <span key={t} className="text-white/80 text-sm capitalize">{t.replace(/-/g, ' ')}</span>
                ))}
                {topicsArray.length === 0 && <span className="text-white/80 text-sm">N/A</span>}
              </div>
            </div>

            <div className="flex flex-col gap-1 pr-8">
              <span className="text-[10px] text-white/40 tracking-widest uppercase">Links</span>
              <div className="flex gap-4">
                <a href={project.htmlUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1">
                  GitHub <ArrowUpRight size={14} />
                </a>
                {project.homepage && (
                  <a href={project.homepage} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                    Live Demo <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>

          <article className="prose prose-invert prose-lg max-w-none prose-headings:font-sans prose-headings:tracking-tight prose-a:text-emerald-400">
            {project.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.content}
              </ReactMarkdown>
            ) : (
              <div className="py-20 text-center border border-white/10 rounded-2xl bg-white/5">
                <p className="text-[var(--color-dim-text)] mb-4">No detailed content has been added to this project yet.</p>
                <p className="text-sm text-white/40">Use the admin dashboard to add full markdown details.</p>
              </div>
            )}
          </article>
        </div>
      </main>

      <div className="container mx-auto px-6 md:px-12 max-w-[1920px]">
        <hr className="section-divider" />
        <FooterSection />
      </div>
    </>
  );
}
