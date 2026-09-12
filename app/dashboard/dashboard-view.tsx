"use client";

import React, { useState } from "react";
import type { Operative, Mission } from "@/types/database";
import { NavBar } from "@/components/NavBar";
import { OperativeStatsPanel } from "@/components/OperativeStatsPanel";
import { MissionBoard } from "@/components/MissionBoard";
import { LevelUpCelebration } from "@/components/LevelUpCelebration";

interface DashboardViewProps {
  initialOperative: Operative;
  initialXpToNextLevel: number;
  initialMissions: Mission[];
  userId: string;
}

export function DashboardView({
  initialOperative,
  initialXpToNextLevel,
  initialMissions,
  userId,
}: DashboardViewProps) {
  const [operative, setOperative] = useState<Operative>(initialOperative);
  const [xpToNextLevel, setXpToNextLevel] = useState<number>(initialXpToNextLevel);
  const [celebrateLevel, setCelebrateLevel] = useState<number | null>(null);

  const handleOperativeUpdated = (
    updatedOperative: Operative,
    updatedXpToNextLevel?: number,
    leveledUp?: boolean
  ) => {
    if (leveledUp || updatedOperative.level > operative.level) {
      setCelebrateLevel(updatedOperative.level);
    }
    setOperative(updatedOperative);
    if (updatedXpToNextLevel) {
      setXpToNextLevel(updatedXpToNextLevel);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-[#ededed] selection:bg-[#ff00c8] selection:text-white">
      {/* Background Ambient Glows & Scanlines */}
      <div className="pointer-events-none fixed inset-0 scanlines opacity-40" />
      <div className="pointer-events-none fixed -top-40 left-1/4 h-96 w-96 rounded-full bg-[#00fff2]/10 blur-[140px]" />
      <div className="pointer-events-none fixed -bottom-40 right-1/4 h-96 w-96 rounded-full bg-[#ff00c8]/10 blur-[140px]" />

      {/* Level Up Celebration Overlay */}
      {celebrateLevel !== null && (
        <LevelUpCelebration
          newLevel={celebrateLevel}
          onComplete={() => setCelebrateLevel(null)}
        />
      )}

      {/* Top Navbar */}
      <NavBar
        credits={operative.credits}
        callsign={operative.callsign || operative.email?.split("@")[0] || "OPERATIVE"}
      />

      {/* Main Container */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-8 py-8 space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-800 pb-4">
          <div>
            <div className="font-mono text-xs text-[#00fff2] font-semibold flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[#00fff2] animate-pulse" />
              <span>COMMAND DECK // ACTIVE HUD</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-white">
              OPERATIVE OVERVIEW
            </h1>
          </div>
          <div className="font-mono text-xs text-zinc-500">
            SEC_ID: <span className="text-zinc-300 font-semibold">{operative.id.slice(0, 8)}...</span>
          </div>
        </div>

        {/* 1. Operative Stats Panel */}
        <OperativeStatsPanel
          operative={operative}
          xpToNextLevel={xpToNextLevel}
        />

        {/* 2. Mission Board System */}
        {/* MISSION BOARD GOES HERE */}
        <section className="pt-2">
          <MissionBoard
            initialMissions={initialMissions}
            userId={userId}
            onOperativeUpdated={handleOperativeUpdated}
          />
        </section>
      </main>
    </div>
  );
}
