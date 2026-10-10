import NewForm from './NewForm';

export default function NewProjectPage() {
  return (
    <main className="min-h-screen pt-[120px] pb-[60px] bg-[#0a0a0a]">
      <div className="container mx-auto px-6 md:px-12 max-w-[800px]">
        <h1 className="text-4xl font-sans font-bold text-white mb-8 tracking-tighter">NEW PROJECT</h1>
        <NewForm />
      </div>
    </main>
  );
}
