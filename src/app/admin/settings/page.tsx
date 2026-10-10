import prisma from '@/lib/prisma';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
  const settings = await prisma.landingPage.findUnique({
    where: { id: 1 }
  });

  return (
    <main className="min-h-screen pt-[120px] pb-[60px] bg-[#0a0a0a]">
      <div className="container mx-auto px-6 md:px-12 max-w-[800px]">
        <h1 className="text-4xl font-sans font-bold text-white mb-2 tracking-tighter">LANDING PAGE SETTINGS</h1>
        <p className="text-[var(--color-dim-text)] text-sm mb-8">Update the content shown on the hero section</p>
        <SettingsForm settings={settings} />
      </div>
    </main>
  );
}
