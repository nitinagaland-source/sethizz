import React, { useRef, useState } from "react"
import { LucideIcon } from "lucide-react"

export interface ShinyCardProps {
  icon: LucideIcon
  title: string
  sub: string
  className?: string
  colorTheme?: "coral" | "blue" | "emerald" | "purple"
  onClick?: () => void
}

const themeStyles = {
  coral: {
    cardClass: "solid-flow-coral",
    shadow: "shadow-[0_10px_28px_rgba(225,91,62,0.3)] hover:shadow-[0_18px_40px_rgba(225,91,62,0.48)]",
    iconBg: "bg-white/20 border-white/40 text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]",
    flareColor: "rgba(255, 255, 255, 0.45)",
    topHighlight: "from-white/50 via-white/20 to-transparent",
    subText: "text-white/90",
  },
  blue: {
    cardClass: "solid-flow-blue",
    shadow: "shadow-[0_10px_28px_rgba(30,64,175,0.3)] hover:shadow-[0_18px_40px_rgba(30,64,175,0.48)]",
    iconBg: "bg-white/20 border-white/40 text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]",
    flareColor: "rgba(255, 255, 255, 0.45)",
    topHighlight: "from-white/50 via-white/20 to-transparent",
    subText: "text-white/90",
  },
  emerald: {
    cardClass: "solid-flow-emerald",
    shadow: "shadow-[0_10px_28px_rgba(5,150,105,0.3)] hover:shadow-[0_18px_40px_rgba(5,150,105,0.48)]",
    iconBg: "bg-white/20 border-white/40 text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]",
    flareColor: "rgba(255, 255, 255, 0.45)",
    topHighlight: "from-white/50 via-white/20 to-transparent",
    subText: "text-white/90",
  },
  purple: {
    cardClass: "solid-flow-purple",
    shadow: "shadow-[0_10px_28px_rgba(109,40,217,0.3)] hover:shadow-[0_18px_40px_rgba(109,40,217,0.48)]",
    iconBg: "bg-white/20 border-white/40 text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]",
    flareColor: "rgba(255, 255, 255, 0.45)",
    topHighlight: "from-white/50 via-white/20 to-transparent",
    subText: "text-white/90",
  },
}

export function ShinyCard({
  icon: Icon,
  title,
  sub,
  className = "",
  colorTheme = "coral",
  onClick,
}: ShinyCardProps) {
  const theme = themeStyles[colorTheme] || themeStyles.coral
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50, isHovered: false })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y, isHovered: true })
  }

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, isHovered: false }))
  }

  return (
    <>
      <style>{`
        @keyframes solidGradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes luxurySheenSweep {
          0% {
            transform: translateX(-150%) skewX(-24deg);
            opacity: 0.1;
          }
          20% {
            opacity: 0.85;
          }
          50% {
            opacity: 0.9;
          }
          70% {
            opacity: 0.2;
          }
          100% {
            transform: translateX(280%) skewX(-24deg);
            opacity: 0;
          }
        }

        @keyframes ambientShimmerPulse {
          0%, 100% {
            opacity: 0.35;
          }
          50% {
            opacity: 0.65;
          }
        }

        .solid-flow-card {
          position: relative;
          border-radius: 1rem;
          overflow: hidden;
          background-size: 240% 240%;
          animation: solidGradientShift 5.5s ease-in-out infinite;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (min-width: 640px) {
          .solid-flow-card {
            border-radius: 1.25rem;
          }
        }

        .solid-flow-coral {
          background-image: linear-gradient(
            135deg,
            #e15b3e 0%,
            #ea580c 25%,
            #f43f5e 55%,
            #d946ef 85%,
            #e15b3e 100%
          );
        }

        .solid-flow-blue {
          background-image: linear-gradient(
            135deg,
            #1e3a8a 0%,
            #2563eb 28%,
            #0284c7 55%,
            #06b6d4 85%,
            #1e3a8a 100%
          );
        }

        .solid-flow-emerald {
          background-image: linear-gradient(
            135deg,
            #065f46 0%,
            #059669 28%,
            #10b981 55%,
            #14b8a6 85%,
            #065f46 100%
          );
        }

        .solid-flow-purple {
          background-image: linear-gradient(
            135deg,
            #581c87 0%,
            #7c3aed 28%,
            #9333ea 55%,
            #6366f1 85%,
            #581c87 100%
          );
        }

        /* High-Intensity Diagonal Metallic Sheen Beam */
        .luxury-sheen-beam {
          position: absolute;
          inset: -40% -20%;
          width: 80%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.05) 20%,
            rgba(255, 255, 255, 0.35) 45%,
            rgba(255, 255, 255, 0.8) 50%,
            rgba(255, 255, 255, 0.35) 55%,
            rgba(255, 255, 255, 0.05) 80%,
            transparent 100%
          );
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.6));
          pointer-events: none;
          animation: luxurySheenSweep 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          z-index: 5;
        }

        /* Crisp Top Glass Bevel Highlight */
        .glass-top-rim {
          position: absolute;
          inset: 0 0 auto 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.85) 40%,
            rgba(255, 255, 255, 0.95) 50%,
            rgba(255, 255, 255, 0.85) 60%,
            rgba(255, 255, 255, 0.1) 100%
          );
          z-index: 10;
        }

        /* Ambient Glass Gloss Corner Reflection */
        .corner-gloss {
          position: absolute;
          top: -20%;
          left: -10%;
          width: 60%;
          height: 120%;
          background: radial-gradient(
            circle at top left,
            rgba(255, 255, 255, 0.3) 0%,
            rgba(255, 255, 255, 0.08) 45%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 4;
        }
      `}</style>

      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`solid-flow-card ${theme.cardClass} ${theme.shadow} group p-2.5 sm:p-4 cursor-pointer flex items-center gap-2 sm:gap-3.5 w-full border border-white/30 hover:border-white/55 hover:-translate-y-1 active:scale-[0.98] ${className}`}
      >
        {/* Crisp Top Rim Light Edge */}
        <div className="glass-top-rim" />

        {/* Ambient Top-Left Specular Corner Gloss */}
        <div className="corner-gloss" />

        {/* Dynamic Interactive Flashlight Spot (Follows Cursor on Hover) */}
        {mousePos.isHovered && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-[6]"
            style={{
              background: `radial-gradient(circle 140px at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.4), transparent 80%)`,
            }}
          />
        )}

        {/* High-Gloss Animated Sheen Beam */}
        <div className="luxury-sheen-beam" />

        {/* Crystalline Frosted Glass Icon Pill with Specular Border */}
        <div
          className={`w-8.5 h-8.5 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl border backdrop-blur-xl flex items-center justify-center flex-shrink-0 relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30 group-hover:border-white/70 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.45)] ${theme.iconBg}`}
        >
          {/* Internal Icon Rim Glint */}
          <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-t from-transparent via-white/10 to-white/40 pointer-events-none" />
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.2)]" />
        </div>

        {/* Card Typography */}
        <div className="min-w-0 flex-1 relative z-10">
          <p className="text-xs sm:text-sm font-extrabold text-white tracking-tight leading-tight truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
            {title}
          </p>
          <p
            className={`text-[9.5px] sm:text-xs font-semibold mt-0.5 tracking-tight truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] ${theme.subText}`}
          >
            {sub}
          </p>
        </div>

        {/* Outer Glow Vignette */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-[1.25rem] ring-1 ring-inset ring-white/20 pointer-events-none z-10" />
      </div>
    </>
  )
}
