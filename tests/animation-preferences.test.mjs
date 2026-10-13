import { test } from "node:test";
import assert from "node:assert/strict";
import { advanceSimulation, simulationDelta } from "../lib/game/animation.ts";
import {
  restoreInterfaceSound,
  soundPreferenceVersion,
} from "../lib/game/preferences.ts";

test("animation phase survives menu pauses and renderer clock restarts", () => {
  let frame = { time: 12.5, delta: 1 / 60 };
  for (const rawDelta of [1 / 60, 8, 0, 20]) {
    frame = advanceSimulation(frame, rawDelta, true);
    assert.equal(frame.time, 12.5);
    assert.equal(frame.delta, 0);
  }
  frame = advanceSimulation(frame, 0, false);
  assert.equal(
    frame.time,
    12.5,
    "switching back to always must not rewind phase",
  );
  frame = advanceSimulation(frame, 1 / 60, false);
  assert.equal(frame.time, 12.5 + 1 / 60);
  frame = advanceSimulation(frame, 30, false);
  assert.equal(
    frame.delta,
    0.05,
    "a stalled frame must not skip a full walk cycle",
  );
  assert.equal(frame.time, 12.5 + 1 / 60 + 0.05);
});

test("invalid deltas cannot poison all subsequent animation frames", () => {
  for (const rawDelta of [NaN, Infinity, -2])
    assert.equal(simulationDelta(rawDelta), 0);
  assert.equal(simulationDelta(1 / 120), 1 / 120);
});

test("interface sounds start enabled, migrate the former default and honor a saved mute", () => {
  for (const saved of [
    null,
    undefined,
    {},
    { sound: false },
    { sound: true },
    "broken",
  ])
    assert.equal(restoreInterfaceSound(saved), true);
  assert.equal(
    restoreInterfaceSound({ sound: false, soundPreferenceVersion }),
    false,
  );
  assert.equal(
    restoreInterfaceSound({ sound: true, soundPreferenceVersion }),
    true,
  );
});
