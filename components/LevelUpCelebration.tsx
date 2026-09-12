"use client";

import React, { useEffect, useState } from "react";

interface LevelUpCelebrationProps {
  newLevel: number;
  onComplete?: () => void;
}

export function LevelUpCelebration({
  newLevel,
  onComplete,
}: LevelUpCelebrationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-500 animate-fadeIn">
      {/* Cyan full screen flash glow */}
      <div className="absolute inset-0 bg-[#00fff2]/15 animate-ping" />

      {/* Cyberpunk Level Up Banner Card */}
      <div className="relative z-10 flex flex-col items-center justify-center rounded-2xl border-2 border-[#00fff2] bg-[#0a0a0f] p-8 sm:p-12 text-center shadow-[0_0_80px_rgba(0,255,242,0.6)] animate-bounce">
        <div className="font-mono text-xs font-bold tracking-widest text-[#ff00c8] uppercase">
          {"// SYNAPSE OVERCLOCK ACHIEVED"}
        </div>
        <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight font-mono text-[#00fff2] drop-shadow-[0_0_20px_#00fff2]">
          CLEARANCE LEVEL UP!
        </h2>
        <div className="mt-4 flex items-center gap-3 font-mono">
          <span className="text-zinc-400 text-sm">SECURITY TIER:</span>
          <span className="rounded-lg border border-[#00fff2] bg-[#00fff2]/20 px-4 py-1 text-2xl font-bold text-[#00fff2]">
            LEVEL {newLevel}
          </span>
        </div>
        <p className="mt-4 font-mono text-xs text-zinc-400">
          New system authorizations and augment parameters unlocked.
        </p>
      </div>
    </div>
  );
}
