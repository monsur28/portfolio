import Link from 'next/link';
import FooterSection from '@/components/FooterSection';
import ProjectExplorer from '@/components/ProjectExplorer';
import prisma from '@/lib/prisma';

export default async function ProjectsPage() {
  const repos = await prisma.project.findMany({
    where: { isVisible: true },
    orderBy: [
      { isFeatured: 'desc' },
      { updatedAt: 'desc' }
    ]
  });

  return (
    <>
      <main className="min-h-screen pt-[80px] pb-[60px]">
        <div className="container mx-auto px-6 md:px-12 max-w-[1200px]">
          <div className="mb-16">
            <Link href="/" className="inline-flex items-center text-[var(--color-dim-text)] hover:text-white mb-10 text-xs tracking-[3px] transition-colors uppercase">
              &larr; BACK TO HOME
            </Link>
            <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter text-white mb-6">
              ALL PROJECTS
            </h1>
            <p className="text-[1.1rem] text-[var(--color-dim-text)] max-w-[58ch] leading-relaxed">
              Everything I have built and kept - production apps, client work, and experiments,
              synced from GitHub. Filter by stack, or jump straight to the ones running live.
            </p>
          </div>

          {repos.length === 0 ? (
            <div className="rounded-xl border border-[rgba(232,228,217,0.12)] bg-black/35 py-20 text-center backdrop-blur-md">
              <p className="text-[var(--color-dim-text)]">
                No projects published yet. Sync from GitHub in the admin panel to fill this archive.
              </p>
            </div>
          ) : (
            <ProjectExplorer projects={repos} />
          )}
        </div>
      </main>
      
      {/* Footer added to make it feel like a complete page */}
      <div className="container mx-auto px-6 md:px-12 max-w-[1920px]">
        <hr className="section-divider" />
        <FooterSection />
      </div>
    </>
  );
}
