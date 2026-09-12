"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sessionChecking, setSessionChecking] = useState(true);

  const supabase = createClient();

  // Check for existing session on mount and redirect if already logged in
  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session && isMounted) {
          router.replace("/dashboard");
          return;
        }
      } catch (err) {
        console.error("Session verification error:", err);
      } finally {
        if (isMounted) {
          setSessionChecking(false);
        }
      }
    }

    void checkSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (event === "SIGNED_IN" && session) {
        router.replace("/dashboard");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const validateInputs = (): string | null => {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      return "Email address is required.";
    }
    if (!emailRegex.test(trimmedEmail)) {
      return "Invalid email format. Format must be operative@domain.com";
    }
    if (!password) {
      return "Password is required.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const validationError = validateInputs();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const defaultCallsign = email.trim().split("@")[0] || "Operative";

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              callsign: defaultCallsign,
            },
          },
        });

        if (signUpError) {
          setErrorMessage(signUpError.message);
          setLoading(false);
          return;
        }

        if (data.user) {
          // Immediately insert initial row into operatives table
          const { error: insertError } = await supabase
            .from("operatives")
            .insert({
              id: data.user.id,
              email: data.user.email ?? email.trim(),
              callsign: defaultCallsign,
              level: 1,
              current_xp: 0,
              credits: 0,
              streak_count: 0,
            });

          if (insertError && insertError.code !== "23505") {
            console.warn("Operative record sync notice:", insertError.message);
          }

          // Redirect to /dashboard
          router.push("/dashboard");
          router.refresh();
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      } else {
        // Login mode
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (signInError) {
          setErrorMessage(signInError.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "An unexpected network error occurred.";
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  const title = mode === "signup" ? "OPERATIVE ENLISTMENT" : "ACCESS TERMINAL";
  const subtitle =
    mode === "signup"
      ? "INITIALIZE NEW PROFILE RECORD ON NEURAL GRID"
      : "AUTHENTICATE IDENTITY FOR COMMAND CLEARANCE";

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Glow Backdrop */}
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#00fff2]/30 via-[#ff00c8]/20 to-[#00fff2]/30 opacity-70 blur-md pointer-events-none" />

      {/* Main Rounded Panel (rounded-xl, glowing cyan border, no angled/skewed shapes) */}
      <div className="relative rounded-xl border border-[#00fff2]/50 bg-[#0a0a0f]/95 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_35px_rgba(0,255,242,0.2)]">
        {/* Terminal Status Header */}
        <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-3 font-mono text-[11px] tracking-wider text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00fff2] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00fff2]" />
            </span>
            <span className="text-[#00fff2] font-semibold">
              {mode === "signup" ? "NODE-089 // RECRUIT-GATE" : "NODE-077 // SEC-LOGIN"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-500">
            <span>SEC_LEVEL:</span>
            <span className="text-[#ff00c8] font-bold">
              {mode === "signup" ? "PUBLIC-ONBOARDING" : "ALPHA-RESTRICTED"}
            </span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-6 text-left">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-mono">
            <span className="text-[#00fff2] select-none">&gt;</span>
            <span>{title}</span>
          </h1>
          <p className="mt-1.5 text-xs text-zinc-400 font-mono">
            {"// "}
            {subtitle}
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs" noValidate>
          {/* Email Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="auth-email"
              className="block text-[11px] font-semibold tracking-wider text-[#00fff2] uppercase"
            >
              &gt; OPERATIVE ID // EMAIL
            </label>
            <div className="relative">
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="operative@matrix.net"
                autoComplete="email"
                disabled={loading || sessionChecking}
                className="w-full rounded-lg border border-zinc-800 bg-black/60 px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-[#00fff2] focus:shadow-[0_0_15px_rgba(0,255,242,0.25)] disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Input with Show/Hide Toggle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="auth-password"
                className="block text-[11px] font-semibold tracking-wider text-[#00fff2] uppercase"
              >
                &gt; PASSPHRASE // KEY
              </label>
              <span className="text-[10px] text-zinc-500">MIN 6 CHARACTERS</span>
            </div>
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="••••••••••••"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                disabled={loading || sessionChecking}
                className="w-full rounded-lg border border-zinc-800 bg-black/60 px-3.5 py-2.5 pr-10 text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-[#00fff2] focus:shadow-[0_0_15px_rgba(0,255,242,0.25)] disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                title={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#00fff2] transition-colors p-1"
              >
                {showPassword ? (
                  // Eye Slash Icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                    />
                  </svg>
                ) : (
                  // Eye Icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Inline Error Message Area */}
          {errorMessage && (
            <div
              role="alert"
              className="rounded-lg border border-[#ff00c8]/60 bg-[#ff00c8]/10 p-3 text-xs text-[#ff00c8] flex items-start gap-2.5 font-mono shadow-[0_0_15px_rgba(255,0,200,0.15)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="flex-1 leading-relaxed">
                <span className="font-bold tracking-wide">[ERROR]:</span>{" "}
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || sessionChecking}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg border border-[#00fff2] bg-[#00fff2]/15 py-3 font-mono text-sm font-bold uppercase tracking-wider text-[#00fff2] transition-all hover:bg-[#00fff2] hover:text-[#0a0a0f] hover:shadow-[0_0_25px_rgba(0,255,242,0.5)] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>
                  {mode === "signup" ? "INITIALIZING ENLISTMENT..." : "VERIFYING IDENTITY..."}
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>
                  {mode === "signup" ? "[ REGISTER OPERATIVE ]" : "[ AUTHENTICATE // LOGIN ]"}
                </span>
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </span>
            )}
          </button>

          {/* Navigation Links */}
          <div className="pt-3 text-center text-xs text-zinc-400 font-mono">
            {mode === "signup" ? (
              <p>
                Already registered?{" "}
                <Link
                  href="/login"
                  className="text-[#00fff2] hover:text-[#ff00c8] underline decoration-[#00fff2]/40 underline-offset-4 transition-colors font-medium"
                >
                  Log in
                </Link>
              </p>
            ) : (
              <p>
                New operative?{" "}
                <Link
                  href="/signup"
                  className="text-[#00fff2] hover:text-[#ff00c8] underline decoration-[#00fff2]/40 underline-offset-4 transition-colors font-medium"
                >
                  Create an account
                </Link>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
