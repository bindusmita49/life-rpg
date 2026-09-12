import React from "react";
import type { Mod, ModType } from "@/types/database";

interface InventoryGridProps {
  ownedMods: Array<Mod & { acquired_at?: string | null }>;
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

export function InventoryGrid({ ownedMods }: InventoryGridProps) {
  if (ownedMods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-[#0a0a0f]/60 p-8 text-center font-mono">
        <div className="rounded-full border border-zinc-800 bg-zinc-900/60 p-3 text-zinc-600 mb-2">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-zinc-400">INVENTORY LOCKER EMPTY</p>
        <p className="mt-1 text-xs text-zinc-600">
          Visit the Black Market to purchase visual themes, prestige badges, and augments.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {ownedMods.map((mod) => {
        const colors = TYPE_COLORS[mod.type] || TYPE_COLORS.theme;

        return (
          <div
            key={mod.id}
            className="flex items-center justify-between rounded-lg border border-zinc-800 bg-[#0a0a0f]/90 p-4 backdrop-blur transition hover:border-[#00fff2]/40 hover:shadow-[0_0_15px_rgba(0,255,242,0.1)]"
          >
            <div className="space-y-1">
              <div className="font-mono text-sm font-bold text-white tracking-tight">
                {mod.name}
              </div>
              <span
                className={`inline-block rounded-full border ${colors.border} ${colors.bg} ${colors.text} px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider`}
              >
                {mod.type}
              </span>
            </div>

            {/* Checkmark icon */}
            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 p-1.5 text-emerald-400">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
