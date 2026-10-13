"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { advanceSimulation } from "@/lib/game/animation";

const AnimationTime = createContext({ current: { time: 0, delta: 0 } });

/** Fiber resets its clock when frameloop changes. This timeline survives menu pauses. */
export function WorldAnimation({
  paused,
  children,
}: {
  paused: boolean;
  children: ReactNode;
}) {
  const frame = useRef({ time: 0, delta: 0 });
  useFrame((_, rawDelta) => {
    frame.current = advanceSimulation(frame.current, rawDelta, paused);
  }, -100);
  return (
    <AnimationTime.Provider value={frame}>{children}</AnimationTime.Provider>
  );
}

export function useWorldFrame(
  callback: (time: number, delta: number) => void,
  priority = 0,
) {
  const frame = useContext(AnimationTime);
  useFrame(() => {
    if (frame.current.delta > 0)
      callback(frame.current.time, frame.current.delta);
  }, priority);
}
