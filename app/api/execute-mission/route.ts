import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateXpToNextLevel } from "@/lib/supabase/queries";
import type { AugmentType } from "@/types/database";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verify session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: No active session detected" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { missionId } = body;

    if (!missionId) {
      return NextResponse.json(
        { error: "Missing parameter: missionId is required" },
        { status: 400 }
      );
    }

    // Fetch the mission
    const { data: mission, error: missionError } = await supabase
      .from("missions")
      .select("*")
      .eq("id", missionId)
      .eq("user_id", user.id)
      .single();

    if (missionError || !mission) {
      return NextResponse.json(
        { error: "Mission not found or not owned by operative" },
        { status: 404 }
      );
    }

    if (mission.status === "completed") {
      return NextResponse.json(
        { error: "Mission has already been completed" },
        { status: 400 }
      );
    }

    // Mark mission completed
    await supabase
      .from("missions")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", missionId);

    // Fetch operative data
    const { data: operative, error: opError } = await supabase
      .from("operatives")
      .select("*")
      .eq("id", user.id)
      .single();

    if (opError || !operative) {
      return NextResponse.json(
        { error: "Operative record not found" },
        { status: 404 }
      );
    }

    // Add XP & credit rewards
    const xpGained = mission.xp_value || 50;
    const creditsGained = mission.credit_value || 25;

    let currentLevel = operative.level || 1;
    let currentXp = (operative.current_xp || 0) + xpGained;
    const currentCredits = (operative.credits || 0) + creditsGained;

    // Level-up loop with carry-over
    let xpThreshold = calculateXpToNextLevel(currentLevel);

    // Check RPC if available
    try {
      const { data: rpcVal, error: rpcErr } = await supabase.rpc("xp_to_next_level", {
        level: currentLevel,
      });
      if (!rpcErr && typeof rpcVal === "number" && rpcVal > 0) {
        xpThreshold = rpcVal;
      }
    } catch {
      xpThreshold = calculateXpToNextLevel(currentLevel);
    }

    let leveledUp = false;
    while (currentXp >= xpThreshold) {
      currentLevel += 1;
      currentXp -= xpThreshold;
      leveledUp = true;
      xpThreshold = calculateXpToNextLevel(currentLevel);
    }

    // Streak count calculation
    const today = new Date().toISOString().split("T")[0];
    const lastActive = operative.last_active_date;
    let newStreak = operative.streak_count || 0;

    if (!lastActive) {
      newStreak = 1;
    } else {
      const lastDate = new Date(lastActive);
      const currentDate = new Date(today);
      const diffTime = currentDate.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day, streak unchanged
        newStreak = operative.streak_count || 1;
      } else if (diffDays === 1) {
        // Consecutive day, increment
        newStreak = (operative.streak_count || 0) + 1;
      } else {
        // Streak broken, reset to 1
        newStreak = 1;
      }
    }

    // Update operative
    const { data: updatedOperative, error: updateError } = await supabase
      .from("operatives")
      .update({
        level: currentLevel,
        current_xp: currentXp,
        credits: currentCredits,
        streak_count: newStreak,
        last_active_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError || !updatedOperative) {
      return NextResponse.json(
        { error: "Failed to update operative record" },
        { status: 500 }
      );
    }

    // Update or insert into augments table (columns: id, user_id, name, xp, level)
    const augmentName: AugmentType = mission.augment || "Intellect";
    try {
      const { data: existingAugment } = await supabase
        .from("augments")
        .select("*")
        .eq("user_id", user.id)
        .eq("name", augmentName)
        .single();

      if (existingAugment) {
        const newAugmentXp = (existingAugment.xp || 0) + xpGained;
        const newAugmentLevel = Math.floor(newAugmentXp / 100) + 1;
        await supabase
          .from("augments")
          .update({
            xp: newAugmentXp,
            level: newAugmentLevel,
          })
          .eq("id", existingAugment.id);
      } else {
        await supabase.from("augments").insert({
          user_id: user.id,
          name: augmentName,
          xp: xpGained,
          level: Math.floor(xpGained / 100) + 1,
        });
      }
    } catch (augErr) {
      console.warn("Augment update notice:", augErr);
    }

    return NextResponse.json({
      success: true,
      operative: updatedOperative,
      xpToNextLevel: xpThreshold,
      leveledUp,
      xpGained,
      creditsGained,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
