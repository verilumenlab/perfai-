"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

/**
 * Load a texture into React state (configured clone) so we never mutate
 * a value returned directly from a render-phase hook.
 */
export function useHeroTexture(
  url: string,
  options?: { wrap?: "clamp" | "repeat" }
) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(url, (tex) => {
      if (cancelled) {
        tex.dispose();
        return;
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      if (options?.wrap === "repeat") {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
      } else {
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
      }
      setTexture(tex);
    });
    return () => {
      cancelled = true;
    };
  }, [url, options?.wrap]);

  return texture;
}
