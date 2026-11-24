"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Reduced-motion flag that is always `false` on the server and on the first client render,
 * and only reflects the visitor's setting after the page has mounted.
 *
 * Reading `useReducedMotion()` directly changes the markup (inline styles, canvas vs. no canvas,
 * pulse elements) between server HTML and the browser, which triggers React hydration errors
 * for anyone with "reduce motion" switched on. This hook keeps the first render identical.
 */
export function useStableReducedMotion(): boolean {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted && reduce === true;
}
