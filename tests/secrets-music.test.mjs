import { test } from "node:test";
import assert from "node:assert/strict";
import {
  advanceSecretCode,
  secretCode,
  restoreDiscoveries,
  addDiscovery,
  secrets,
} from "../lib/game/secrets.ts";
import {
  musicForLocation,
  personaTracks,
  nextTrack,
  tracksForStation,
  restoreMusicPreferences,
  nextAvailableTrack,
  identifyTrack,
  restoreBundledSources,
  formatMusicTime,
} from "../lib/game/music.ts";
import {
  nearestTarget,
  isWalkable,
  cameraOffset,
  movementVector,
} from "../lib/game/world.ts";

test("the arcade sequence unlocks once complete, tolerates uppercase letters, and resets after wrong input", () => {
  let index = 0,
    complete = false;
  for (const key of secretCode) {
    const result = advanceSecretCode(
      index,
      key.toUpperCase().length === 1 ? key.toUpperCase() : key,
    );
    index = result.index;
    complete = result.complete;
  }
  assert.equal(complete, true);
  assert.equal(index, 0);
  assert.equal(advanceSecretCode(3, "x").index, 0);
  assert.equal(advanceSecretCode(4, "ArrowUp").index, 1);
});

test("discovery restoration rejects malformed ids and keeps each reward unique", () => {
  assert.deepEqual(
    restoreDiscoveries(["campus-dog", "invalid", "campus-dog", 3]),
    ["campus-dog"],
  );
  assert.deepEqual(restoreDiscoveries({}), []);
  const found = addDiscovery([], "dark-hour");
  assert.equal(addDiscovery(found, "dark-hour"), found);
  assert.equal(addDiscovery(found, "arcade-code").length, 2);
  assert.equal(
    restoreDiscoveries(secrets.map((s) => s.id)).length,
    secrets.length,
  );
});

test("physical secrets have walkable approaches and resolve the correct action", () => {
  for (const secret of secrets) {
    if (!("position" in secret)) continue;
    const approach = { x: secret.position.x, z: secret.position.z + 1.2 };
    assert.ok(isWalkable(approach), secret.id);
    assert.equal(nearestTarget(approach)?.secret, secret.id);
  }
});

test("the soundtrack opening matches context and the catalogue includes several tracks from each game", () => {
  assert.equal(musicForLocation("profile", false), "seasons");
  assert.equal(musicForLocation("projects", false), "mask");
  assert.equal(musicForLocation("skills", false), "dorm");
  assert.equal(musicForLocation("contact", false), "night");
  assert.equal(musicForLocation("projects", true), "night");
  for (const game of ["3", "4", "5"])
    assert.ok(tracksForStation(game).length >= 3);
});

test("the mix crosses games, wraps in both directions, and game stations stay within their collection", () => {
  assert.equal(nextTrack("night", "mix"), "heartbeat");
  assert.equal(nextTrack("night", "mix", -1), "whatifs");
  assert.equal(nextTrack("whatifs", "mix"), "night");
  assert.equal(nextTrack("seasons", "3"), "dorm");
  assert.equal(nextTrack("dorm", "3"), "night");
  assert.equal(nextTrack("mask", "4"), "heartbeat");
  for (const station of ["3", "4", "5"]) {
    for (const track of tracksForStation(station)) {
      assert.equal(
        personaTracks.find((song) => song.id === nextTrack(track.id, station))
          .game,
        station,
      );
    }
  }
});

test("the audio queue skips unsupplied files, loops a single recording, and handles empty collections", () => {
  assert.equal(
    nextAvailableTrack("night", "mix", ["night", "daylight"]),
    "daylight",
  );
  assert.equal(
    nextAvailableTrack("daylight", "mix", ["night", "daylight"]),
    "night",
  );
  assert.equal(nextAvailableTrack("night", "mix", ["night"]), "night");
  assert.equal(nextAvailableTrack("night", "4", ["night"]), null);
  assert.equal(nextAvailableTrack("night", "mix", []), null);
});

test("supplied files match song titles and manifests reject remote or invalid sources", () => {
  assert.equal(identifyTrack("01 - Color Your Night (P3 Reload).MP3"), "night");
  assert.equal(
    identifyTrack("Persona 4 - Heartbeat, Heartbreak.ogg"),
    "heartbeat",
  );
  assert.equal(identifyTrack("Beneath the Mask.m4a"), "mask");
  assert.equal(identifyTrack("Beneath The Mask Rain.mp3"), "mask");
  assert.equal(identifyTrack("No More What Ifs.mp3"), "whatifs");
  assert.equal(identifyTrack("Color Your Night.exe"), null);
  assert.equal(identifyTrack("unknown-song.mp3"), null);
  assert.deepEqual(
    restoreBundledSources({
      tracks: [
        { id: "night", src: "/music/color-your-night.mp3" },
        { id: "mask", src: "https://example.com/song.mp3" },
        { id: "invalid", src: "/music/unknown.wav" },
        { id: "dorm", src: "/music/../track.wav" },
      ],
    }),
    { night: "/music/color-your-night.mp3" },
  );
  assert.deepEqual(restoreBundledSources(null), {});
});

test("full-length audio times support seeking beyond preview lengths", () => {
  assert.equal(formatMusicTime(227.8), "3:47");
  assert.equal(formatMusicTime(3601), "60:01");
  assert.equal(formatMusicTime(Infinity), "0:00");
});

test("music starts quiet and restores only safe volume and mute preferences", () => {
  assert.deepEqual(restoreMusicPreferences(null), { volume: 15, muted: false });
  assert.deepEqual(restoreMusicPreferences({ volume: 200, muted: true }), {
    volume: 100,
    muted: true,
  });
  assert.equal(restoreMusicPreferences({ volume: -3 }).volume, 0);
  assert.equal(restoreMusicPreferences({ volume: NaN }).volume, 15);
  assert.equal(restoreMusicPreferences({ volume: "100" }).volume, 15);
});

test("waterfront camera looks inland from the water and movement remains aligned to the view", () => {
  const offset = cameraOffset({ x: 0, z: -18 });
  const targetZ = -19,
    rearWallZ = -15.5;
  const cameraZ = -18 + offset.z;
  assert.ok(cameraZ < -20.4, "the camera is on the water side of the railing");
  assert.ok(
    Math.max(cameraZ, targetZ) < rearWallZ,
    "the laboratory cannot obstruct this sightline",
  );
  assert.ok(offset.y < 8, "the waterfront framing stays at human scale");
  const right = movementVector(1, 0, offset.x, offset.z);
  assert.ok(Math.abs(right.x * offset.x + right.z * offset.z) < 0.001);
  assert.ok(Math.abs(Math.hypot(right.x, right.z) - 1) < 0.001);
});
