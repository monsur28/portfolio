import SiteNav from "@/components/SiteNav";
import FooterSection from "@/components/FooterSection";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen [text-shadow:none]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[#0a0a0a] bg-[radial-gradient(60%_45%_at_15%_0%,rgba(52,211,153,0.16),transparent_70%),radial-gradient(45%_35%_at_95%_10%,rgba(212,120,40,0.14),transparent_70%)]"
      />
      <div className="mx-auto max-w-[1920px] px-6 sm:px-12 md:px-20 lg:px-32">
        <SiteNav />
        {children}
        <hr className="section-divider" />
        <FooterSection />
      </div>
    </div>
  );
}
