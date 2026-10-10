import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

interface Achievement {
  name: string;
  tag: string;
  platform: string;
  tagline: string;
  url: string;
  company?: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    name: "LeadCop Disposable Email Checker",
    tag: "WP",
    platform: "WordPress Plugin",
    tagline:
      "Blocks disposable and burner email addresses at signup, in real time, across form builders and WooCommerce.",
    url: "https://wordpress.org/plugins/leadcop-disposable-email-checker/",
  },
  {
    name: "GBP Insight",
    tag: "EXT",
    platform: "Chrome Extension",
    tagline:
      "Overlays local SEO data on Google Maps listings so you can benchmark a business profile against its competitors.",
    url: "https://chromewebstore.google.com/detail/gbp-insight/fdokdeoocpjaampakhnhoomglgnfhnoo",
    company: "Benwil Marketing Agency",
  },
  {
    name: "Logtrail",
    tag: "EXT",
    platform: "Chrome Extension",
    tagline:
      "A private, local browsing history you can search, revisit, and pin - no account, no server, no tracking.",
    url: "https://chromewebstore.google.com/detail/logtrail/ngjmcmfoaecjkldlhnbkkalaecegnmnj",
    company: "Benwil Marketing Agency",
  },
];

export default function AchievementsSection() {
  return (
    <section className="shipped-section py-[60px] flex flex-col gap-[40px]">
      <SectionHeading
        index="02"
        eyebrow="In production"
        title="SHIPPED"
        description="Tools I've published and maintain in the wild, independently and with Benwil Marketing Agency."
      />

      <div className="shipped-list flex flex-col w-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-3 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] divide-y divide-white/10">
        {ACHIEVEMENTS.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center py-6 px-4 md:px-6 rounded-2xl hover:bg-white/[0.06] transition-all duration-300"
          >
            <span className="shrink-0 px-3.5 py-2 flex items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono font-bold tracking-widest text-emerald-400 group-hover:bg-emerald-500/25 group-hover:text-emerald-300 transition-all shadow-sm">
              {item.tag}
            </span>

            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="text-lg md:text-xl font-bold tracking-tight text-white uppercase group-hover:text-emerald-300 transition-colors">
                  {item.name}
                </h3>
                <span className="text-[0.72rem] font-medium tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/15">
                  {item.platform}
                </span>
              </div>
              <p className="text-[0.95rem] text-zinc-300 leading-relaxed max-w-[650px]">
                {item.tagline}
              </p>
              {item.company && (
                <span className="text-[0.8rem] text-emerald-400/90 font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Published via {item.company}
                </span>
              )}
            </div>

            <div className="shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-400 transition-all self-start md:self-center">
              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
