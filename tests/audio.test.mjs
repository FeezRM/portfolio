import { test } from "node:test";
import assert from "node:assert/strict";
import { playTone } from "../lib/game/audio.ts";

test("interface tones wait for audio activation and mute remains silent", async () => {
  const original = globalThis.AudioContext;
  let constructions = 0,
    resumed = false;
  const starts = [],
    stops = [],
    volumes = [];
  globalThis.AudioContext = class {
    constructor() {
      constructions++;
    }
    destination = {};
    get currentTime() {
      assert.equal(resumed, true);
      return 4;
    }
    async resume() {
      await Promise.resolve();
      resumed = true;
    }
    createOscillator() {
      assert.equal(resumed, true);
      return {
        frequency: {},
        connect() {},
        start(time) {
          starts.push(time);
        },
        stop(time) {
          stops.push(time);
        },
      };
    }
    createGain() {
      return {
        connect() {},
        gain: {
          setValueAtTime() {},
          linearRampToValueAtTime(value) {
            volumes.push(value);
          },
          exponentialRampToValueAtTime() {},
        },
      };
    }
  };
  try {
    await playTone("open", false);
    assert.equal(constructions, 0);
    await playTone("open", true);
    assert.equal(constructions, 1);
    assert.deepEqual(starts, [4, 4.055]);
    assert.ok(stops.every((time, i) => time > starts[i]));
    assert.ok(volumes.every((volume) => volume > 0 && volume <= 0.035));
    await playTone("select", false);
    assert.equal(starts.length, 2);
  } finally {
    globalThis.AudioContext = original;
  }
});
