"use client";

import { useEffect } from "react";

export function MouseGlow() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const root = document.documentElement;
    let frame = 0;

    const setGlow = (event: PointerEvent) => {
      const { clientX, clientY } = event;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty("--mouse-x", `${clientX}px`);
        root.style.setProperty("--mouse-y", `${clientY}px`);
        root.style.setProperty("--mouse-opacity", "1");
      });
    };

    const hideGlow = () => {
      root.style.setProperty("--mouse-opacity", "0");
    };

    window.addEventListener("pointermove", setGlow, { passive: true });
    window.addEventListener("pointerleave", hideGlow);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", setGlow);
      window.removeEventListener("pointerleave", hideGlow);
    };
  }, []);

  return null;
}
