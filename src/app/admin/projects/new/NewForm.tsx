'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUploadField from '@/components/admin/ImageUploadField';

export default function NewForm() {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    content: '',
    htmlUrl: '',
    homepage: '',
    language: '',
    topics: '[]',
    imageUrl: '',
    isFeatured: false,
    isVisible: true,
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Created successfully!');
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        alert('Failed to create: ' + data.error);
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[var(--color-dim-text)] text-xs tracking-wider mb-2 block uppercase">Project Name</label>
          <input name="name" value={formData.name} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded p-3 text-white" />
        </div>
        <div>
          <label className="text-[var(--color-dim-text)] text-xs tracking-wider mb-2 block uppercase">Slug (URL)</label>
          <input name="slug" value={formData.slug} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded p-3 text-white" />
        </div>
        <div className="md:col-span-2">
          <label className="text-[var(--color-dim-text)] text-xs tracking-wider mb-2 block uppercase">Short Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white" />
        </div>
        <div className="md:col-span-2">
          <label className="text-[var(--color-dim-text)] text-xs tracking-wider mb-2 block uppercase">Full Detail Content (Markdown)</label>
          <textarea name="content" value={formData.content} onChange={handleChange} rows={10} placeholder="Write the full project details here..." className="w-full bg-white/5 border border-white/10 rounded p-3 text-white font-mono text-sm" />
        </div>
        <div>
          <label className="text-[var(--color-dim-text)] text-xs tracking-wider mb-2 block uppercase">GitHub URL</label>
          <input name="htmlUrl" value={formData.htmlUrl} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded p-3 text-white" />
        </div>
        <div>
          <label className="text-[var(--color-dim-text)] text-xs tracking-wider mb-2 block uppercase">Live Homepage URL</label>
          <input name="homepage" value={formData.homepage} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white" />
        </div>
        <div>
          <label className="text-[var(--color-dim-text)] text-xs tracking-wider mb-2 block uppercase">Primary Language</label>
          <input name="language" value={formData.language} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white" />
        </div>
        <div>
          <label className="text-[var(--color-dim-text)] text-xs tracking-wider mb-2 block uppercase">Topics (JSON array)</label>
          <input name="topics" value={formData.topics} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white" />
        </div>
        <div className="md:col-span-2">
          <ImageUploadField
            value={formData.imageUrl}
            onChange={(imageUrl) => setFormData(prev => ({ ...prev, imageUrl }))}
          />
        </div>
      </div>
      
      <div className="flex gap-6 mt-4 border-t border-white/10 pt-6">
        <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
          <input type="checkbox" name="isVisible" checked={formData.isVisible} onChange={handleChange} className="w-5 h-5 accent-emerald-500" />
          Visible on Portfolio
        </label>
        <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
          <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 accent-amber-500" />
          Featured Project (Hero Layout)
        </label>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Link href="/admin" className="px-6 py-3 border border-white/20 rounded text-white text-sm tracking-wider hover:bg-white/5">CANCEL</Link>
        <button type="submit" disabled={saving} className="px-6 py-3 bg-white text-black rounded font-medium text-sm tracking-wider hover:bg-gray-200 disabled:opacity-50">
          {saving ? 'CREATING...' : 'CREATE PROJECT'}
        </button>
      </div>
    </form>
  );
}
