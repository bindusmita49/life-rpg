"use client";

import React, { useState } from "react";
import type { Mod, ModType } from "@/types/database";

interface ModCardProps {
  mod: Mod;
  isOwned: boolean;
  onPurchase: (mod: Mod) => Promise<boolean>;
  disabled?: boolean;
}

const TYPE_COLORS: Record<ModType, { border: string; bg: string; text: string }> = {
  theme: {
    border: "border-[#00fff2]/40",
    bg: "bg-[#00fff2]/10",
    text: "text-[#00fff2]",
  },
  badge: {
    border: "border-[#ff00c8]/40",
    bg: "bg-[#ff00c8]/10",
    text: "text-[#ff00c8]",
  },
  cosmetic: {
    border: "border-purple-400/40",
    bg: "bg-purple-400/10",
    text: "text-purple-400",
  },
};

export function ModCard({
  mod,
  isOwned,
  onPurchase,
  disabled = false,
}: ModCardProps) {
  const [loading, setLoading] = useState(false);

  const colors = TYPE_COLORS[mod.type] || TYPE_COLORS.theme;

  const handleBuy = async () => {
    if (isOwned || loading || disabled) return;
    setLoading(true);
    try {
      await onPurchase(mod);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-between rounded-lg border border-zinc-800 bg-[#0a0a0f]/90 p-5 backdrop-blur transition-all duration-300 hover:border-[#00fff2]/40 hover:shadow-[0_0_20px_rgba(0,255,242,0.1)]">
      {/* Top Header: Mod Type Tag */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={`rounded-full border ${colors.border} ${colors.bg} ${colors.text} px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wider uppercase`}
        >
          {mod.type}
        </span>

        {/* Cost Tag */}
        <div className="flex items-center gap-1.5 rounded-md border border-yellow-400/30 bg-yellow-400/10 px-2.5 py-0.5 font-mono text-xs font-bold text-yellow-300">
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
          <span>{mod.cost} CRED</span>
        </div>
      </div>

      {/* Mod Details */}
      <div className="my-4">
        <h3 className="font-mono text-base font-bold text-white tracking-tight">
          {mod.name}
        </h3>
      </div>

      {/* Purchase Action / Owned Badge */}
      <div className="mt-2 border-t border-zinc-800/80 pt-3">
        {isOwned ? (
          <div className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 py-2.5 font-mono text-xs font-bold text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>[ ACQUIRED // OWNED ]</span>
          </div>
        ) : (
          <button
            onClick={handleBuy}
            disabled={loading || disabled}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#00fff2] bg-[#00fff2]/15 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#00fff2] shadow-[0_0_15px_rgba(0,255,242,0.25)] transition hover:bg-[#00fff2] hover:text-[#0a0a0f] hover:shadow-[0_0_25px_rgba(0,255,242,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>PURCHASING MOD...</span>
              </>
            ) : (
              <span>[ BUY MOD // {mod.cost} CR ]</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
