import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMarketCatalog, getOperative } from "@/lib/supabase/queries";
import { BlackMarketView } from "./black-market-view";
import type { Operative } from "@/types/database";

export const metadata: Metadata = {
  title: "Black Market // Mods & Augments - Life RPG",
  description: "Acquire cosmetic upgrades, theme mods, and badges with your credits",
};

export default async function BlackMarketPage() {
  const supabase = await createClient();

  // Verify session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch operative info
  const opData = await getOperative(user.id);

  const operative: Operative = opData?.operative ?? {
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

  const { mods, ownedModIds } = await getMarketCatalog(user.id);

  return (
    <BlackMarketView
      mods={mods}
      initialOwnedModIds={ownedModIds}
      initialOperative={operative}
    />
  );
}
