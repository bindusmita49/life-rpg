import { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Enlistment Terminal // Signup - Life RPG",
  description: "Enlist as a new Operative into the Life RPG Grid",
};

export default function SignupPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] p-4 text-[#ededed] selection:bg-[#ff00c8] selection:text-white">
      {/* Background Cyberpunk Ambience */}
      <div className="pointer-events-none absolute inset-0 scanlines opacity-50" />
      <div className="pointer-events-none absolute -top-48 -right-48 h-96 w-96 rounded-full bg-[#00fff2]/10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-[#ff00c8]/10 blur-[130px]" />

      {/* Top Breadcrumb Navigation */}
      <div className="relative z-10 mb-8 flex items-center gap-2 font-mono text-xs text-zinc-500">
        <Link
          href="/"
          className="text-zinc-400 hover:text-[#00fff2] transition-colors"
        >
          [ ROOT // INDEX ]
        </Link>
        <span>/</span>
        <span className="text-[#ff00c8] font-semibold">ENLIST // SIGNUP</span>
      </div>

      {/* Centered Terminal Auth Card */}
      <div className="relative z-10 w-full max-w-md">
        <AuthForm mode="signup" />
      </div>

      {/* Footer System Meta */}
      <div className="relative z-10 mt-8 font-mono text-[11px] text-zinc-600 tracking-wider">
        <span>INITIAL_STATE: LEVEL_1 // REPUTATION: 0 // CREDITS: 0</span>
      </div>
    </div>
  );
}
