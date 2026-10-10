'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LandingPage } from '@prisma/client';
import Link from 'next/link';

export default function SettingsForm({ settings }: { settings: LandingPage | null }) {
  const [formData, setFormData] = useState({
    heroName: settings?.heroName || 'ABUL MONSUR',
    heroRole: settings?.heroRole || 'FULL-STACK DEVELOPER',
    heroDescription: settings?.heroDescription || 'I build high-performance web applications that turn ambitious ideas into powerful products. With a focus on modern architecture and thoughtful design, I engineer scalable solutions that deliver real business value.',
    cvLink: settings?.cvLink || 'https://drive.google.com/file/d/14oF0of_YtmmezXlxn_pVn_W_sM-lvaJ3/view?usp=sharing',
    location: settings?.location || 'CHATTOGRAM, BD',
    availability: settings?.availability || 'REMOTE WORK',
    spinningText: settings?.spinningText || 'BUILDING SCALABLE WEB APPS',
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Settings saved successfully!');
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        alert('Failed to save settings: ' + data.error);
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
          <label className="text-[var(--color-dim-text)] text-xs tracking-wider mb-2 block uppercase">Hero Name</label>
          <input name="heroName" value={formData.heroName} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded p-3 text-white" />
        </div>
        <div>
          <label className="text-[var(--color-dim-text)] text-xs tracking-wider mb-2 block uppercase">Hero Role Badge</label>
          <input name="heroRole" value={formData.heroRole} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded p-3 text-white" />
        </div>
        <div className="md:col-span-2">
          <label className="text-[var(--color-dim-text)] text-xs tracking-wider mb-2 block uppercase">Hero Description</label>
          <textarea name="heroDescription" value={formData.heroDescription} onChange={handleChange} rows={4} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white" />
        </div>
        <div className="md:col-span-2">
          <label className="text-[var(--color-dim-text)] text-xs tracking-wider mb-2 block uppercase">CV Link (Google Drive / PDF)</label>
          <input name="cvLink" value={formData.cvLink} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white" />
        </div>
        <div>
          <label className="text-[var(--color-dim-text)] text-xs tracking-wider mb-2 block uppercase">Location</label>
          <input name="location" value={formData.location} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white" />
        </div>
        <div>
          <label className="text-[var(--color-dim-text)] text-xs tracking-wider mb-2 block uppercase">Availability Status</label>
          <input name="availability" value={formData.availability} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white" />
        </div>
        <div className="md:col-span-2">
          <label className="text-[var(--color-dim-text)] text-xs tracking-wider mb-2 block uppercase">Spinning Badge Text</label>
          <input name="spinningText" value={formData.spinningText} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white tracking-[2px]" />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6 border-t border-white/10 pt-6">
        <Link href="/admin" className="px-6 py-3 border border-white/20 rounded text-white text-sm tracking-wider hover:bg-white/5">CANCEL</Link>
        <button type="submit" disabled={saving} className="px-6 py-3 bg-white text-black rounded font-medium text-sm tracking-wider hover:bg-gray-200 disabled:opacity-50">
          {saving ? 'SAVING...' : 'SAVE SETTINGS'}
        </button>
      </div>
    </form>
  );
}
