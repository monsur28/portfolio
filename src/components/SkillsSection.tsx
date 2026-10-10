import TechCarousel from "@/components/TechCarousel";
import SectionHeading from "@/components/SectionHeading";
import { Layout, Terminal, Database, Cloud, Globe, Code } from "lucide-react";

export default function SkillsSection() {
  return (
    <section className="services-section py-[60px] flex flex-col gap-[40px]">
      <SectionHeading
        index="01"
        eyebrow="Capabilities"
        title="SKILLS"
        description="End-to-end delivery: interfaces, APIs, data, and the infrastructure that keeps them fast."
      />
      <div className="flex flex-col w-full overflow-hidden">
        <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px] gap-y-[60px] bg-black/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10">
          <div className="service-card">
            <Layout className="service-icon text-[2rem] text-white/80 mb-5" />
            <h3 className="text-base tracking-[1px] mb-[15px] text-white font-semibold">FRONTEND</h3>
            <p className="text-[0.85rem] text-zinc-300 leading-[1.6]">React.js, Next.js, Tailwind CSS, TypeScript, HTML5, CSS3, Bootstrap.</p>
          </div>
          <div className="service-card">
            <Terminal className="service-icon text-[2rem] text-white/80 mb-5" />
            <h3 className="text-base tracking-[1px] mb-[15px] text-white font-semibold">BACKEND</h3>
            <p className="text-[0.85rem] text-zinc-300 leading-[1.6]">Node.js, Express, REST APIs, System Architecture.</p>
          </div>
          <div className="service-card">
            <Database className="service-icon text-[2rem] text-white/80 mb-5" />
            <h3 className="text-base tracking-[1px] mb-[15px] text-white font-semibold">DATABASE</h3>
            <p className="text-[0.85rem] text-zinc-300 leading-[1.6]">MongoDB, Mongoose, PostgreSQL, Firebase Realtime Database.</p>
          </div>
          <div className="service-card">
            <Globe className="service-icon text-[2rem] text-white/80 mb-5" />
            <h3 className="text-base tracking-[1px] mb-[15px] text-white font-semibold">CMS & ECOSYSTEM</h3>
            <p className="text-[0.85rem] text-zinc-300 leading-[1.6]">WordPress, Elementor & Divi Theme Development, Custom Plugins.</p>
          </div>
          <div className="service-card">
            <Code className="service-icon text-[2rem] text-white/80 mb-5" />
            <h3 className="text-base tracking-[1px] mb-[15px] text-white font-semibold">AUTOMATION & EXTENSIONS</h3>
            <p className="text-[0.85rem] text-zinc-300 leading-[1.6]">Browser-Based Automation, Chrome Extensions (Manifest V3).</p>
          </div>
          <div className="service-card">
            <Cloud className="service-icon text-[2rem] text-white/80 mb-5" />
            <h3 className="text-base tracking-[1px] mb-[15px] text-white font-semibold">TOOLS & HOSTING</h3>
            <p className="text-[0.85rem] text-zinc-300 leading-[1.6]">Vercel, Render, VPS Hosting Deploy, Git, Stripe Integration.</p>
          </div>
        </div>

        <TechCarousel />
      </div>
    </section>
  );
}
