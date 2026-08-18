import React from "react"
import { LucideIcon } from "lucide-react"

interface ShinyCardProps {
  icon: LucideIcon
  title: string
  sub: string
  className?: string
  onClick?: () => void
}

export function ShinyCard({
  icon: Icon,
  title,
  sub,
  className = "",
  onClick,
}: ShinyCardProps) {
  return (
    <>
      <style>{`
        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @property --gradient-angle-offset {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @property --gradient-percent {
          syntax: "<percentage>";
          initial-value: 14%;
          inherits: false;
        }

        @property --gradient-shine {
          syntax: "<color>";
          initial-value: #ffffff;
          inherits: false;
        }

        .luxury-shiny-card {
          --beam-cyan: #38bdf8;
          --beam-blue: #2563eb;
          --beam-indigo: #818cf8;
          --beam-white: #ffffff;
          --animation: gradient-angle linear infinite;
          --duration: 4.5s;
          --transition: 400ms cubic-bezier(0.16, 1, 0.3, 1);

          isolation: isolate;
          position: relative;
          overflow: hidden;
          outline-offset: 4px;
          border: 1px solid transparent;
          border-radius: 1rem;
          color: #ffffff;
          background: 
            linear-gradient(165deg, rgba(17, 24, 54, 0.95) 0%, rgba(9, 13, 33, 0.98) 50%, rgba(4, 7, 20, 1) 100%) padding-box,
            conic-gradient(
              from calc(var(--gradient-angle) - var(--gradient-angle-offset)),
              transparent 0%,
              rgba(56, 189, 248, 0.2) 5%,
              var(--beam-cyan) var(--gradient-percent),
              var(--beam-white) calc(var(--gradient-percent) * 1.5),
              var(--beam-indigo) calc(var(--gradient-percent) * 2.3),
              rgba(37, 99, 235, 0.4) calc(var(--gradient-percent) * 3.0),
              transparent calc(var(--gradient-percent) * 3.8)
            ) border-box;
          box-shadow: 
            inset 0 1px 1px 0 rgba(255, 255, 255, 0.18),
            inset 0 0 0 1px rgba(56, 189, 248, 0.12),
            0 10px 30px -6px rgba(2, 6, 23, 0.6),
            0 4px 16px -2px rgba(37, 99, 235, 0.2);
          transition: var(--transition);
          transition-property: transform, box-shadow, border-color;
          animation: var(--animation) var(--duration);
        }

        .luxury-shiny-card::after,
        .luxury-shiny-card .ambient-light-flare {
          content: "";
          pointer-events: none;
          position: absolute;
          inset: 0;
        }

        /* Specular Glass Luster Sweeper */
        .luxury-shiny-card::after {
          background: linear-gradient(
            115deg,
            transparent 20%,
            rgba(255, 255, 255, 0.04) 40%,
            rgba(56, 189, 248, 0.12) 50%,
            rgba(255, 255, 255, 0.08) 55%,
            transparent 75%
          );
          opacity: 0.9;
          animation: luxury-shimmer 6s ease-in-out infinite;
          z-index: 2;
        }

        /* Ambient Smooth Glow Flare */
        .luxury-shiny-card .ambient-light-flare {
          background: 
            radial-gradient(circle at 10% 0%, rgba(56, 189, 248, 0.25) 0%, transparent 45%),
            radial-gradient(circle at 90% 100%, rgba(99, 102, 241, 0.2) 0%, transparent 50%);
          opacity: 0.85;
          z-index: 1;
          animation: breathe-glow 4s ease-in-out infinite alternate;
        }

        .luxury-shiny-card:hover {
          transform: translateY(-2.5px);
          box-shadow: 
            inset 0 1px 1px 0 rgba(255, 255, 255, 0.35),
            inset 0 0 0 1px rgba(56, 189, 248, 0.3),
            0 16px 36px -8px rgba(2, 6, 23, 0.75),
            0 8px 24px -2px rgba(56, 189, 248, 0.35);
        }

        @keyframes gradient-angle {
          to {
            --gradient-angle: 360deg;
          }
        }

        @keyframes luxury-shimmer {
          0%, 100% {
            opacity: 0.5;
            transform: translateX(-30%);
          }
          50% {
            opacity: 1;
            transform: translateX(30%);
          }
        }

        @keyframes breathe-glow {
          0% {
            opacity: 0.6;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>

      <div
        onClick={onClick}
        className={`luxury-shiny-card group p-3.5 sm:p-4 cursor-pointer flex items-center gap-3.5 sm:gap-4 w-full ${className}`}
      >
        <div className="ambient-light-flare" />

        {/* Precision Sapphire Chamfered Glass Icon */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-b from-white/[0.14] via-blue-500/[0.12] to-blue-900/[0.3] backdrop-blur-md border border-white/20 text-white flex items-center justify-center flex-shrink-0 relative z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:scale-105 group-hover:border-cyan-300/50 group-hover:text-cyan-200 group-hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_0_18px_rgba(56,189,248,0.5)]">
          <Icon size={20} className="stroke-[2.2] text-cyan-300 group-hover:text-white transition-colors" />
        </div>

        {/* Crisp Luxury Typography */}
        <div className="min-w-0 flex-1 relative z-10">
          <p className="text-[13px] sm:text-sm font-extrabold text-white tracking-tight leading-tight truncate group-hover:text-cyan-100 transition-colors">
            {title}
          </p>
          <p className="text-[11px] sm:text-xs text-slate-300 font-medium mt-0.5 tracking-tight truncate group-hover:text-white/90 transition-colors">
            {sub}
          </p>
        </div>
      </div>
    </>
  )
}
