import Link from "next/link";
import { ArrowUpRight, ArrowRight, Globe, Code } from "lucide-react";

const Github = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function FooterSection() {
  return (
    <footer id="contact" className="footer-section pt-[60px] pb-[100px]">
      <div className="footer-top flex flex-col lg:flex-row items-start lg:items-center justify-between mb-[80px] gap-[40px] lg:gap-0">
        <div className="footer-left">
          <p className="sub-title text-base leading-[1.4]">LET&apos;S CREATE<br />SOMETHING</p>
        </div>
        <div className="footer-center">
          <h2 className="footer-huge-title font-huge text-[clamp(6rem,12vw,12rem)] leading-[0.9] text-[var(--color-accent-green)]">TOGETHER</h2>
        </div>
        <div className="footer-right flex flex-col items-start gap-[30px] max-w-[300px]">
          <p className="footer-desc text-[0.9rem] text-[var(--color-dim-text)] leading-[1.6]">I&apos;m always open to new freelance or full-time opportunities. Let&apos;s build something amazing together.</p>
          <a href="https://abulmonsur.vercel.app/#contact" target="_blank" rel="noopener noreferrer" className="btn-outline">
            CONTACT ME <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      <div className="footer-bottom grid grid-cols-1 lg:grid-cols-3 items-center border-t border-[var(--color-border-line)] pt-[40px] gap-[40px] lg:gap-0">
        <div className="social-links flex flex-col gap-[20px]">
          <p className="sub-title">ABUL MONSUR KACHRU</p>
          <div className="social-icons flex gap-[15px] text-[1.5rem] text-[var(--color-dim-text)]">
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary-text)] transition-colors"><Linkedin size={24} /></a>
            <a href="https://github.com/monsur28" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary-text)] transition-colors"><Github size={24} /></a>
            <a href="https://abulmonsur.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary-text)] transition-colors"><Globe size={24} /></a>
          </div>
        </div>

        <div className="contact-details flex flex-col lg:flex-row gap-[10px] lg:gap-[40px] justify-start lg:justify-center text-[0.9rem]">
          <p>Full-Stack Developer</p>
          <p>Available for Remote Work</p>
          <p>&copy; 2026 Abul Monsur.</p>
        </div>

        <div className="qr-code-area flex items-center justify-start lg:justify-end gap-[20px]">
          <div className="qr-placeholder w-[60px] h-[60px] border border-[var(--color-border-line)] flex justify-center items-center text-[2rem] text-[var(--color-dim-text)]">
            <Code size={32} />
          </div>
          <Link href="/blog" className="text-[0.85rem] tracking-[1px] uppercase flex items-center gap-[10px] hover:text-[var(--color-dim-text)] transition-colors">
            WRITING <ArrowRight size={16} />
          </Link>
          <Link href="/#projects" className="view-work-link text-[0.85rem] tracking-[1px] uppercase flex items-center gap-[10px] hover:text-[var(--color-dim-text)] transition-colors">
            VIEW MY WORK <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
