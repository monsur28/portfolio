"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

export default function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const targets = [
    { label: "X", href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const pill =
    "inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3.5 py-1.5 text-xs text-white/75 transition-colors hover:border-white/30 hover:text-white";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-mono text-[11px] uppercase tracking-[2px] text-white/40">Share</span>
      {targets.map((t) => (
        <a key={t.label} href={t.href} target="_blank" rel="noopener noreferrer" className={pill}>
          {t.label}
        </a>
      ))}
      <button type="button" onClick={copy} className={pill} aria-live="polite">
        {copied ? <Check size={13} className="text-emerald-400" /> : <Link2 size={13} />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
