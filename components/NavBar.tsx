"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface NavBarProps {
  credits?: number;
  callsign?: string;
}

export function NavBar({ credits = 0, callsign = "OPERATIVE" }: NavBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    setLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
      setLoggingOut(false);
    }
  };

  const navLinks = [
    { href: "/dashboard", label: "COMMAND DECK" },
    { href: "/black-market", label: "BLACK MARKET" },
    { href: "/profile", label: "PROFILE" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-[#0a0a0f]/90 px-4 sm:px-8 py-3.5 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="font-mono text-sm font-bold tracking-widest text-[#00fff2] transition hover:opacity-80 flex items-center gap-2"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-[#00fff2] shadow-[0_0_8px_#00fff2]" />
            <span>{"LIFE RPG"}</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-1.5 transition-all ${
                    isActive
                      ? "border border-[#00fff2]/40 bg-[#00fff2]/15 text-[#00fff2] shadow-[0_0_12px_rgba(0,255,242,0.2)]"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Status & Disconnect */}
        <div className="flex items-center gap-3 font-mono text-xs">
          {/* Credits Display */}
          <div className="flex items-center gap-1.5 rounded-lg border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.15)]">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 6v12M15 9.5a3 3 0 0 0-3-1.5H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H12a3 3 0 0 1-3-1.5" />
            </svg>
            <span className="font-bold">{credits}</span>
            <span className="text-[10px] text-yellow-500">CR</span>
          </div>

          <div className="hidden lg:flex items-center gap-1 text-zinc-400">
            <span className="text-zinc-600">{"//"}</span>
            <span className="text-[#00fff2] font-semibold">{callsign}</span>
          </div>

          <button
            onClick={handleSignOut}
            disabled={loggingOut}
            className="rounded-lg border border-[#ff00c8]/40 bg-[#ff00c8]/10 px-3 py-1 text-[#ff00c8] font-semibold transition hover:bg-[#ff00c8] hover:text-[#0a0a0f] hover:shadow-[0_0_15px_rgba(255,0,200,0.4)] disabled:opacity-50"
          >
            {loggingOut ? "EXITING..." : "DISCONNECT"}
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <nav className="mt-2.5 flex md:hidden items-center justify-center gap-2 border-t border-zinc-800/60 pt-2 font-mono text-xs">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-2.5 py-1 text-[11px] transition-all ${
                isActive
                  ? "border border-[#00fff2]/40 bg-[#00fff2]/15 text-[#00fff2]"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
