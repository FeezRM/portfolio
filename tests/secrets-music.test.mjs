import { test } from "node:test";
import assert from "node:assert/strict";
import {
  advanceSecretCode,
  secretCode,
  restoreDiscoveries,
  addDiscovery,
  secrets,
} from "../lib/game/secrets.ts";
import { musicForLocation, personaTracks } from "../lib/game/music.ts";
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
  assert.equal(restoreDiscoveries(secrets.map((s) => s.id)).length, 5);
});

test("physical secrets have walkable approaches and resolve the correct action", () => {
  for (const secret of secrets) {
    if (!("position" in secret)) continue;
    const approach = { x: secret.position.x, z: secret.position.z + 1.2 };
    assert.ok(isWalkable(approach), secret.id);
    assert.equal(nearestTarget(approach)?.secret, secret.id);
  }
});

test("music follows campus context and night overrides daytime themes", () => {
  assert.equal(musicForLocation("profile", false), "seasons");
  assert.equal(musicForLocation("projects", false), "dorm");
  assert.equal(musicForLocation("skills", false), "dorm");
  assert.equal(musicForLocation("contact", false), "night");
  assert.equal(musicForLocation("projects", true), "night");
  personaTracks.forEach((track) =>
    assert.match(track.spotifyId, /^[A-Za-z0-9]{22}$/),
  );
});

test("waterfront camera sees above the lab and movement remains aligned to the new view", () => {
  const offset = cameraOffset({ x: 0, z: -18 });
  const targetZ = -19,
    targetHeight = 0.9,
    rearWallZ = -15.5;
  const fraction = (rearWallZ - targetZ) / (-18 + offset.z - targetZ);
  assert.ok(targetHeight + fraction * (offset.y - targetHeight) > 5.7);
  const right = movementVector(1, 0, offset.x, offset.z);
  assert.ok(Math.abs(right.x * offset.x + right.z * offset.z) < 0.001);
  assert.ok(Math.abs(Math.hypot(right.x, right.z) - 1) < 0.001);
});
