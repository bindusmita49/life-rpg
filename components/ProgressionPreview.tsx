import React from "react";

export function ProgressionPreview() {
  const currentXp = 620;
  const xpToNextLevel = 913;
  const percentage = (currentXp / xpToNextLevel) * 100;

  return (
    <section className="relative mx-auto max-w-4xl px-4 sm:px-8 py-12">
      <div className="rounded-xl border border-[#00fff2]/30 bg-[#0a0a0f]/90 p-6 sm:p-8 backdrop-blur-md shadow-[0_0_30px_rgba(0,255,242,0.12)]">
        {/* Section Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-800/80 pb-4">
          <div>
            <div className="font-mono text-xs text-[#00fff2] font-semibold tracking-wider flex items-center gap-2 uppercase">
              <span className="inline-block h-2 w-2 rounded-full bg-[#00fff2] animate-pulse" />
              <span>DYNAMIC SCALING // REAL-TIME CALCULATION</span>
            </div>
            <h2 className="mt-1 font-mono text-xl sm:text-2xl font-bold tracking-tight text-white">
              THE PROGRESSION ENGINE
            </h2>
          </div>
          <span className="font-mono text-xs text-zinc-500">
            STATUS: ACTIVE TIER 5
          </span>
        </div>

        {/* Mock Live-style XPBar */}
        <div className="space-y-3">
          {/* Progress Track (rounded-full, not angled) */}
          <div className="relative h-4 w-full overflow-hidden rounded-full bg-zinc-900 border border-zinc-800 p-[1px]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00fff2] via-[#a855f7] to-[#ff00c8] shadow-[0_0_15px_rgba(0,255,242,0.6)] animate-pulse transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Progress Label Below Bar */}
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[#00fff2] font-semibold text-sm">
              620 / 913 XP
            </span>
            <span className="text-zinc-400 font-medium tracking-wider uppercase">
              TO LEVEL 6
            </span>
          </div>
        </div>

        {/* Verbatim Caption */}
        <p className="mt-6 border-t border-zinc-800/80 pt-4 font-mono text-xs sm:text-sm leading-relaxed text-zinc-400">
          Leveling isn&apos;t linear. Level 6 costs 913 XP. Level 10 costs over 1,800.
          The grind scales — so does the payoff.
        </p>
      </div>
    </section>
  );
}
