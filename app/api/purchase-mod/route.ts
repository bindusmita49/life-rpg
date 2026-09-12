import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_MOD_CATALOG } from "@/lib/supabase/queries";

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
    const { modId } = body;

    if (!modId) {
      return NextResponse.json(
        { error: "Missing parameter: modId is required" },
        { status: 400 }
      );
    }

    // Check if mod is already owned
    const { data: existingOwnership } = await supabase
      .from("owned_mods")
      .select("*")
      .eq("user_id", user.id)
      .eq("mod_id", modId)
      .single();

    if (existingOwnership) {
      return NextResponse.json(
        { error: "Already owned" },
        { status: 400 }
      );
    }

    // Fetch mod cost from database or catalog
    let modCost = 150;
    const { data: dbMod } = await supabase
      .from("mods")
      .select("*")
      .eq("id", modId)
      .single();

    if (dbMod) {
      modCost = dbMod.cost;
    } else {
      const catalogMod = DEFAULT_MOD_CATALOG.find((m) => m.id === modId);
      if (catalogMod) {
        modCost = catalogMod.cost;
      }
    }

    // Fetch user's operative credits
    const { data: operative, error: opError } = await supabase
      .from("operatives")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (opError || !operative) {
      return NextResponse.json(
        { error: "Operative profile not found" },
        { status: 404 }
      );
    }

    const currentCredits = operative.credits || 0;

    if (currentCredits < modCost) {
      return NextResponse.json(
        { error: "Not enough credits" },
        { status: 400 }
      );
    }

    // Deduct credits
    const updatedCredits = currentCredits - modCost;
    const { error: updateError } = await supabase
      .from("operatives")
      .update({
        credits: updatedCredits,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update credits balance" },
        { status: 500 }
      );
    }

    // Insert into owned_mods
    await supabase.from("owned_mods").insert({
      user_id: user.id,
      mod_id: modId,
      acquired_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      credits: updatedCredits,
      modId,
      message: "Mod successfully acquired",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
