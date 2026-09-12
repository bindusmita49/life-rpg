"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { TerminalLog, LogEntry } from "./terminal-log";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [callsign, setCallsign] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      type: "info",
      text:
        mode === "signup"
          ? "OPERATIVE REGISTRATION PROTOCOL INITIATED."
          : "TERMINAL SECURITY PROTOCOL READY.",
    },
  ]);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    callsign?: string;
  }>({});

  const supabase = createClient();

  // Listen for Supabase auth state changes and redirect authenticated users to /dashboard
  useEffect(() => {
    let isMounted = true;

    // Check existing session on mount
    async function checkActiveSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && isMounted) {
          setLogs((prev) => [
            ...prev,
            { type: "success", text: "ACTIVE SESSION DETECTED. REDIRECTING TO COMMAND..." },
          ]);
          router.push("/dashboard");
          router.refresh();
        }
      } catch (err) {
        console.error("Session check error:", err);
      }
    }

    void checkActiveSession();

    // Attach onAuthStateChange listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (event === "SIGNED_IN" && session) {
        setLogs((prev) => [
          ...prev,
          { type: "success", text: "AUTHENTICATION VERIFIED. ACCESS GRANTED." },
          { type: "info", text: "TRANSFERRING TO /dashboard..." },
        ]);
        router.push("/dashboard");
        router.refresh();
      } else if (event === "SIGNED_OUT") {
        setLogs((prev) => [
          ...prev,
          { type: "info", text: "SESSION TERMINATED. PLEASE AUTHENTICATE." },
        ]);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errors.email = "Email identifier is required";
    } else if (!emailRegex.test(email.trim())) {
      errors.email = "Invalid email format. Format: operative@domain.com";
    }

    if (!password) {
      errors.password = "Security passphrase is required";
    } else if (password.length < 6) {
      errors.password = "Passphrase must be at least 6 characters long";
    }

    if (mode === "signup") {
      if (password !== confirmPassword) {
        errors.confirmPassword = "Passphrases do not match";
      }
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors);
      setLogs((prev) => [
        ...prev,
        {
          type: "error",
          text: `VALIDATION FAILURE: ${errorMessages.join(" | ")}`,
        },
      ]);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    if (mode === "signup") {
      setLogs((prev) => [
        ...prev,
        { type: "info", text: `REGISTERING OPERATIVE [${email}]...` },
      ]);

      try {
        const designatedCallsign =
          callsign.trim() || email.split("@")[0] || "Operative";

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              callsign: designatedCallsign,
            },
          },
        });

        if (signUpError) {
          let errorMsg = signUpError.message;
          if (signUpError.message.toLowerCase().includes("already registered")) {
            errorMsg = "Operative already registered. Please proceed to Sign In.";
          } else if (
            signUpError.message.toLowerCase().includes("password") ||
            signUpError.message.toLowerCase().includes("weak")
          ) {
            errorMsg = "Passphrase too weak. Use a more secure secret.";
          }

          setLogs((prev) => [
            ...prev,
            { type: "error", text: `REGISTRATION ABORTED: ${errorMsg}` },
          ]);
          setFieldErrors((prev) => ({ ...prev, password: errorMsg }));
          setLoading(false);
          return;
        }

        if (data.user) {
          setLogs((prev) => [
            ...prev,
            { type: "success", text: "OPERATIVE IDENTITY CREATED IN AUTH LEDGER." },
            { type: "info", text: "INITIALIZING OPERATIVE STATS (LEVEL: 1, XP: 0, CREDITS: 0, STREAK: 0)..." },
          ]);

          // Insert new row into the operatives table
          const { error: profileError } = await supabase
            .from("operatives")
            .insert({
              id: data.user.id,
              email: data.user.email,
              callsign: designatedCallsign,
              level: 1,
              current_xp: 0,
              credits: 0,
              streak_count: 0,
            });

          if (profileError) {
            // If duplicate key / trigger already created it, we can log and proceed
            if (profileError.code === "23505") {
              setLogs((prev) => [
                ...prev,
                { type: "info", text: "OPERATIVE PROFILE INITIALIZED BY SYSTEM TRIGGER." },
              ]);
            } else {
              setLogs((prev) => [
                ...prev,
                {
                  type: "warn",
                  text: `PROFILE NOTICE: ${profileError.message} (Database record sync pending).`,
                },
              ]);
            }
          } else {
            setLogs((prev) => [
              ...prev,
              { type: "success", text: "OPERATIVE PROFILE SYNCHRONIZED (LEVEL: 1, CREDITS: 0)." },
            ]);
          }

          if (data.session) {
            setLogs((prev) => [
              ...prev,
              { type: "success", text: "SESSION ACTIVE. ROUTING TO COMMAND..." },
            ]);
            router.push("/dashboard");
            router.refresh();
          } else {
            // Email confirmation required case
            setLogs((prev) => [
              ...prev,
              {
                type: "info",
                text: "CLEARANCE TOKEN DISPATCHED: Check your email inbox to confirm registration.",
              },
            ]);
          }
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Unexpected connection error";
        setLogs((prev) => [
          ...prev,
          { type: "error", text: `SYSTEM ERROR: ${errorMsg}` },
        ]);
      } finally {
        setLoading(false);
      }
    } else {
      // Login mode
      setLogs((prev) => [
        ...prev,
        { type: "info", text: `AUTHENTICATING [${email}]...` },
      ]);

      try {
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (signInError) {
          let errorMsg = signInError.message;
          if (
            signInError.message.toLowerCase().includes("invalid login credentials") ||
            signInError.message.toLowerCase().includes("invalid credentials")
          ) {
            errorMsg = "ACCESS DENIED: Invalid email identifier or passphrase.";
          } else if (
            signInError.message.toLowerCase().includes("email not confirmed")
          ) {
            errorMsg = "ACCESS RESTRICTED: Email verification pending. Check your inbox.";
          }

          setLogs((prev) => [
            ...prev,
            { type: "error", text: errorMsg },
          ]);
          setFieldErrors((prev) => ({ ...prev, password: errorMsg }));
          setLoading(false);
          return;
        }

        if (data.session) {
          setLogs((prev) => [
            ...prev,
            { type: "success", text: "CLEARANCE APPROVED. REDIRECTING TO /dashboard..." },
          ]);
          router.push("/dashboard");
          router.refresh();
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Unexpected connection failure";
        setLogs((prev) => [
          ...prev,
          { type: "error", text: `CRITICAL FAULT: ${errorMsg}` },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
      {/* Callsign Field (Signup only) */}
      {mode === "signup" && (
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold tracking-wider text-[#00fff2] uppercase">
            &gt; OPERATIVE CALLSIGN <span className="text-zinc-500">(OPTIONAL)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={callsign}
              onChange={(e) => {
                setCallsign(e.target.value);
                if (fieldErrors.callsign) {
                  setFieldErrors((prev) => ({ ...prev, callsign: undefined }));
                }
              }}
              placeholder="e.g. CYBER_GHOST"
              disabled={loading}
              className="w-full rounded border border-zinc-800 bg-black/60 px-3 py-2.5 text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-[#00fff2] focus:shadow-[0_0_15px_rgba(0,255,242,0.25)] disabled:opacity-50"
            />
          </div>
          {fieldErrors.callsign && (
            <p className="text-[11px] text-[#ff00c8]">{fieldErrors.callsign}</p>
          )}
        </div>
      )}

      {/* Email / Identifier Field */}
      <div className="space-y-1">
        <label className="block text-[11px] font-semibold tracking-wider text-[#00fff2] uppercase">
          &gt; OPERATIVE ID // EMAIL
        </label>
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            placeholder="agent@matrix.net"
            autoComplete="email"
            disabled={loading}
            className={`w-full rounded border bg-black/60 px-3 py-2.5 text-zinc-100 placeholder-zinc-600 outline-none transition focus:shadow-[0_0_15px_rgba(0,255,242,0.25)] disabled:opacity-50 ${
              fieldErrors.email
                ? "border-[#ff00c8] focus:border-[#ff00c8]"
                : "border-zinc-800 focus:border-[#00fff2]"
            }`}
          />
        </div>
        {fieldErrors.email && (
          <p className="text-[11px] text-[#ff00c8]">{fieldErrors.email}</p>
        )}
      </div>

      {/* Password / Passphrase Field */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="block text-[11px] font-semibold tracking-wider text-[#00fff2] uppercase">
            &gt; PASSPHRASE // KEY
          </label>
          <span className="text-[10px] text-zinc-500">MIN 6 CHARACTERS</span>
        </div>
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            placeholder="••••••••••••"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            disabled={loading}
            className={`w-full rounded border bg-black/60 px-3 py-2.5 text-zinc-100 placeholder-zinc-600 outline-none transition focus:shadow-[0_0_15px_rgba(0,255,242,0.25)] disabled:opacity-50 ${
              fieldErrors.password
                ? "border-[#ff00c8] focus:border-[#ff00c8]"
                : "border-zinc-800 focus:border-[#00fff2]"
            }`}
          />
        </div>
        {fieldErrors.password && (
          <p className="text-[11px] text-[#ff00c8]">{fieldErrors.password}</p>
        )}
      </div>

      {/* Confirm Password (Signup only) */}
      {mode === "signup" && (
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold tracking-wider text-[#00fff2] uppercase">
            &gt; VERIFY PASSPHRASE
          </label>
          <div className="relative">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
                }
              }}
              placeholder="••••••••••••"
              autoComplete="new-password"
              disabled={loading}
              className={`w-full rounded border bg-black/60 px-3 py-2.5 text-zinc-100 placeholder-zinc-600 outline-none transition focus:shadow-[0_0_15px_rgba(0,255,242,0.25)] disabled:opacity-50 ${
                fieldErrors.confirmPassword
                  ? "border-[#ff00c8] focus:border-[#ff00c8]"
                  : "border-zinc-800 focus:border-[#00fff2]"
              }`}
            />
          </div>
          {fieldErrors.confirmPassword && (
            <p className="text-[11px] text-[#ff00c8]">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>
      )}

      {/* Terminal Live Diagnostics Box */}
      <TerminalLog logs={logs} className="my-4" />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded border border-[#00fff2] bg-[#00fff2]/15 py-3 font-mono text-sm font-bold uppercase tracking-wider text-[#00fff2] transition-all hover:bg-[#00fff2] hover:text-[#0a0a0f] hover:shadow-[0_0_25px_rgba(0,255,242,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="relative z-10 flex items-center gap-2">
          {loading ? (
            <>
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>PROCESSING DATASTREAM...</span>
            </>
          ) : (
            <>
              <span>
                {mode === "signup"
                  ? "[ REGISTER OPERATIVE ]"
                  : "[ AUTHENTICATE // LOGIN ]"}
              </span>
              <span className="transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </>
          )}
        </span>
      </button>

      {/* Mode Switch Navigation */}
      <div className="pt-2 text-center text-xs text-zinc-400">
        {mode === "signup" ? (
          <p>
            Existing operative clearance?{" "}
            <Link
              href="/login"
              className="text-[#00fff2] hover:text-[#ff00c8] underline decoration-[#00fff2]/40 underline-offset-4 transition"
            >
              Access Terminal &rarr;
            </Link>
          </p>
        ) : (
          <p>
            Unregistered agent?{" "}
            <Link
              href="/signup"
              className="text-[#00fff2] hover:text-[#ff00c8] underline decoration-[#00fff2]/40 underline-offset-4 transition"
            >
              Enlist Operative &rarr;
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}
