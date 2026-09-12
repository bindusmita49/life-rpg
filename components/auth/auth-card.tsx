import React from "react";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  nodeId?: string;
  securityLevel?: string;
  children: React.ReactNode;
}

export function AuthCard({
  title,
  subtitle,
  nodeId = "NODE-077",
  securityLevel = "RESTRICTED",
  children,
}: AuthCardProps) {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Outer Glow effect */}
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#00fff2]/30 via-[#ff00c8]/20 to-[#00fff2]/30 opacity-75 blur-sm" />

      {/* Main Panel Container */}
      <div className="relative rounded-xl border border-[#00fff2]/40 bg-[#0a0a0f]/95 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* Corner Bracket Accents */}
        <div className="pointer-events-none absolute -top-[1px] -left-[1px] h-4 w-4 border-t-2 border-l-2 border-[#00fff2]" />
        <div className="pointer-events-none absolute -top-[1px] -right-[1px] h-4 w-4 border-t-2 border-r-2 border-[#00fff2]" />
        <div className="pointer-events-none absolute -bottom-[1px] -left-[1px] h-4 w-4 border-b-2 border-l-2 border-[#ff00c8]" />
        <div className="pointer-events-none absolute -bottom-[1px] -right-[1px] h-4 w-4 border-b-2 border-r-2 border-[#ff00c8]" />

        {/* Top Header Status Bar */}
        <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-3 font-mono text-[11px] tracking-wider text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00fff2] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00fff2]" />
            </span>
            <span className="text-[#00fff2] font-semibold">{nodeId}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-500">
            <span>SEC_LEVEL:</span>
            <span className="text-[#ff00c8] font-bold">{securityLevel}</span>
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-6 text-left">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-[#00fff2] select-none">&gt;</span>
            <span>{title}</span>
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-xs text-zinc-400 font-mono">
              {"// "}
              {subtitle}
            </p>
          )}
        </div>

        {/* Content Body */}
        {children}
      </div>
    </div>
  );
}
