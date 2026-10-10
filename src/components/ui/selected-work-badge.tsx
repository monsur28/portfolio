"use client";

import { ArrowUpRight } from "lucide-react";

export default function SelectedWorkBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-auto ${className}`}>
      {/* Outer rotating circular text container */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
        {/* Rotating SVG text */}
        <svg
          className="absolute inset-0 w-full h-full animate-[spin_16s_linear_infinite]"
          viewBox="0 0 120 120"
        >
          <path
            id="selectedWorkPath"
            d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
            fill="none"
          />
          <text className="text-[9.5px] font-bold tracking-[2.5px] uppercase fill-white/80">
            <textPath href="#selectedWorkPath" startOffset="0%">
              • SELECTED WORK • SELECTED WORK
            </textPath>
          </text>
        </svg>

        {/* Center core badge */}
        <div className="relative z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#08080a] border border-white/25 shadow-2xl flex items-center justify-center text-white transition-transform duration-300 hover:scale-110 hover:border-teal-400 hover:text-teal-400">
          <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}
