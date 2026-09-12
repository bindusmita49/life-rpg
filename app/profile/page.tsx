import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOperative, getUserAugments, getMarketCatalog } from "@/lib/supabase/queries";
import { NavBar } from "@/components/NavBar";
import { InventoryGrid } from "@/components/InventoryGrid";
import type { AugmentType, Mod } from "@/types/database";

export const metadata: Metadata = {
  title: "Operative Profile // Dossier - Life RPG",
  description: "Synaptic Augment Progressions and Acquired Mods Locker",
};

const ALL_AUGMENTS: AugmentType[] = ["Intellect", "Strength", "Discipline", "Creativity"];

const AUGMENT_CONFIG: Record<
  AugmentType,
  { label: string; gradient: string; glow: string; textColor: string; icon: string }
> = {
  Intellect: {
    label: "INTELLECT // NEURAL COMPUTE",
    gradient: "from-[#00fff2] to-cyan-600",
    glow: "shadow-[0_0_12px_rgba(0,255,242,0.6)]",
    textColor: "text-[#00fff2]",
    icon: "🧠",
  },
  Strength: {
    label: "STRENGTH // BIOMECHANICS",
    gradient: "from-[#ff00c8] to-pink-600",
    glow: "shadow-[0_0_12px_rgba(255,0,200,0.6)]",
    textColor: "text-[#ff00c8]",
    icon: "⚡",
  },
  Discipline: {
    label: "DISCIPLINE // WILLPOWER FOCUS",
    gradient: "from-yellow-400 to-amber-600",
    glow: "shadow-[0_0_12px_rgba(250,204,21,0.6)]",
    textColor: "text-yellow-400",
    icon: "🛡️",
  },
  Creativity: {
    label: "CREATIVITY // SYNTHETIC VISION",
    gradient: "from-emerald-400 to-teal-600",
    glow: "shadow-[0_0_12px_rgba(52,211,153,0.6)]",
    textColor: "text-emerald-400",
    icon: "✨",
  },
};

export default async function ProfilePage() {
  const supabase = await createClient();

  // Verify session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch operative, augments, and owned mods
  const opData = await getOperative(user.id);
  const operative = opData?.operative ?? {
    id: user.id,
    email: user.email ?? null,
    callsign: (user.user_metadata?.callsign as string) || user.email?.split("@")[0] || "Operative",
    level: 1,
    current_xp: 0,
    credits: 0,
    streak_count: 0,
    last_active_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const userAugments = await getUserAugments(user.id);
  const { mods, ownedModIds } = await getMarketCatalog(user.id);

  // Map owned mods with details
  const populatedOwnedMods: Mod[] = ownedModIds.map((id) => {
    const existing = mods.find((m) => m.id === id);
    if (existing) return existing;
    return {
      id,
      name: "CLASSIFIED MOD",
      cost: 0,
      type: "theme",
    };
  });

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-[#ededed] selection:bg-[#ff00c8] selection:text-white">
      {/* Background Ambient Lighting & Scanlines */}
      <div className="pointer-events-none fixed inset-0 scanlines opacity-40" />
      <div className="pointer-events-none fixed -top-40 left-1/3 h-96 w-96 rounded-full bg-[#00fff2]/10 blur-[140px]" />
      <div className="pointer-events-none fixed -bottom-40 right-1/3 h-96 w-96 rounded-full bg-[#ff00c8]/10 blur-[140px]" />

      {/* Top Navbar */}
      <NavBar
        credits={operative.credits}
        callsign={operative.callsign || operative.email?.split("@")[0] || "OPERATIVE"}
      />

      {/* Main Container */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-8 py-8 space-y-8">
        {/* Profile Dossier Header */}
        <div className="rounded-xl border border-[#00fff2]/30 bg-[#0a0a0f]/90 p-6 sm:p-8 backdrop-blur shadow-[0_0_25px_rgba(0,255,242,0.12)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#00fff2]">
                <span className="inline-block h-2 w-2 rounded-full bg-[#00fff2] animate-pulse" />
                <span>OPERATIVE CLASSIFIED DOSSIER // RESTRICTED</span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight font-mono text-white">
                OPERATIVE {operative.callsign?.toUpperCase() || "OPERATIVE"}
              </h1>
              <p className="mt-1 font-mono text-xs text-zinc-400">
                IDENTIFIER: <span className="text-zinc-300">{operative.id}</span> | EMAIL:{" "}
                <span className="text-zinc-300">{operative.email}</span>
              </p>
            </div>

            <div className="flex items-center gap-4 font-mono">
              <div className="rounded-lg border border-zinc-800 bg-black/60 px-4 py-2 text-center">
                <div className="text-[10px] text-zinc-500 uppercase">CLEARANCE</div>
                <div className="text-lg font-bold text-[#00fff2]">LVL {operative.level}</div>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-black/60 px-4 py-2 text-center">
                <div className="text-[10px] text-zinc-500 uppercase">STREAK</div>
                <div className="text-lg font-bold text-[#ff00c8]">{operative.streak_count} DAYS</div>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-black/60 px-4 py-2 text-center">
                <div className="text-[10px] text-zinc-500 uppercase">BALANCE</div>
                <div className="text-lg font-bold text-yellow-400">§ {operative.credits}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Augment Progressions */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="font-mono text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-[#00fff2]">&gt;</span>
              <span>SYNAPTIC AUGMENT PROGRESSIONS</span>
            </h2>
            <span className="font-mono text-xs text-zinc-500">4 ACTIVE CHANNELS</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ALL_AUGMENTS.map((augType) => {
              const cfg = AUGMENT_CONFIG[augType];
              const match = userAugments.find((a) => a.name === augType);
              const augXp = match?.xp ?? 0;
              const augLevel = match?.level ?? Math.floor(augXp / 100) + 1;
              const nextLevelXp = 100;
              const currentTierXp = augXp % 100;
              const percentage = Math.min(100, Math.max(0, (currentTierXp / nextLevelXp) * 100));

              return (
                <div
                  key={augType}
                  className="rounded-xl border border-zinc-800 bg-[#0a0a0f]/90 p-5 backdrop-blur transition hover:border-zinc-700"
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className={`font-bold tracking-wider uppercase ${cfg.textColor}`}>
                      {cfg.label}
                    </span>
                    <span className="rounded-md border border-zinc-800 bg-black/50 px-2 py-0.5 font-bold text-zinc-200">
                      TIER {augLevel}
                    </span>
                  </div>

                  {/* Rounded Stat Bar (similar to XPBar) */}
                  <div className="mt-4">
                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-zinc-900 border border-zinc-800 p-[1px]">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${cfg.gradient} ${cfg.glow} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between font-mono text-xs text-zinc-400">
                      <span>{currentTierXp} / {nextLevelXp} XP</span>
                      <span className="text-zinc-500 text-[11px]">TOTAL: {augXp} XP</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Acquired Inventory Grid */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span className="text-[#ff00c8]">&gt;</span>
                <span>ACQUIRED MODS &amp; COSMETICS LOCKER</span>
              </h2>
              <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-300">
                {populatedOwnedMods.length}
              </span>
            </div>
            <span className="font-mono text-xs text-zinc-500">STORAGE: ENCRYPTED</span>
          </div>

          <InventoryGrid ownedMods={populatedOwnedMods} />
        </section>
      </main>
    </div>
  );
}
