import { createClient } from "@/lib/supabase/server";
import type { Operative, Mission, Augment, Mod, OwnedMod } from "@/types/database";

/**
 * Calculates XP threshold for the next level as a mathematical fallback
 * Formula: 100 * level (Level 1 requires 100 XP, Level 2 requires 200 XP, etc.)
 */
export function calculateXpToNextLevel(level: number): number {
  const safeLevel = Math.max(1, level);
  return safeLevel * 100;
}

export interface OperativeWithStats {
  operative: Operative;
  xpToNextLevel: number;
}

/**
 * Fetches an operative profile and calculates required XP for the next level
 * via Postgres RPC `xp_to_next_level(level)` with mathematical fallback.
 */
export async function getOperative(userId: string): Promise<OperativeWithStats | null> {
  const supabase = await createClient();

  const { data: operative, error } = await supabase
    .from("operatives")
    .select("id, email, callsign, level, current_xp, credits, streak_count, last_active_date, created_at, updated_at")
    .eq("id", userId)
    .single();

  if (error || !operative) {
    return null;
  }

  // Attempt to call RPC xp_to_next_level
  let xpToNextLevel = calculateXpToNextLevel(operative.level);

  try {
    const { data: rpcXp, error: rpcError } = await supabase.rpc("xp_to_next_level", {
      level: operative.level,
    });

    if (!rpcError && typeof rpcXp === "number" && rpcXp > 0) {
      xpToNextLevel = rpcXp;
    }
  } catch {
    // Graceful fallback to formula
    xpToNextLevel = calculateXpToNextLevel(operative.level);
  }

  return {
    operative,
    xpToNextLevel,
  };
}

/**
 * Fetches all active missions for a given user
 */
export async function getActiveMissions(userId: string): Promise<Mission[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("missions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data;
}

/**
 * Fetches augments progress for a given user (columns: id, user_id, name, xp, level)
 */
export async function getUserAugments(userId: string): Promise<Augment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("augments")
    .select("id, user_id, name, xp, level")
    .eq("user_id", userId);

  if (error || !data) {
    return [];
  }

  return data;
}

/**
 * Default sample catalog of mods for Black Market if table is empty
 * Matches exact mods table schema: id, name, cost, type
 */
export const DEFAULT_MOD_CATALOG: Mod[] = [
  {
    id: "mod-neon-hud",
    name: "CYBER-HUD OVERCLOCK",
    cost: 150,
    type: "theme",
  },
  {
    id: "mod-matrix-badge",
    name: "SHADOW OPERATIVE INSIGNIA",
    cost: 300,
    type: "badge",
  },
  {
    id: "mod-quantum-core",
    name: "QUANTUM NEURAL SYNC",
    cost: 500,
    type: "cosmetic",
  },
  {
    id: "mod-synthwave-theme",
    name: "OUTRUN PROTOCOL PALETTE",
    cost: 250,
    type: "theme",
  },
  {
    id: "mod-ghost-badge",
    name: "ZERO-TRACE GHOST TAG",
    cost: 400,
    type: "badge",
  },
  {
    id: "mod-plasma-aura",
    name: "PLASMA SHIELD VISUALIZER",
    cost: 600,
    type: "cosmetic",
  },
];

/**
 * Fetches catalog of available mods and user's owned mods
 */
export async function getMarketCatalog(userId: string): Promise<{
  mods: Mod[];
  ownedModIds: string[];
  ownedMods: OwnedMod[];
}> {
  const supabase = await createClient();

  // Fetch mods catalog (id, name, cost, type)
  const { data: modsData } = await supabase.from("mods").select("id, name, cost, type");
  const mods = (modsData && modsData.length > 0) ? modsData : DEFAULT_MOD_CATALOG;

  // Fetch user's owned mods (id, user_id, mod_id, acquired_at)
  const { data: ownedData } = await supabase
    .from("owned_mods")
    .select("id, user_id, mod_id, acquired_at")
    .eq("user_id", userId);

  const ownedMods = ownedData ?? [];
  const ownedModIds = ownedMods.map((item) => item.mod_id);

  return {
    mods,
    ownedModIds,
    ownedMods,
  };
}
