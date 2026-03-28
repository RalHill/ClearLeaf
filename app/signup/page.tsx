"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, Leaf } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed. Please try again.");
        return;
      }

      // Auto sign-in after successful registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setError("Account created but sign-in failed. Please sign in manually.");
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
          <h1 className="font-serif text-3xl text-white mb-2 font-light">Create account</h1>
          <p className="text-white/60 text-sm mb-6">
            Start your free plan — no credit card required.
          </p>

          {error ? (
            <div
              className="mb-4 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="signup-name" className="block text-xs font-semibold text-white/70 mb-2">
                Full name
              </label>
              <input
                id="signup-name"
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full min-h-[48px] px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-green"
                placeholder="Jane Smith"
                required
              />
            </div>
            <div>
              <label htmlFor="signup-email" className="block text-xs font-semibold text-white/70 mb-2">
                Work email
              </label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password" className="block text-xs font-semibold text-white/70 mb-2">
                Password <span className="text-white/40 font-normal">(min. 8 characters)</span>
              </label>
              <input
                id="signup-password"
                type="password"
                name="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[48px] px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-green"
                required
                minLength={8}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] px-4 py-3 bg-accent-green text-white rounded-lg font-semibold hover:bg-accent-green/90 transition-colors flex items-center justify-center gap-2 touch-manipulation cursor-pointer disabled:opacity-50"
            >
              {loading ? "Creating account…" : "Create account"}
              {!loading && <ArrowRight size={16} aria-hidden />}
            </button>
          </form>

          <p className="text-center text-sm text-white/60 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-accent-green hover:underline">
              Sign in
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
