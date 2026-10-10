'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import slugify from 'slugify';
import type { Post } from '@prisma/client';
import ImageUploadField from '@/components/admin/ImageUploadField';

type Mode = 'write' | 'split' | 'preview';

const SEO_TITLE_MAX = 60;
const SEO_DESC_MAX = 160;

const inputClass = 'w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-emerald-400/50';
const labelClass = 'text-[var(--color-dim-text)] text-xs tracking-wider mb-2 block uppercase';

// datetime-local wants local time without a zone suffix.
function toLocalInput(date: Date | null | undefined) {
  if (!date) return '';
  const d = new Date(date);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function Counter({ value, max }: { value: number; max: number }) {
  const tone = value === 0 ? 'text-white/30' : value > max ? 'text-red-400' : value > max * 0.85 ? 'text-amber-300' : 'text-emerald-400';
  return <span className={`text-[11px] tabular-nums ${tone}`}>{value}/{max}</span>;
}

export default function PostForm({ post, siteUrl }: { post?: Post; siteUrl: string }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    excerpt: post?.excerpt ?? '',
    content: post?.content ?? '',
    coverImage: post?.coverImage ?? '',
    tags: post?.tags.join(', ') ?? '',
    seoTitle: post?.seoTitle ?? '',
    seoDescription: post?.seoDescription ?? '',
    isPublished: post?.isPublished ?? false,
    publishedAt: toLocalInput(post?.publishedAt),
  });
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [mode, setMode] = useState<Mode>('split');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const slug = slugTouched ? form.slug : slugify(form.title, { lower: true, strict: true });
  const words = useMemo(() => form.content.split(/\s+/).filter(Boolean).length, [form.content]);
  const snippetTitle = form.seoTitle || form.title || 'Post title';
  const snippetDesc = form.seoDescription || form.excerpt || 'The excerpt is used as the search description unless you set one below.';

  const save = async (publish?: boolean) => {
    setSaving(true);
    setError(null);
    const isPublished = publish ?? form.isPublished;
    try {
      const res = await fetch(post ? `/api/admin/posts/${post.id}` : '/api/admin/posts', {
        method: post ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          slug,
          isPublished,
          publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Save failed.');
        return;
      }
      const saved: Post = data.post ?? data;
      set('isPublished', saved.isPublished);
      set('publishedAt', toLocalInput(saved.publishedAt));
      setSavedAt(new Date());
      if (!post) router.replace(`/admin/posts/${saved.id}/edit`);
      router.refresh();
    } catch {
      setError('Could not reach the server.');
    } finally {
      setSaving(false);
    }
  };

  // Ctrl/Cmd+S saves without changing publish state.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (!saving) save();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const handleDelete = async () => {
    if (!post) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/posts');
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Delete failed.');
      }
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="flex flex-col gap-8"
    >
      {/* Title + slug */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col gap-6">
        <div>
          <label className={labelClass} htmlFor="title">Title</label>
          <input
            id="title"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            required
            placeholder="How I cut LCP to 0.9s on a Next.js storefront"
            className={`${inputClass} text-xl font-semibold`}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="slug">Slug</label>
          <div className="flex items-center rounded border border-white/10 bg-white/5 focus-within:border-emerald-400/50">
            <span className="pl-3 text-sm text-white/35 whitespace-nowrap">/blog/</span>
            <input
              id="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                set('slug', e.target.value);
              }}
              className="w-full bg-transparent p-3 pl-1 text-white focus:outline-none"
            />
          </div>
          {post && post.isPublished && slug !== post.slug && (
            <p className="mt-2 text-xs text-amber-300">Changing the slug of a published post breaks existing links to it.</p>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelClass + ' mb-0'} htmlFor="excerpt">Excerpt</label>
            <Counter value={form.excerpt.length} max={SEO_DESC_MAX} />
          </div>
          <textarea
            id="excerpt"
            value={form.excerpt}
            onChange={(e) => set('excerpt', e.target.value)}
            required
            rows={2}
            placeholder="One or two sentences. Shown on cards and used as the search description."
            className={inputClass}
          />
        </div>
      </div>

      {/* Editor */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
          <div className="flex gap-1 rounded-lg bg-white/5 p-1" role="tablist" aria-label="Editor mode">
            {(['write', 'split', 'preview'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={`rounded-md px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ${mode === m ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
              >
                {m}
              </button>
            ))}
          </div>
          <span className="text-xs text-white/40 tabular-nums">
            {words} words · {Math.max(1, Math.round(words / 230))} min read
          </span>
        </div>
        <div className={`grid ${mode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'} min-h-[560px]`}>
          {mode !== 'preview' && (
            <textarea
              aria-label="Content (Markdown)"
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              placeholder={'## Start with a heading\n\nWrite in Markdown. Use ```ts fences for code — it is highlighted on the live page.'}
              className="w-full min-h-[560px] resize-y bg-transparent p-6 font-mono text-sm leading-relaxed text-white focus:outline-none"
            />
          )}
          {mode !== 'write' && (
            <div className={`post-body p-6 md:p-8 overflow-auto max-h-[80vh] ${mode === 'split' ? 'border-t lg:border-t-0 lg:border-l border-white/10' : ''}`}>
              {form.content.trim() ? (
                <Markdown remarkPlugins={[remarkGfm]}>{form.content}</Markdown>
              ) : (
                <p className="text-white/30">Nothing to preview yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Meta + SEO */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col gap-6">
          <div>
            <label className={labelClass} htmlFor="tags">Tags (comma separated)</label>
            <input id="tags" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="nextjs, performance, postgres" className={inputClass} />
          </div>
          <ImageUploadField label="Cover Image" value={form.coverImage} onChange={(url) => set('coverImage', url)} />
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col gap-6">
          <div>
            <p className={labelClass}>Search preview</p>
            <div className="rounded-xl bg-white p-4 text-left [text-shadow:none]">
              <p className="truncate text-xs text-[#4d5156]">{siteUrl.replace(/^https?:\/\//, '')} › blog › {slug || 'slug'}</p>
              <p className="mt-1 line-clamp-1 text-lg text-[#1a0dab]">{snippetTitle} | Abul Monsur</p>
              <p className="mt-1 line-clamp-2 text-sm text-[#4d5156]">{snippetDesc}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelClass + ' mb-0'} htmlFor="seoTitle">SEO title (optional)</label>
              <Counter value={form.seoTitle.length} max={SEO_TITLE_MAX} />
            </div>
            <input id="seoTitle" value={form.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} placeholder={form.title} className={inputClass} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelClass + ' mb-0'} htmlFor="seoDescription">Meta description (optional)</label>
              <Counter value={form.seoDescription.length} max={SEO_DESC_MAX} />
            </div>
            <textarea id="seoDescription" value={form.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} rows={3} placeholder={form.excerpt} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="publishedAt">Publish date</label>
            <input
              id="publishedAt"
              type="datetime-local"
              value={form.publishedAt}
              onChange={(e) => set('publishedAt', e.target.value)}
              className={`${inputClass} [color-scheme:dark]`}
            />
            <p className="mt-2 text-xs text-white/40">Leave empty to use the moment you publish. A future date schedules the post.</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0d0d0f]/90 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-3 text-sm">
          <span className={`px-2 py-1 text-xs rounded-full ${form.isPublished ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-white/60'}`}>
            {form.isPublished ? 'Published' : 'Draft'}
          </span>
          {error && <span className="text-red-400" role="alert">{error}</span>}
          {!error && savedAt && <span className="text-white/40">Saved {savedAt.toLocaleTimeString()}</span>}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {post && (
            confirmDelete ? (
              <span className="flex items-center gap-2 text-sm">
                <span className="text-red-300">Delete permanently?</span>
                <button type="button" onClick={handleDelete} disabled={deleting} className="px-3 py-2 rounded bg-red-500 text-white text-xs uppercase tracking-wider disabled:opacity-50">
                  {deleting ? 'Deleting…' : 'Yes, delete'}
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)} className="px-3 py-2 rounded border border-white/20 text-white text-xs uppercase tracking-wider">
                  Keep
                </button>
              </span>
            ) : (
              <button type="button" onClick={() => setConfirmDelete(true)} className="px-4 py-2.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded text-xs tracking-wider uppercase">
                Delete
              </button>
            )
          )}
          <Link href="/admin/posts" className="px-4 py-2.5 border border-white/20 rounded text-white text-xs tracking-wider uppercase hover:bg-white/5">
            Back
          </Link>
          {post?.isPublished && (
            <Link href={`/blog/${post.slug}`} target="_blank" className="px-4 py-2.5 border border-white/20 rounded text-white text-xs tracking-wider uppercase hover:bg-white/5">
              View live
            </Link>
          )}
          <button type="submit" disabled={saving} className="px-4 py-2.5 border border-white/20 rounded text-white text-xs tracking-wider uppercase hover:bg-white/5 disabled:opacity-50">
            {saving ? 'Saving…' : form.isPublished ? 'Save changes' : 'Save draft'}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => save(!form.isPublished)}
            className={`px-5 py-2.5 rounded text-xs font-semibold tracking-wider uppercase disabled:opacity-50 ${form.isPublished ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-emerald-400 text-black hover:bg-emerald-300'}`}
          >
            {form.isPublished ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>
    </form>
  );
}
