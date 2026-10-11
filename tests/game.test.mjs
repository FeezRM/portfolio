import { test } from "node:test";
import assert from "node:assert/strict";
import {
  movementVector,
  movePlayer,
  isWalkable,
  nearestTarget,
  parseHash,
  dateParts,
  destinations,
} from "../lib/game/world.ts";

test("diagonal movement is normalized and camera relative", () => {
  const straight = movementVector(0, -1),
    diagonal = movementVector(1, -1);
  assert.ok(straight.x < 0 && straight.z < 0);
  assert.ok(
    Math.abs(
      Math.hypot(straight.x, straight.z) - Math.hypot(diagonal.x, diagonal.z),
    ) < 0.001,
  );
  assert.deepEqual(movementVector(0, 0), { x: 0, z: 0 });
});

test("collision blocks tunneling through buildings and permits wall sliding", () => {
  const blocked = movePlayer({ x: -5, z: -8 }, 0, -10);
  assert.ok(blocked.z > -10.3);
  assert.ok(isWalkable(blocked));
  const slide = movePlayer({ x: -5, z: -10 }, 2, -1);
  assert.ok(slide.x > -3.1);
  assert.ok(slide.z > -10.3);
  assert.ok(isWalkable(slide));
});

test("boundaries contain the avatar and every travel anchor is safe", () => {
  const edge = movePlayer({ x: 18, z: 15 }, 8, 8);
  assert.ok(edge.x < 19 && edge.z < 16);
  assert.ok(isWalkable(edge));
  destinations.forEach((d) => assert.ok(isWalkable(d.position), d.name));
});

test("project proximity resolves a specific exhibit; distant points have no prompt", () => {
  assert.deepEqual(nearestTarget({ x: -7, z: -3.3 }), {
    section: "projects",
    project: "focusflow",
    label: "FocusFlow",
  });
  assert.equal(nearestTarget({ x: -9, z: 15 }), null);
});

test("hashes accept real sections and projects, preserve old anchors, and reject unknown content", () => {
  assert.deepEqual(parseHash("#projects/focusflow"), {
    overlay: "projects",
    project: "focusflow",
  });
  assert.deepEqual(parseHash("#/projects/soulsync"), {
    overlay: "projects",
    project: "soulsync",
  });
  assert.deepEqual(parseHash("#stealth"), {
    overlay: "stealth",
    project: undefined,
  });
  assert.deepEqual(parseHash("#projects/invalid"), {
    overlay: "projects",
    project: undefined,
  });
  assert.deepEqual(parseHash("#invalid"), { overlay: null });
  assert.deepEqual(parseHash("#home"), { overlay: null });
});

test("calendar uses the current local day across midnight and year rollover", () => {
  const before = dateParts(new Date(2026, 11, 31, 23, 59));
  const after = dateParts(new Date(2027, 0, 1, 0, 0));
  assert.equal(before.month, "12");
  assert.equal(before.day, "31");
  assert.equal(before.period, "Evening");
  assert.equal(after.month, "01");
  assert.equal(after.day, "01");
  assert.equal(after.year, 2027);
  assert.equal(after.period, "Morning");
});
