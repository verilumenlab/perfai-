"use client";

import type { RefObject } from "react";

/**
 * Mobile drawer is now inlined in Navbar (reference home).
 * Kept as a thin stub so any leftover imports still resolve.
 */
export function MobileNavigation(_props: {
  isOpen?: boolean;
  onClose?: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}) {
  return null;
}
