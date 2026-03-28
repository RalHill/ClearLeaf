"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, Leaf } from "lucide-react";

/** Set NEXT_PUBLIC_AUTH_GITHUB_ENABLED=0 to hide the GitHub button. */
const showGitHub = process.env.NEXT_PUBLIC_AUTH_GITHUB_ENABLED !== "0";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });
      if (result?.error) {
        setError("Invalid email or password.");
      } else if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Sign-in failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHub = async () => {
    setLoading(true);
    setError("");
    await signIn("github", { callbackUrl: "/dashboard" });
    setLoading(false);
  };

  return (
    <div className="min-h-dvh bg-dark-green flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="flex items-center gap-2 mb-12 justify-center touch-manipulation cursor-pointer"
        >
          <div
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-green to-mid-green flex items-center justify-center text-white"
            aria-hidden
          >
            <Leaf className="w-5 h-5" strokeWidth={2} />
          </div>
          <span className="font-serif text-2xl text-white font-light">ClearLeaf</span>
        </Link>

        <div className="bg-sidebar-bg rounded-xl border border-white/10 p-8">
          <h1 className="font-serif text-3xl text-white mb-2 font-light">Sign in</h1>
          <p className="text-white/60 text-sm mb-6">
            Use your email and password, or continue with GitHub if enabled.
          </p>

          {error ? (
            <div
              className="mb-4 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          <form onSubmit={handleCredentials} className="space-y-4 mb-6">
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-white/70 mb-2">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[48px] px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-green"
                placeholder="you@company.ca"
                required
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-white/70 mb-2">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[48px] px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-green"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] px-4 py-3 bg-accent-green text-white rounded-lg font-semibold hover:bg-accent-green/90 transition-colors flex items-center justify-center gap-2 touch-manipulation cursor-pointer disabled:opacity-50"
            >
              Sign in <ArrowRight size={16} aria-hidden />
            </button>
          </form>

          {showGitHub ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/40 text-xs">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <button
                type="button"
                onClick={handleGitHub}
                disabled={loading}
                className="w-full min-h-[48px] px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/15 transition-colors mb-6 touch-manipulation cursor-pointer disabled:opacity-50"
              >
                Continue with GitHub
              </button>
            </>
          ) : null}

          <p className="text-center text-sm text-white/60">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-accent-green hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-white/40 mt-8">
          ClearLeaf is informational only. Always consult a lawyer for legal advice.
        </p>
      </div>
    </div>
  );
}
