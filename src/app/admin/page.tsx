import prisma from '@/lib/prisma';
import Link from 'next/link';
import type { Project } from '@prisma/client';
import { cloudinaryUrl } from '@/lib/cloudinary-url';

// Simple client component for the Sync button
import SyncButton from './SyncButton';
import DeleteProjectButton from './DeleteProjectButton';

export default async function AdminDashboard() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <main className="min-h-screen pt-[120px] pb-[60px] bg-[#0a0a0a]">
      <div className="container mx-auto px-6 md:px-12 max-w-[1200px]">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-sans font-bold text-white mb-2 tracking-tighter">DASHBOARD</h1>
            <p className="text-[var(--color-dim-text)] text-sm">Manage your portfolio projects</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/admin/posts"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm tracking-wider transition-colors"
            >
              BLOG POSTS
            </Link>
            <Link 
              href="/admin/settings"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm tracking-wider transition-colors"
            >
              LANDING PAGE SETTINGS
            </Link>
            <Link 
              href="/admin/projects/new"
              className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded text-sm tracking-wider transition-colors font-medium"
            >
              + NEW PROJECT
            </Link>
            <SyncButton />
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[var(--color-dim-text)] text-xs tracking-wider">
                <th className="p-4 font-medium uppercase">Project</th>
                <th className="p-4 font-medium uppercase">Status</th>
                <th className="p-4 font-medium uppercase">Featured</th>
                <th className="p-4 font-medium uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[var(--color-dim-text)]">
                    No projects found. Click &ldquo;Sync with GitHub&rdquo; to import your repositories.
                  </td>
                </tr>
              ) : (
                projects.map((project: Project) => (
                  <tr key={project.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        {project.imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={cloudinaryUrl(project.imageUrl, 120) || project.imageUrl}
                            alt={project.name}
                            className="w-14 h-10 object-cover rounded-lg border border-white/10 bg-white/5 shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-10 rounded-lg border border-dashed border-white/15 bg-white/5 flex items-center justify-center text-[9px] text-white/40 shrink-0 uppercase tracking-wider">
                            No Img
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate max-w-[280px]">{project.name}</p>
                          <p className="text-[var(--color-dim-text)] text-xs truncate max-w-[280px]">
                            {project.description || 'No description'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${project.isVisible ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {project.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="p-4">
                      {project.isFeatured && (
                        <span className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-300">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-5">
                        <Link 
                          href={`/admin/projects/${project.id}/edit`}
                          className="text-white/70 hover:text-white transition-colors text-sm uppercase tracking-wider underline underline-offset-4"
                        >
                          Edit
                        </Link>
                        <DeleteProjectButton projectId={project.id} projectName={project.name} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
