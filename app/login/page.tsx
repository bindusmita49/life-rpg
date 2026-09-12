import { Metadata } from "next";
import Link from "next/link";
import { AuthCard, AuthForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Access Terminal // Login - Life RPG",
  description: "Cyberpunk Authentication Terminal for Operatives",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] p-4 text-[#ededed] selection:bg-[#ff00c8] selection:text-white">
      {/* Background Cyberpunk Ambience */}
      <div className="pointer-events-none absolute inset-0 scanlines opacity-50" />
      <div className="pointer-events-none absolute -top-48 -left-48 h-96 w-96 rounded-full bg-[#00fff2]/10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-48 -right-48 h-96 w-96 rounded-full bg-[#ff00c8]/10 blur-[130px]" />

      {/* Top Breadcrumb Navigation */}
      <div className="relative z-10 mb-8 flex items-center gap-2 font-mono text-xs text-zinc-500">
        <Link
          href="/"
          className="text-zinc-400 hover:text-[#00fff2] transition-colors"
        >
          [ ROOT // INDEX ]
        </Link>
        <span>/</span>
        <span className="text-[#00fff2] font-semibold">AUTH // LOGIN</span>
      </div>

      {/* Terminal Auth Card */}
      <div className="relative z-10 w-full max-w-md">
        <AuthCard
          title="ACCESS TERMINAL"
          subtitle="AUTHENTICATE IDENTITY FOR COMMAND CLEARANCE"
          nodeId="NODE-077 // SEC-LOGIN"
          securityLevel="ALPHA-RESTRICTED"
        >
          <AuthForm mode="login" />
        </AuthCard>
      </div>

      {/* Footer System Meta */}
      <div className="relative z-10 mt-8 font-mono text-[11px] text-zinc-600 tracking-wider">
        <span>SYSTEM_STATUS: SECURE // ENCRYPTION: AES-GCM-256</span>
      </div>
    </div>
  );
}
