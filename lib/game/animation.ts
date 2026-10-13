/** Simulation time excludes pauses and limits single-frame catch-up after a stall. */
export function simulationDelta(rawDelta: number, paused = false): number {
  return paused || !Number.isFinite(rawDelta)
    ? 0
    : Math.max(0, Math.min(rawDelta, 0.05));
}

export function advanceSimulation(
  frame: { time: number; delta: number },
  rawDelta: number,
  paused: boolean,
) {
  const delta = simulationDelta(rawDelta, paused);
  return { time: frame.time + delta, delta };
}
