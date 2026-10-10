"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";

const LINKS = [
  { href: "/#projects", label: "Work" },
  { href: "/blog", label: "Writing" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/blog" ? pathname.startsWith("/blog") : false);

  return (
    <header
      className={`sticky top-0 z-50 -mx-6 sm:-mx-12 md:-mx-20 lg:-mx-32 px-6 sm:px-12 md:px-20 lg:px-32 transition-[background-color,border-color,backdrop-filter] duration-300 border-b ${
        scrolled || open ? "bg-[#0a0a0a]/75 backdrop-blur-xl border-white/10" : "bg-transparent border-transparent"
      }`}
    >
      <nav aria-label="Main" className="flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80" aria-label="Abul Monsur, home">
          <Image
            src="/Abul Monsur Logo.png"
            alt=""
            width={180}
            height={106}
            className="h-9 sm:h-10 w-auto object-contain brightness-0 invert opacity-95"
            priority
          />
        </Link>

        <ul className="hidden md:flex items-center gap-1 text-[0.8rem] tracking-[1.5px] uppercase">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-full px-4 py-2 transition-colors ${
                  isActive(link.href) ? "bg-white/10 text-white" : "text-[var(--color-dim-text)] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/#contact"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-text)] px-4 py-2 text-[0.75rem] font-semibold tracking-[1.5px] uppercase text-black [text-shadow:none] transition-colors hover:bg-white"
          >
            Hire me <ArrowUpRight size={14} />
          </Link>
          <button
            type="button"
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <ul id="mobile-nav" className="md:hidden flex flex-col gap-1 pb-5 text-base">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-3 text-white/85 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
