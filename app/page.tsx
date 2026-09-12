import { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/HeroSection";
import { ProgressionPreview } from "@/components/ProgressionPreview";
import { FeaturePreviewCard } from "@/components/FeaturePreviewCard";

export const metadata: Metadata = {
  title: "Life RPG // Your Life is the Mission",
  description:
    "Convert your daily real-life tasks into Missions, earn Neural XP across 4 Augments, and elevate your Clearance Level.",
};

const AUGMENTS_LIST = [
  {
    name: "Intellect",
    color: "cyan",
    border: "border-[#00fff2]/30 hover:border-[#00fff2]",
    text: "text-[#00fff2]",
    bg: "bg-[#00fff2]/10",
    description: "Study, code, read, learn.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
        <path d="M9 21h6" />
      </svg>
    ),
  },
  {
    name: "Strength",
    color: "magenta",
    border: "border-[#ff00c8]/30 hover:border-[#ff00c8]",
    text: "text-[#ff00c8]",
    bg: "bg-[#ff00c8]/10",
    description: "Train, lift, move, recover.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    name: "Discipline",
    color: "yellow",
    border: "border-yellow-400/30 hover:border-yellow-400",
    text: "text-yellow-400",
    bg: "bg-yellow-400/10",
    description: "Routines, chores, follow-through.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    name: "Creativity",
    color: "green",
    border: "border-emerald-400/30 hover:border-emerald-400",
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
    description: "Build, write, design, make.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-[#ededed] selection:bg-[#ff00c8] selection:text-white">
      {/* Background Ambient Scanlines & Glows */}
      <div className="pointer-events-none fixed inset-0 scanlines opacity-40" />

      {/* Top Floating Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#0a0a0f]/80 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="font-mono text-base font-bold tracking-widest text-[#00fff2] flex items-center gap-2"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#00fff2] shadow-[0_0_10px_#00fff2]" />
            <span>LIFE RPG</span>
          </Link>

          <div className="flex items-center gap-3 font-mono text-xs">
            <Link
              href="/login"
              className="rounded-lg border border-zinc-800 bg-[#0a0a0f] px-4 py-2 text-zinc-300 transition hover:border-[#00fff2] hover:text-[#00fff2]"
            >
              LOG IN
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-[#00fff2] px-4 py-2 font-bold text-[#0a0a0f] shadow-[0_0_15px_rgba(0,255,242,0.4)] transition hover:bg-[#00e6da]"
            >
              START RUN
            </Link>
          </div>
        </div>
      </header>

      {/* Main Landing Page Content */}
      <main className="relative z-10 space-y-20 pb-20">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Progression Engine Section */}
        <ProgressionPreview />

        {/* 3. The Loop Section */}
        <section className="mx-auto max-w-6xl px-4 sm:px-8 py-8">
          <div className="mb-10 text-center">
            <div className="font-mono text-xs text-[#ff00c8] font-semibold tracking-wider uppercase">
              {"// OPERATIONAL CORE CYCLE"}
            </div>
            <h2 className="mt-2 font-mono text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              THE LOOP
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Card 1: DEPLOY */}
            <FeaturePreviewCard
              step="STEP // 01"
              title="DEPLOY"
              glowColor="cyan"
              description="Turn a real task into a Mission. Tag it with an Augment — Intellect, Strength, Discipline, or Creativity — and set its XP and Credit reward."
              icon={
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              }
            />

            {/* Card 2: EXECUTE */}
            <FeaturePreviewCard
              step="STEP // 02"
              title="EXECUTE"
              glowColor="magenta"
              description="Complete it in real life, then Execute the Mission. XP and Credits land instantly. Your Uptime Streak climbs if you showed up today — miss a day and it resets to zero."
              icon={
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              }
            />

            {/* Card 3: GEAR UP */}
            <FeaturePreviewCard
              step="STEP // 03"
              title="GEAR UP"
              glowColor="yellow"
              description="Spend Credits in the Black Market on Mods — cosmetic themes and badges for your Operative profile. Nothing pay to win, purely status."
              icon={
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 6v12M15 9.5a3 3 0 0 0-3-1.5H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H12a3 3 0 0 1-3-1.5" />
                </svg>
              }
            />
          </div>
        </section>

        {/* 4. Four Augments Section */}
        <section className="mx-auto max-w-6xl px-4 sm:px-8 py-8">
          <div className="mb-10 text-center">
            <div className="font-mono text-xs text-[#00fff2] font-semibold tracking-wider uppercase">
              {"// NEURAL ATTRIBUTE MATRIX"}
            </div>
            <h2 className="mt-2 font-mono text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              FOUR AUGMENTS
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AUGMENTS_LIST.map((aug) => (
              <div
                key={aug.name}
                className={`flex flex-col justify-between rounded-xl border bg-[#0a0a0f]/90 p-5 backdrop-blur transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] ${aug.border}`}
              >
                <div>
                  <div className={`inline-flex rounded-lg border p-2.5 ${aug.bg} ${aug.text} ${aug.border}`}>
                    {aug.icon}
                  </div>
                  <h3 className={`mt-4 font-mono text-lg font-bold tracking-tight ${aug.text}`}>
                    {aug.name}
                  </h3>
                  <p className="mt-2 font-mono text-xs leading-relaxed text-zinc-300">
                    {aug.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Final CTA Section */}
        <section className="mx-auto max-w-4xl px-4 sm:px-8 py-12 text-center">
          <div className="rounded-2xl border border-[#00fff2]/40 bg-[#0a0a0f]/95 p-8 sm:p-14 backdrop-blur shadow-[0_0_50px_rgba(0,255,242,0.15)]">
            <div className="font-mono text-xs text-[#ff00c8] font-bold tracking-widest uppercase">
              {"// READY FOR DEPLOYMENT"}
            </div>
            <h2 className="mt-3 font-mono text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              READY TO GO OPERATIONAL?
            </h2>
            <p className="mx-auto mt-4 max-w-md font-mono text-xs sm:text-sm text-zinc-400">
              Initialize your operative clearance, start earning Neural XP, and conquer your real-world objectives.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/signup"
                className="flex h-12 items-center justify-center rounded-xl bg-[#00fff2] px-8 font-mono text-sm font-bold uppercase tracking-wider text-[#0a0a0f] shadow-[0_0_30px_rgba(0,255,242,0.6)] transition hover:bg-[#00e6da] hover:shadow-[0_0_40px_rgba(0,255,242,0.8)]"
              >
                CREATE YOUR OPERATIVE
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Footer */}
      <footer className="relative z-10 border-t border-zinc-800/80 bg-[#0a0a0f] py-8 text-center font-mono">
        <div className="mx-auto max-w-6xl px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2 text-zinc-300 font-bold tracking-widest">
            <span className="inline-block h-2 w-2 rounded-full bg-[#00fff2]" />
            <span>LIFE RPG</span>
          </div>
          <div>
            Built in 20 hours for [HACKATHON NAME] — 2026.
          </div>
        </div>
      </footer>
    </div>
  );
}
