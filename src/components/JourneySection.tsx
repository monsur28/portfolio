import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

interface Milestone {
  period: string;
  title: string;
  org: string;
  url?: string;
  summary: string;
  kind: "work" | "education";
  current?: boolean;
}

// Newest first.
const MILESTONES: Milestone[] = [
  {
    period: "Mar '26 — Present",
    title: "Software Engineer",
    org: "Benwil Marketing",
    url: "https://benwilmarketing.com/",
    summary: "Engineering high-performance web applications, digital solutions, and scalable architectures.",
    kind: "work",
    current: true,
  },
  {
    period: "2025 — Feb '26",
    title: "Mid Level Developer",
    org: "Maxtech IT",
    summary: "Led ERP module development and system architecture using Next.js, Node.js and PostgreSQL.",
    kind: "work",
  },
  {
    period: "2024 — 2025",
    title: "Frontend Developer",
    org: "Twintech Soft",
    summary: "Built scalable React/Next.js applications and integrated complex REST APIs into modern interfaces.",
    kind: "work",
  },
  {
    period: "2020 — Present",
    title: "SEO and Web Developer Freelancer (Level 2)",
    org: "Fiverr",
    url: "https://fiverr.com/",
    summary: "Designed and developed high-converting custom themes and landing pages for international clients.",
    kind: "work",
    current: true,
  },
  {
    period: "2021 — 2025",
    title: "BSc Computer Science",
    org: "UCTC",
    summary: "Bachelor of Science in Computer Science and Engineering.",
    kind: "education",
  },
];

export default function JourneySection({ index = "05" }: { index?: string }) {
  return (
    <section id="experience" className="process-section py-[60px] flex flex-col gap-[48px]">
      <SectionHeading index={index} eyebrow="Track record" title="EXPERIENCE" />

      <ol className="journey-list flex flex-col w-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-3 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] divide-y divide-white/10">
        {MILESTONES.map((item) => (
          <li
            key={`${item.title}-${item.period}`}
            className="group grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] md:gap-12 py-6 px-4 md:px-6 rounded-2xl hover:bg-white/[0.06] transition-colors duration-300"
          >
            <div className="flex flex-wrap items-center gap-3 md:flex-col md:items-start">
              <span className="font-mono text-sm md:text-base text-emerald-400">{item.period}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[2px] ${
                  item.current
                    ? "bg-emerald-400/15 text-emerald-300 border border-emerald-400/30"
                    : "bg-white/5 text-white/50 border border-white/10"
                }`}
              >
                {item.current ? "Current" : item.kind}
              </span>
            </div>
            <div className="flex flex-col gap-2 min-w-0">
              <div>
                <h3 className="text-lg md:text-xl font-bold tracking-tight text-white uppercase group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h3>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[0.9rem] text-emerald-400/90 hover:text-white transition-colors mt-1"
                  >
                    {item.org} <ArrowUpRight size={14} />
                  </a>
                ) : (
                  <p className="text-[0.9rem] text-emerald-400/90 mt-1">{item.org}</p>
                )}
              </div>
              <p className="text-[0.95rem] text-zinc-300 leading-relaxed max-w-[600px]">{item.summary}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
