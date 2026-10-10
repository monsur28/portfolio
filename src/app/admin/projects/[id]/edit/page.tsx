import prisma from '@/lib/prisma';
import EditForm from './EditForm';
import { notFound } from 'next/navigation';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id }
  });

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-[120px] pb-[60px] bg-[#0a0a0a]">
      <div className="container mx-auto px-6 md:px-12 max-w-[800px]">
        <h1 className="text-4xl font-sans font-bold text-white mb-8 tracking-tighter">EDIT PROJECT</h1>
        <EditForm project={project} />
      </div>
    </main>
  );
}
