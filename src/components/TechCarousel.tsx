import { FaReact, FaNodeJs, FaGitAlt, FaHtml5, FaCss3Alt } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiTypescript, SiExpress, SiMongodb, SiPostgresql, SiFirebase, SiVercel, SiWordpress, SiElementor } from "react-icons/si";

const TECH_STACK = [
  { name: "React", icon: FaReact, color: "#61DAFB" },
  { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
  { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "HTML5", icon: FaHtml5, color: "#E34F26" },
  { name: "CSS3", icon: FaCss3Alt, color: "#1572B6" },
  { name: "Node.js", icon: FaNodeJs, color: "#339933" },
  { name: "Express", icon: SiExpress, color: "#FFFFFF" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
  { name: "Vercel", icon: SiVercel, color: "#FFFFFF" },
  { name: "WordPress", icon: SiWordpress, color: "#21759B" },
  { name: "Elementor", icon: SiElementor, color: "#92003B" },
  { name: "Git", icon: FaGitAlt, color: "#F05032" },
];

export default function TechCarousel() {
  return (
    <div 
      className="w-full overflow-hidden mt-10 relative py-10"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
      }}
    >
      <div className="flex w-[max-content] animate-[infinite-scroll_40s_linear_infinite] hover:[animation-play-state:paused]">
        {[...TECH_STACK, ...TECH_STACK].map((tech, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center justify-center mx-8 md:mx-12 gap-4 group opacity-90 hover:opacity-100 transition-all duration-300 w-[100px] hover:scale-110"
          >
            <tech.icon 
              className="text-5xl md:text-7xl drop-shadow-md transition-all duration-300" 
              style={{ color: tech.color }} 
            />
            <span className="text-xs tracking-widest text-[var(--color-dim-text)] group-hover:text-white font-medium uppercase text-center drop-shadow-sm">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
