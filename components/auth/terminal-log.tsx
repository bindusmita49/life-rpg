import React from "react";

export interface LogEntry {
  type: "info" | "success" | "error" | "warn";
  text: string;
  timestamp?: string;
}

interface TerminalLogProps {
  logs: LogEntry[];
  className?: string;
}

export function TerminalLog({ logs, className = "" }: TerminalLogProps) {
  if (!logs || logs.length === 0) return null;

  return (
    <div
      className={`rounded border border-zinc-800 bg-black/70 p-3 font-mono text-xs ${className}`}
      aria-live="polite"
    >
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5 mb-2 text-[10px] text-zinc-500 uppercase tracking-wider">
        <span>{"// TERMINAL DIAGNOSTICS"}</span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00fff2] animate-pulse" />
          LIVE
        </span>
      </div>
      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
        {logs.map((log, index) => {
          let prefixColor = "text-[#00fff2]";
          let textColor = "text-zinc-300";
          let badge = "[INFO]";

          if (log.type === "error") {
            prefixColor = "text-[#ff00c8]";
            textColor = "text-red-400";
            badge = "[ERROR]";
          } else if (log.type === "success") {
            prefixColor = "text-[#00fff2]";
            textColor = "text-emerald-300";
            badge = "[SUCCESS]";
          } else if (log.type === "warn") {
            prefixColor = "text-yellow-400";
            textColor = "text-yellow-200";
            badge = "[WARN]";
          }

          return (
            <div key={index} className="flex items-start gap-1.5 leading-relaxed">
              <span className={`select-none font-bold ${prefixColor}`}>
                {badge}
              </span>
              <span className={`break-words ${textColor}`}>{log.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
