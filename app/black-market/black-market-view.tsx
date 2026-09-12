"use client";

import React, { useState } from "react";
import type { Mod, Operative } from "@/types/database";
import { NavBar } from "@/components/NavBar";
import { ModCard } from "@/components/ModCard";

interface BlackMarketViewProps {
  mods: Mod[];
  initialOwnedModIds: string[];
  initialOperative: Operative;
}

export function BlackMarketView({
  mods,
  initialOwnedModIds,
  initialOperative,
}: BlackMarketViewProps) {
  const [credits, setCredits] = useState(initialOperative.credits);
  const [ownedModIds, setOwnedModIds] = useState<Set<string>>(new Set(initialOwnedModIds));
  const [toasts, setToasts] = useState<Array<{ id: string; text: string; type: "success" | "error" }>>([]);

  const addToast = (text: string, type: "success" | "error") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handlePurchase = async (mod: Mod): Promise<boolean> => {
    if (credits < mod.cost) {
      addToast("Not enough credits to purchase mod", "error");
      return false;
    }

    try {
      const res = await fetch("/api/purchase-mod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modId: mod.id }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        addToast(data.error || "Purchase failed", "error");
        return false;
      }

      // Update state
      if (typeof data.credits === "number") {
        setCredits(data.credits);
      } else {
        setCredits((prev) => Math.max(0, prev - mod.cost));
      }

      setOwnedModIds((prev) => new Set(prev).add(mod.id));
      addToast(`MOD ACQUIRED: ${mod.name}`, "success");
      return true;
    } catch {
      addToast("Network failure during transaction", "error");
      return false;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-[#ededed] selection:bg-[#ff00c8] selection:text-white">
      {/* Ambient Lighting & Scanlines */}
      <div className="pointer-events-none fixed inset-0 scanlines opacity-40" />
      <div className="pointer-events-none fixed -top-40 right-1/4 h-96 w-96 rounded-full bg-[#ff00c8]/10 blur-[140px]" />
      <div className="pointer-events-none fixed -bottom-40 left-1/4 h-96 w-96 rounded-full bg-[#00fff2]/10 blur-[140px]" />

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2 rounded-lg border p-3 font-mono text-xs shadow-2xl backdrop-blur-md animate-fadeIn ${
              toast.type === "success"
                ? "border-[#00fff2] bg-[#0a0a0f]/95 text-[#00fff2] shadow-[0_0_20px_rgba(0,255,242,0.3)]"
                : "border-[#ff00c8] bg-[#0a0a0f]/95 text-[#ff00c8] shadow-[0_0_20px_rgba(255,0,200,0.3)]"
            }`}
          >
            <span className="text-sm">{toast.type === "success" ? "[+]" : "[!]"}</span>
            <span className="font-semibold">{toast.text}</span>
          </div>
        ))}
      </div>

      {/* Top Navbar */}
      <NavBar
        credits={credits}
        callsign={initialOperative.callsign || initialOperative.email?.split("@")[0] || "OPERATIVE"}
      />

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-8 py-8 space-y-8">
        {/* Header Title & Market Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <div className="font-mono text-xs text-[#ff00c8] font-semibold flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[#ff00c8] animate-pulse" />
              <span>BLACK MARKET // SHADOW NETWORK</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-4xl font-extrabold tracking-tight font-mono text-white">
              BLACK MARKET
            </h1>
            <p className="mt-1 font-mono text-xs text-zinc-400">
              Acquire classified visual themes, prestige badges, and neural augments using earned credits.
            </p>
          </div>

          {/* Credits Balance Box */}
          <div className="flex items-center gap-3 rounded-xl border border-yellow-400/40 bg-yellow-400/10 px-5 py-3 font-mono shadow-[0_0_20px_rgba(250,204,21,0.15)]">
            <div className="text-left">
              <div className="text-[10px] text-yellow-500 font-semibold uppercase">
                AVAILABLE BALANCE
              </div>
              <div className="text-2xl font-extrabold text-yellow-300">
                § {credits} <span className="text-xs text-yellow-500 font-normal">CREDITS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mod Cards Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mods.map((mod) => (
            <ModCard
              key={mod.id}
              mod={mod}
              isOwned={ownedModIds.has(mod.id)}
              onPurchase={handlePurchase}
              disabled={credits < mod.cost && !ownedModIds.has(mod.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
