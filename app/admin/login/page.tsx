"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-green-primary selection:text-bg-deep">
      {/* Ambient background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-primary/10 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-9 h-9 rounded-xl bg-bg-surface border border-border-dark flex items-center justify-center text-mint-accent group-hover:border-green-primary transition-colors">
              <Shield className="w-5 h-5 text-green-primary" />
            </div>
            <span className="font-heading font-extrabold text-xl text-white tracking-wider">
              Perf<span className="text-mint-accent">AI</span>
            </span>
          </Link>
          <h1 className="font-heading font-bold text-2xl text-white">
            Lead Management Console
          </h1>
          <p className="mt-1.5 text-xs text-text-muted">
            Internal Operations & Commercial Engagement System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-bg-surface border border-border-dark rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          {error && (
            <div
              className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/50 flex items-start gap-3 text-red-200 text-xs"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="admin_email" className="block text-xs font-medium text-white/90 mb-1.5">
                Staff Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin_email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@perfai.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin_password" className="block text-xs font-medium text-white/90 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin_password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-deep border border-border-dark text-white text-sm focus:outline-none focus:border-green-primary focus:ring-1 focus:ring-green-primary transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-primary text-bg-deep text-sm font-semibold hover:bg-mint-accent focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 focus:ring-offset-bg-deep transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In to Console</span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-border-dark/60 text-center">
            <p className="text-[11px] text-text-muted">
              Authorised access only. All authentication attempts and lead interactions are logged.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-text-muted hover:text-white transition-colors"
          >
            ← Return to PerfAI Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

