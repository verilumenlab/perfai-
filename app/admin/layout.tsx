import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentAdmin } from "@/lib/auth";
import { Shield, ExternalLink } from "lucide-react";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

export const metadata: Metadata = {
  title: "Admin Lead Console — PerfAI",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  // If unauthenticated, redirect to login
  if (!admin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-bg-deep text-white flex flex-col font-sans selection:bg-green-primary selection:text-bg-deep">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-bg-surface/90 backdrop-blur-md border-b border-border-dark px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-bg-deep border border-border-dark flex items-center justify-center text-mint-accent">
              <Shield className="w-4 h-4 text-green-primary" />
            </div>
            <span className="font-heading font-extrabold text-lg text-white">
              Perf<span className="text-mint-accent">AI</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-full bg-green-primary/10 border border-green-primary/30 text-mint-accent">
              Lead Console
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-semibold text-white">{admin.name}</span>
            <span className="text-[11px] font-mono text-text-muted">{admin.email}</span>
          </div>

          <div className="h-6 w-px bg-border-dark hidden sm:block" />

          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-white transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <AdminLogoutButton />
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
