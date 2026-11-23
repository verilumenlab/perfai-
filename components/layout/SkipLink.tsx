"use client";

import React from "react";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      onClick={() => {
        document.getElementById("main-content")?.focus();
      }}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-green-primary text-bg-deep font-semibold px-4 py-2 rounded-xl shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-accent"
    >
      Skip to main content
    </a>
  );
}

