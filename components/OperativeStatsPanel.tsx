import React from "react";
import { XPBar } from "./XPBar";
import type { Operative } from "@/types/database";

interface OperativeStatsPanelProps {
  operative?: Operative | null;
  xpToNextLevel?: number;
  loading?: boolean;
}

export function OperativeStatsPanel({
  operative,
  xpToNextLevel = 100,
  loading = false,
}: OperativeStatsPanelProps) {
  if (loading || !operative) {
    return (
      <div className="w-full rounded-xl border border-zinc-800 bg-[#0a0a0f]/85 p-6 backdrop-blur shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-lg border border-zinc-800/80 bg-zinc-900/60 p-4"
            >
              <div className="h-3 w-20 rounded bg-zinc-800" />
              <div className="mt-4 h-8 w-24 rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { level, current_xp, credits, streak_count } = operative;

  return (
    <div className="w-full rounded-xl border border-[#00fff2]/30 bg-[#0a0a0f]/90 p-5 sm:p-6 backdrop-blur-md shadow-[0_0_25px_rgba(0,255,242,0.12)]">
      {/* 4 Stat Blocks: Horizontal on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat Block 1: CLEARANCE LEVEL */}
        <div className="flex flex-col justify-between rounded-lg border border-zinc-800 bg-black/50 p-4 transition-all hover:border-[#00fff2]/40 hover:shadow-[0_0_15px_rgba(0,255,242,0.1)]">
          <div className="font-mono text-xs text-zinc-400 font-semibold tracking-wider uppercase">
            CLEARANCE LEVEL
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-[#00fff2] drop-shadow-[0_0_8px_rgba(0,255,242,0.4)]">
              {level}
            </div>
            <span className="font-mono text-[11px] text-zinc-500 font-medium">
              TIER {level}
            </span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-zinc-500">
            Grid Authorization Granted
          </div>
        </div>

        {/* Stat Block 2: CREDITS */}
        <div className="flex flex-col justify-between rounded-lg border border-zinc-800 bg-black/50 p-4 transition-all hover:border-yellow-400/40 hover:shadow-[0_0_15px_rgba(250,204,21,0.1)]">
          <div className="font-mono text-xs text-zinc-400 font-semibold tracking-wider uppercase">
            CREDITS
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]">
              {credits}
            </div>
            {/* Currency Coin Icon */}
            <div className="rounded-full border border-yellow-400/40 bg-yellow-400/10 p-2 text-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.2)]">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 6v12M15 9.5a3 3 0 0 0-3-1.5H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H12a3 3 0 0 1-3-1.5" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-[11px] font-mono text-zinc-500">
            Black Market Currency
          </div>
        </div>

        {/* Stat Block 3: UPTIME STREAK */}
        <div className="flex flex-col justify-between rounded-lg border border-zinc-800 bg-black/50 p-4 transition-all hover:border-[#ff00c8]/40 hover:shadow-[0_0_15px_rgba(255,0,200,0.1)]">
          <div className="font-mono text-xs text-zinc-400 font-semibold tracking-wider uppercase">
            UPTIME STREAK
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-[#ff00c8] drop-shadow-[0_0_8px_rgba(255,0,200,0.4)]">
              {streak_count}{" "}
              <span className="text-base font-medium text-zinc-500">DAYS</span>
            </div>
            {/* Flame Icon */}
            <div className="rounded-full border border-[#ff00c8]/40 bg-[#ff00c8]/10 p-2 text-[#ff00c8] shadow-[0_0_8px_rgba(255,0,200,0.2)]">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-[11px] font-mono text-zinc-500">
            Daily Consecutive Missions
          </div>
        </div>

        {/* Stat Block 4: NEURAL XP (Contains XPBar) */}
        <div className="flex flex-col justify-between rounded-lg border border-zinc-800 bg-black/50 p-4 transition-all hover:border-[#00fff2]/40 hover:shadow-[0_0_15px_rgba(0,255,242,0.1)]">
          <div className="font-mono text-xs text-zinc-400 font-semibold tracking-wider uppercase">
            NEURAL XP
          </div>
          <div className="my-2">
            <XPBar
              currentXp={current_xp}
              xpToNextLevel={xpToNextLevel}
              level={level}
            />
          </div>
          <div className="text-[11px] font-mono text-zinc-500">
            Synaptic Progression Status
          </div>
        </div>
      </div>
    </div>
  );
}
