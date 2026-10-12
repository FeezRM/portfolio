"use client";

import { useEffect } from "react";
import { addAfterEffect, useThree } from "@react-three/fiber";
import type { WebGLRenderer } from "three";

/** Opt-in local QA readout: /?inspect=1. Counts include shadow and effects passes. */
function beginRendererAudit(gl: WebGLRenderer, quality: "high" | "low") {
  if (new URLSearchParams(window.location.search).get("inspect") !== "1")
    return;
  const output = document.createElement("output");
  output.setAttribute("aria-label", "Render diagnostics");
  output.style.cssText =
    "position:fixed;bottom:52px;left:260px;z-index:80;background:#071c35df;color:#9ff8e7;padding:8px 12px;font:11px monospace;pointer-events:none";
  document.body.appendChild(output);
  const previousAutoReset = gl.info.autoReset;
  gl.info.autoReset = false;
  let frames = 0,
    started = performance.now(),
    drawCalls = 0,
    triangles = 0,
    lastFrame = started;
  const unsubscribe = addAfterEffect(() => {
    const now = performance.now();
    // Overlays and hidden tabs intentionally stop rendering; don't count that as slow GPU work.
    if (now - lastFrame > 250) {
      frames = drawCalls = triangles = 0;
      started = now;
    }
    lastFrame = now;
    frames++;
    drawCalls += gl.info.render.calls;
    triangles += gl.info.render.triangles;
    const elapsed = now - started;
    if (elapsed > 1000) {
      output.textContent = `${quality.toUpperCase()} · ${((frames * 1000) / elapsed).toFixed(0)} FPS · ${Math.round(drawCalls / frames)} calls · ${Math.round(triangles / frames / 1000)}K triangles`;
      frames = drawCalls = triangles = 0;
      started = now;
    }
    gl.info.reset();
  });
  return () => {
    unsubscribe();
    output.remove();
    gl.info.autoReset = previousAutoReset;
  };
}

export function RenderAudit({ quality }: { quality: "high" | "low" }) {
  const { gl } = useThree();
  useEffect(() => beginRendererAudit(gl, quality), [gl, quality]);
  return null;
}
