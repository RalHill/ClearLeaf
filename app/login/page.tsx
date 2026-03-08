"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Supabase Auth
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-dark-green flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-12 justify-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-green to-mid-green flex items-center justify-center text-white text-lg">
            🍁
          </div>
          <span className="font-serif text-2xl text-white font-light">
            ClearLeaf
          </span>
        </Link>

        {/* Form */}
        <div className="bg-sidebar-bg rounded-xl border border-white/10 p-8">
          <h1 className="font-serif text-3xl text-white mb-2 font-light">
            Sign in
          </h1>
          <p className="text-white/60 text-sm mb-6">
            Enter your email to get a magic link
          </p>

          {submitted ? (
            <div className="bg-accent-green/20 border border-accent-green rounded-lg p-4 mb-6">
              <p className="text-accent-green text-sm font-medium">
                ✓ Check your email for a sign-in link!
              </p>
              <p className="text-white/50 text-xs mt-2">
                The link expires in 1 hour.
              </p>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.ca"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent-green"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-accent-green text-white rounded-lg font-semibold hover:bg-accent-green/90 transition-colors flex items-center justify-center gap-2"
              >
                Send magic link <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/40 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google OAuth */}
          <button className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/15 transition-colors mb-6">
            Continue with Google
          </button>

          {/* Sign up link */}
          <p className="text-center text-sm text-white/60">
            Don't have an account?{" "}
            <Link href="/signup" className="text-accent-green hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/40 mt-8">
          ClearLeaf is informational only. Always consult a lawyer for legal
          advice.
        </p>
      </div>
    </div>
  );
}
