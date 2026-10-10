import ScrollCanvas from "@/components/ScrollCanvas";
import SiteNav from "@/components/SiteNav";
import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import AchievementsSection from "@/components/AchievementsSection";
import ProjectsSection from "@/components/ProjectsSection";
import LatestWritingSection from "@/components/LatestWritingSection";
import JourneySection from "@/components/JourneySection";
import FooterSection from "@/components/FooterSection";
import JsonLd from "@/components/JsonLd";
import prisma from "@/lib/prisma";
import { getPublishedPosts } from "@/lib/blog";
import { author } from "@/lib/site";

// Admin saves revalidate on demand; this is the fallback for project syncs.
export const revalidate = 3600;

const CAREER_START = 2020;

export default async function Home() {
  const [settings, projects, posts] = await Promise.all([
    prisma.landingPage.findUnique({ where: { id: 1 } }),
    prisma.project.findMany({
      where: { isVisible: true },
      orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
    }),
    getPublishedPosts(3),
  ]);

  const stats = [
    { value: `${new Date().getFullYear() - CAREER_START}+`, label: "Years" },
    { value: String(projects.length), label: "Projects" },
    { value: String(projects.filter((p) => p.homepage?.trim()).length), label: "Live apps" },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: author.name,
          jobTitle: author.role,
          url: author.url,
          sameAs: [author.github],
          address: { "@type": "PostalAddress", addressLocality: "Chattogram", addressCountry: "BD" },
          knowsAbout: ["Next.js", "React", "Node.js", "TypeScript", "PostgreSQL", "MongoDB", "WordPress"],
        }}
      />
      <ScrollCanvas />

      <main className="content-overlay px-6 sm:px-12 md:px-20 lg:px-32 max-w-[1920px] mx-auto">
        <SiteNav />

        <HeroSection settings={settings} stats={stats} />

        <hr className="section-divider" />

        <SkillsSection />

        <hr className="section-divider" />

        <AchievementsSection />

        <hr className="section-divider" />

        <ProjectsSection projects={projects} />

        {posts.length > 0 && (
          <>
            <hr className="section-divider" />
            <LatestWritingSection posts={posts} index="04" />
          </>
        )}

        <hr className="section-divider" />

        <JourneySection index={posts.length > 0 ? "05" : "04"} />

        <hr className="section-divider" />

        <FooterSection />
      </main>
    </>
  );
}
