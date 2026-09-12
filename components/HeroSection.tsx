import React from "react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 sm:px-8 py-20 text-center">
      {/* Glow Orbs & Background Ambience */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-[#00fff2]/15 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/4 h-72 w-72 rounded-full bg-[#ff00c8]/10 blur-[130px]" />

      {/* Top Protocol Badge */}
      <div className="relative z-10 mb-6 inline-flex items-center gap-2 rounded-full border border-[#00fff2]/40 bg-[#00fff2]/10 px-3.5 py-1 font-mono text-xs text-[#00fff2] shadow-[0_0_15px_rgba(0,255,242,0.2)]">
        <span className="inline-block h-2 w-2 rounded-full bg-[#00fff2] animate-pulse" />
        <span className="font-semibold tracking-widest uppercase">
          NEURAL OPERATING SYSTEM // V1.0
        </span>
      </div>

      {/* Headline with cyber flicker animation */}
      <h1 className="relative z-10 max-w-4xl font-mono text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_0_25px_rgba(0,255,242,0.4)] leading-tight">
        YOUR LIFE IS THE MISSION.
      </h1>

      {/* Verbatim Subheadline */}
      <p className="relative z-10 mt-6 max-w-2xl font-mono text-sm sm:text-base leading-relaxed text-zinc-300">
        Life RPG converts your real tasks into Missions. Every Mission you Execute
        feeds Neural XP into one of four Augments — Intellect, Strength,
        Discipline, Creativity — and pushes your Clearance Level higher. No flat
        grind: each level demands more XP than the last.
      </p>

      {/* Two Rounded CTA Buttons */}
      <div className="relative z-10 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
        <Link
          href="/signup"
          className="flex h-12 w-full sm:w-auto min-w-[200px] items-center justify-center rounded-xl bg-[#00fff2] px-8 font-mono text-sm font-bold uppercase tracking-wider text-[#0a0a0f] shadow-[0_0_25px_rgba(0,255,242,0.5)] transition hover:bg-[#00e6da] hover:shadow-[0_0_35px_rgba(0,255,242,0.7)]"
        >
          START YOUR RUN
        </Link>
        <Link
          href="/login"
          className="flex h-12 w-full sm:w-auto min-w-[160px] items-center justify-center rounded-xl border border-zinc-700 bg-[#0a0a0f]/80 px-8 font-mono text-sm font-semibold text-zinc-200 backdrop-blur transition hover:border-[#00fff2] hover:text-[#00fff2] hover:shadow-[0_0_20px_rgba(0,255,242,0.25)]"
        >
          LOG IN
        </Link>
      </div>
    </section>
  );
}
