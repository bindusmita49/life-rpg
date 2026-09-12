"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SupabaseClientTest() {
  const [clientState, setClientState] = useState<{
    status: "checking" | "initialized" | "error";
    details: string;
  }>({
    status: "checking",
    details: "Initializing Supabase browser client...",
  });

  useEffect(() => {
    let isMounted = true;

    async function verifyClient() {
      try {
        const supabase = createClient();
        if (!supabase) {
          throw new Error("Browser Supabase client returned null");
        }
        await supabase.auth.getSession();
        if (isMounted) {
          setClientState({
            status: "initialized",
            details: "Browser client initialized successfully",
          });
        }
      } catch (err) {
        if (isMounted) {
          setClientState({
            status: "error",
            details: err instanceof Error ? err.message : "Initialization failed",
          });
        }
      }
    }

    void verifyClient();

    return () => {
      isMounted = false;
    };
  }, []);

  const { status, details } = clientState;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#00fff2]/30 bg-[#0a0a0f]/80 p-4 backdrop-blur">
      <div className="relative flex h-3 w-3">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
            status === "initialized"
              ? "bg-[#00fff2] opacity-75"
              : status === "error"
              ? "bg-[#ff00c8] opacity-75"
              : "bg-yellow-400 opacity-75"
          }`}
        />
        <span
          className={`relative inline-flex h-3 w-3 rounded-full ${
            status === "initialized"
              ? "bg-[#00fff2]"
              : status === "error"
              ? "bg-[#ff00c8]"
              : "bg-yellow-400"
          }`}
        />
      </div>
      <div className="text-sm">
        <span className="font-mono font-semibold text-[#00fff2]">
          [CLIENT CLIENT]
        </span>{" "}
        <span className="text-zinc-300">{details}</span>
      </div>
    </div>
  );
}
