"use client";

import React, { useState } from "react";
import type { Mission, AugmentType } from "@/types/database";

interface MissionCardProps {
  mission: Mission;
  onExecute: (mission: Mission) => void;
  onDelete: (missionId: string) => void;
  executing?: boolean;
}

const AUGMENT_COLORS: Record<AugmentType, { border: string; bg: string; text: string }> = {
  Intellect: {
    border: "border-[#00fff2]/40",
    bg: "bg-[#00fff2]/10",
    text: "text-[#00fff2]",
  },
  Strength: {
    border: "border-[#ff00c8]/40",
    bg: "bg-[#ff00c8]/10",
    text: "text-[#ff00c8]",
  },
  Discipline: {
    border: "border-yellow-400/40",
    bg: "bg-yellow-400/10",
    text: "text-yellow-400",
  },
  Creativity: {
    border: "border-emerald-400/40",
    bg: "bg-emerald-400/10",
    text: "text-emerald-400",
  },
};

export function MissionCard({
  mission,
  onExecute,
  onDelete,
  executing = false,
}: MissionCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const colors = AUGMENT_COLORS[mission.augment] || AUGMENT_COLORS.Intellect;

  return (
    <div className="relative flex flex-col justify-between rounded-lg border border-zinc-800 bg-[#0a0a0f]/90 p-5 backdrop-blur transition-all duration-300 hover:border-[#00fff2]/40 hover:shadow-[0_0_20px_rgba(0,255,242,0.1)]">
      {/* Top Header: Augment Tag & Delete Button */}
      <div className="flex items-start justify-between gap-2">
        <span
          className={`rounded-full border ${colors.border} ${colors.bg} ${colors.text} px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wider uppercase`}
        >
          {mission.augment}
        </span>

        {/* Delete button with inline confirmation */}
        <div className="flex items-center gap-1 font-mono text-xs">
          {confirmDelete ? (
            <div className="flex items-center gap-1.5 rounded-lg border border-[#ff00c8]/40 bg-[#ff00c8]/10 px-2 py-1">
              <span className="text-[10px] text-[#ff00c8] font-bold">ABORT?</span>
              <button
                onClick={() => onDelete(mission.id)}
                className="rounded px-1.5 py-0.5 text-[10px] font-bold text-red-400 hover:bg-red-500/20"
                title="Confirm Abort"
              >
                YES
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded px-1.5 py-0.5 text-[10px] font-bold text-zinc-400 hover:bg-zinc-700/40"
                title="Cancel"
              >
                NO
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="rounded-lg p-1 text-zinc-600 transition hover:bg-zinc-800 hover:text-[#ff00c8]"
              title="Abort Mission"
              aria-label="Delete Mission"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mission Title */}
      <div className="my-4">
        <h3 className="font-mono text-base font-bold text-white tracking-tight leading-snug">
          {mission.title}
        </h3>
      </div>

      {/* Reward Badges & Action Buttons */}
      <div className="mt-2 flex flex-col gap-3 border-t border-zinc-800/80 pt-3">
        <div className="flex items-center gap-3 font-mono text-xs">
          {/* XP Reward */}
          <div className="flex items-center gap-1.5 rounded-md border border-[#00fff2]/30 bg-[#00fff2]/10 px-2.5 py-1 text-[#00fff2]">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span className="font-bold">+{mission.xp_value} XP</span>
          </div>

          {/* Credit Reward */}
          <div className="flex items-center gap-1.5 rounded-md border border-yellow-400/30 bg-yellow-400/10 px-2.5 py-1 text-yellow-300">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 6v12M15 9.5a3 3 0 0 0-3-1.5H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H12a3 3 0 0 1-3-1.5" />
            </svg>
            <span className="font-bold">+{mission.credit_value} CRED</span>
          </div>
        </div>

        {/* Primary Execute Button */}
        <button
          onClick={() => onExecute(mission)}
          disabled={executing}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#00fff2] py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#0a0a0f] shadow-[0_0_15px_rgba(0,255,242,0.4)] transition hover:bg-[#00e6da] hover:shadow-[0_0_25px_rgba(0,255,242,0.6)] disabled:opacity-50"
        >
          {executing ? (
            <>
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-black border-t-transparent" />
              <span>EXECUTING DIRECTIVE...</span>
            </>
          ) : (
            <span>[ EXECUTE MISSION ]</span>
          )}
        </button>
      </div>
    </div>
  );
}
