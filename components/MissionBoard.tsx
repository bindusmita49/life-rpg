"use client";

import React, { useState } from "react";
import type { Mission, Operative } from "@/types/database";
import { NewMissionForm } from "./NewMissionForm";
import { MissionCard } from "./MissionCard";
import { createClient } from "@/lib/supabase/client";

interface ToastMessage {
  id: string;
  type: "success" | "error";
  text: string;
}

interface MissionBoardProps {
  initialMissions: Mission[];
  userId: string;
  onOperativeUpdated?: (updatedOperative: Operative, xpToNextLevel?: number, leveledUp?: boolean) => void;
}

export function MissionBoard({
  initialMissions,
  userId,
  onOperativeUpdated,
}: MissionBoardProps) {
  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [executingIds, setExecutingIds] = useState<Set<string>>(new Set());

  const supabase = createClient();

  const addToast = (text: string, type: "success" | "error") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleMissionCreated = (newMission: Mission) => {
    setMissions((prev) => [newMission, ...prev]);
    addToast(`DIRECTIVE DEPLOYED: "${newMission.title}"`, "success");
  };

  const handleDelete = async (missionId: string) => {
    // Optimistically remove from state
    const previous = [...missions];
    setMissions((prev) => prev.filter((m) => m.id !== missionId));

    try {
      const { error } = await supabase.from("missions").delete().eq("id", missionId);
      if (error) {
        // Rollback
        setMissions(previous);
        addToast("Failed to abort directive on network", "error");
      } else {
        addToast("Mission directive aborted and purged", "success");
      }
    } catch {
      setMissions(previous);
      addToast("Failed to abort directive", "error");
    }
  };

  const handleExecute = async (mission: Mission) => {
    if (executingIds.has(mission.id)) return;

    // Optimistic removal
    const previousMissions = [...missions];
    setMissions((prev) => prev.filter((m) => m.id !== mission.id));
    setExecutingIds((prev) => new Set(prev).add(mission.id));

    // Show optimistic rewards toast
    addToast(`+${mission.xp_value} XP, +${mission.credit_value} CREDITS`, "success");

    try {
      const res = await fetch("/api/execute-mission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missionId: mission.id }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Mission execution failed");
      }

      if (data.operative && onOperativeUpdated) {
        onOperativeUpdated(data.operative, data.xpToNextLevel, data.leveledUp);
      }
    } catch (err) {
      // Rollback on failure
      setMissions(previousMissions);
      addToast("Mission execution failed — try again", "error");
      console.error(err);
    } finally {
      setExecutingIds((prev) => {
        const next = new Set(prev);
        next.delete(mission.id);
        return next;
      });
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Toast Notification Container */}
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

      {/* New Mission Form */}
      <NewMissionForm userId={userId} onMissionCreated={handleMissionCreated} />

      {/* Mission Board Header */}
      <div>
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-mono text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-[#00fff2]">&gt;</span>
              <span>ACTIVE MISSION DIRECTIVES</span>
            </h2>
            <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-300">
              {missions.length}
            </span>
          </div>
          <span className="font-mono text-xs text-zinc-500">PRIORITY: HIGH</span>
        </div>

        {/* Mission Cards Grid: 1 column mobile, 2-3 columns desktop */}
        {missions.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-[#0a0a0f]/50 p-12 text-center font-mono">
            <div className="rounded-full border border-zinc-800 bg-zinc-900/60 p-4 text-zinc-600 mb-3">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-zinc-400">
              NO ACTIVE DIRECTIVES DETECTED
            </p>
            <p className="mt-1 text-xs text-zinc-600 max-w-sm">
              All neural assignments completed. Deploy a new mission above to continue synaptic progression.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {missions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onExecute={handleExecute}
                onDelete={handleDelete}
                executing={executingIds.has(mission.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
