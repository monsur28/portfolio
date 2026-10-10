import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  settings: {
    heroName: string;
    heroRole: string;
    heroDescription: string;
    cvLink: string | null;
    location: string;
    availability: string;
    spinningText: string;
  } | null;
  stats?: { value: string; label: string }[];
}

export default function HeroSection({ settings, stats = [] }: HeroProps) {
  // Use settings or fallback to defaults
  const data = {
    heroName: settings?.heroName || "ABUL MONSUR",
    heroRole: settings?.heroRole || "FULL-STACK DEVELOPER",
    heroDescription: settings?.heroDescription || "I build high-performance web applications that turn ambitious ideas into powerful products. With a focus on modern architecture and thoughtful design, I engineer scalable solutions that deliver real business value.",
    cvLink: settings?.cvLink || "https://drive.google.com/file/d/14oF0of_YtmmezXlxn_pVn_W_sM-lvaJ3/view?usp=sharing",
    location: settings?.location || "CHATTOGRAM, BD",
    availability: settings?.availability || "REMOTE WORK",
    spinningText: settings?.spinningText || "BUILDING SCALABLE WEB APPS",
  };

  const nameParts = data.heroName.split(" ");
  const firstName = nameParts[0] || "ABUL";
  const lastName = nameParts.slice(1).join(" ") || "MONSUR";

  return (
    <section className="hero-section pt-[10vh] pb-[15vh] relative flex flex-col md:flex-row justify-between items-start md:items-center gap-[60px] md:gap-10">
      <div className="hero-left max-w-[650px] z-10">
        <h1 className="hero-name font-sans font-bold tracking-tighter text-7xl md:text-8xl lg:text-[140px] leading-[0.9] mb-8 uppercase">
          {firstName}<br />{lastName}
        </h1>
        <div className="role-badge inline-flex items-center gap-3 border border-[var(--color-border-line)] px-[20px] py-[10px] text-[0.8rem] tracking-[2px] mb-[40px] rounded-full backdrop-blur-sm bg-black/10 uppercase">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent-green)] animate-pulse"></span>
          {data.heroRole}
        </div>
        <p className="hero-desc text-[var(--color-dim-text)] text-base md:text-lg leading-[1.8] mb-[36px] max-w-[500px]">
          {data.heroDescription}
        </p>
        {stats.length > 0 && (
          <dl className="mb-[44px] grid max-w-[520px] grid-cols-3 divide-x divide-white/15 rounded-2xl border border-white/15 bg-black/25 backdrop-blur-sm">
            {stats.map((stat) => (
              <div key={stat.label} className="px-4 py-4 sm:px-6">
                <dt className="font-mono text-[10px] uppercase tracking-[2px] text-white/55">{stat.label}</dt>
                <dd className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="hero-links flex flex-wrap gap-[20px]">
          {data.cvLink && (
            <a href={data.cvLink} target="_blank" rel="noopener noreferrer" className="btn-outline border-[var(--color-accent-green)] text-[var(--color-accent-green)] hover:bg-[var(--color-accent-green)] hover:text-black">
              DOWNLOAD CV
            </a>
          )}
          <Link href="/#projects" className="btn-outline">
            VIEW WORK <ArrowRight size={16} />
          </Link>
          <Link href="/blog" className="btn-outline border-transparent hover:border-[var(--color-primary-text)]">
            READ THE BLOG <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="hero-right flex flex-col items-start md:items-end gap-[60px] z-10 mt-10 md:mt-0">
        <div className="spinning-badge-container w-[140px] h-[140px] opacity-80 hover:opacity-100 transition-opacity">
          <svg className="spinning-badge w-full h-full" viewBox="0 0 100 100">
            <path id="circlePath" fill="transparent" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
            <text>
              <textPath href="#circlePath" startOffset="0%" textLength="220" lengthAdjust="spacingAndGlyphs" className="text-[11px] font-sans fill-[var(--color-primary-text)] tracking-[4px] uppercase">
                {data.spinningText}
              </textPath>
            </text>
            <circle cx="50" cy="50" r="3" fill="var(--color-accent-green)" />
            <line x1="50" y1="30" x2="50" y2="40" stroke="var(--color-accent-green)" strokeWidth="1" />
            <line x1="50" y1="60" x2="50" y2="70" stroke="var(--color-accent-green)" strokeWidth="1" />
            <line x1="30" y1="50" x2="40" y2="50" stroke="var(--color-accent-green)" strokeWidth="1" />
            <line x1="60" y1="50" x2="70" y2="50" stroke="var(--color-accent-green)" strokeWidth="1" />
          </svg>
        </div>
        <div className="location-info text-left md:text-right p-6 md:p-8 border border-[var(--color-border-line)] backdrop-blur-sm bg-black/10 rounded-2xl min-w-[250px]">
          <p className="info-label text-[var(--color-dim-text)] text-xs mb-2 tracking-[2px]">BASED IN</p>
          <p className="info-value tracking-[1px] font-serif text-xl uppercase">{data.location}</p>
          <hr className="info-divider border-none border-t border-[var(--color-border-line)] my-[20px]" />
          <p className="info-label text-[var(--color-dim-text)] text-xs mb-2 tracking-[2px]">AVAILABLE FOR</p>
          <p className="info-value tracking-[1px] font-serif text-xl text-[var(--color-accent-green)] uppercase">{data.availability}</p>
        </div>
      </div>
    </section>
  );
}
