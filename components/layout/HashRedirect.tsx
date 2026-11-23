"use client";

import { useEffect } from "react";

/** Client redirect that preserves a hash (HTTP redirects cannot). */
export function HashRedirect({ hash }: { hash: string }) {
  useEffect(() => {
    const target = hash.startsWith("#") ? hash : `#${hash}`;
    window.location.replace(`/${target}`);
  }, [hash]);

  return (
    <p className="p-8 text-center text-sm text-text-muted">
      Redirecting…
    </p>
  );
}
