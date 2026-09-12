import React from "react";

interface XPBarProps {
  currentXp: number;
  xpToNextLevel: number;
  level: number;
  className?: string;
  showDetails?: boolean;
}

export function XPBar({
  currentXp,
  xpToNextLevel,
  level,
  className = "",
  showDetails = true,
}: XPBarProps) {
  const safeXpToNext = Math.max(1, xpToNextLevel);
  const safeCurrentXp = Math.max(0, currentXp);
  const percentage = Math.min(100, Math.max(0, (safeCurrentXp / safeXpToNext) * 100));
  const nextLevel = level + 1;

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Track (rounded-full, no angled edges) */}
      <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-zinc-900 border border-zinc-800 p-[1px]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#00fff2] via-[#a855f7] to-[#ff00c8] transition-all duration-500 shadow-[0_0_12px_rgba(0,255,242,0.6)] animate-pulse"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Progress Label Below Bar */}
      {showDetails && (
        <div className="mt-2 flex items-center justify-between font-mono text-xs text-zinc-400">
          <span className="text-[#00fff2] font-semibold">
            {safeCurrentXp} / {safeXpToNext} XP
          </span>
          <span className="text-zinc-500 font-medium tracking-wider uppercase text-[11px]">
            TO LEVEL {nextLevel}
          </span>
        </div>
      )}
    </div>
  );
}
