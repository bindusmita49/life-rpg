import React from "react";

interface FeaturePreviewCardProps {
  step: string;
  title: string;
  description: string;
  glowColor: "cyan" | "magenta" | "yellow";
  icon: React.ReactNode;
}

const COLOR_MAP = {
  cyan: {
    border: "border-[#00fff2]/40 hover:border-[#00fff2]",
    glow: "shadow-[0_0_20px_rgba(0,255,242,0.12)] hover:shadow-[0_0_30px_rgba(0,255,242,0.25)]",
    tagBg: "bg-[#00fff2]/10 border-[#00fff2]/30 text-[#00fff2]",
    titleColor: "text-[#00fff2]",
    iconBg: "border-[#00fff2]/40 bg-[#00fff2]/10 text-[#00fff2]",
  },
  magenta: {
    border: "border-[#ff00c8]/40 hover:border-[#ff00c8]",
    glow: "shadow-[0_0_20px_rgba(255,0,200,0.12)] hover:shadow-[0_0_30px_rgba(255,0,200,0.25)]",
    tagBg: "bg-[#ff00c8]/10 border-[#ff00c8]/30 text-[#ff00c8]",
    titleColor: "text-[#ff00c8]",
    iconBg: "border-[#ff00c8]/40 bg-[#ff00c8]/10 text-[#ff00c8]",
  },
  yellow: {
    border: "border-yellow-400/40 hover:border-yellow-400",
    glow: "shadow-[0_0_20px_rgba(250,204,21,0.12)] hover:shadow-[0_0_30px_rgba(250,204,21,0.25)]",
    tagBg: "bg-yellow-400/10 border-yellow-400/30 text-yellow-400",
    titleColor: "text-yellow-400",
    iconBg: "border-yellow-400/40 bg-yellow-400/10 text-yellow-400",
  },
};

export function FeaturePreviewCard({
  step,
  title,
  description,
  glowColor,
  icon,
}: FeaturePreviewCardProps) {
  const styling = COLOR_MAP[glowColor] || COLOR_MAP.cyan;

  return (
    <div
      className={`flex flex-col justify-between rounded-xl border bg-[#0a0a0f]/90 p-6 backdrop-blur-md transition-all duration-300 ${styling.border} ${styling.glow}`}
    >
      <div>
        {/* Top Header: Step Tag & Icon */}
        <div className="flex items-center justify-between">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl border ${styling.iconBg}`}
          >
            {icon}
          </div>
          <span
            className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-widest uppercase ${styling.tagBg}`}
          >
            {step}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`mt-5 font-mono text-xl font-bold tracking-tight text-white flex items-center gap-2`}
        >
          <span className={styling.titleColor}>&gt;</span>
          <span>{title}</span>
        </h3>

        {/* Description */}
        <p className="mt-3 font-mono text-xs sm:text-sm leading-relaxed text-zinc-400">
          {description}
        </p>
      </div>
    </div>
  );
}
