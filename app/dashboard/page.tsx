import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOperative, getActiveMissions, calculateXpToNextLevel } from "@/lib/supabase/queries";
import { DashboardView } from "./dashboard-view";
import type { Operative } from "@/types/database";

export const metadata: Metadata = {
  title: "Command Deck // Dashboard - Life RPG",
  description: "Operative Headquarters, Neural XP Metrics, and Mission Board",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // Check Supabase session server-side
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch operative data and active missions
  const opData = await getOperative(user.id);

  // If operative doesn't exist in DB, create/fallback
  let operative: Operative;
  let xpToNextLevel: number;

  if (opData) {
    operative = opData.operative;
    xpToNextLevel = opData.xpToNextLevel;
  } else {
    // Default fallback operative object
    const defaultOperative: Operative = {
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

    // Try to initialize row
    await supabase.from("operatives").insert(defaultOperative);
    operative = defaultOperative;
    xpToNextLevel = calculateXpToNextLevel(1);
  }

  const initialMissions = await getActiveMissions(user.id);

  return (
    <DashboardView
      initialOperative={operative}
      initialXpToNextLevel={xpToNextLevel}
      initialMissions={initialMissions}
      userId={user.id}
    />
  );
}
