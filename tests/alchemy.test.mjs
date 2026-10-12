import { test } from "node:test";
import assert from "node:assert/strict";
import {
  advanceAlchemyRecipe,
  creatorCodexText,
  isPublicInstagramHref,
} from "../lib/game/alchemy.ts";
import { hasGoldenJacket, restoreDiscoveries } from "../lib/game/secrets.ts";
import { parseHash } from "../lib/game/world.ts";

test("alchemy only completes in the content production order, with wrong guesses preserving progress", () => {
  let progress = 0;
  assert.equal(advanceAlchemyRecipe(progress, "editing").progress, 0);
  for (const id of ["ideation", "scripting", "recording", "editing"]) {
    const next = advanceAlchemyRecipe(progress, id);
    assert.ok(next.accepted);
    progress = next.progress;
    assert.equal(next.complete, progress === 4);
    if (progress < 4)
      assert.equal(advanceAlchemyRecipe(progress, id).progress, progress);
  }
  assert.equal(advanceAlchemyRecipe(progress, "editing").accepted, false);
  assert.equal(advanceAlchemyRecipe(NaN, "ideation").progress, 1);
});

test("the original outfit stays unlocked after adding business secrets", () => {
  const original = [
    "campus-dog",
    "velvet-door",
    "moon-soda",
    "dark-hour",
    "arcade-code",
  ];
  assert.ok(hasGoldenJacket(restoreDiscoveries(original)));
  assert.equal(hasGoldenJacket(restoreDiscoveries(original.slice(1))), false);
});

test("studio links round-trip and reject unknown rooms", () => {
  for (const tab of ["studio", "signal", "offer"])
    assert.deepEqual(parseHash(`#alchemy/${tab}`), {
      overlay: "alchemy",
      project: tab,
    });
  assert.deepEqual(parseHash("#alchemy/unknown"), {
    overlay: "alchemy",
    project: "studio",
  });
});

test("codex exports a bounded topic without injecting extra lines", () => {
  const text = creatorCodexText("  My idea\n NEW PAGE ");
  assert.ok(text.includes("Build a content system around: My idea NEW PAGE\n"));
  assert.ok(text.includes("4. EDITING"));
  assert.equal(
    creatorCodexText("x".repeat(500)).split("\n")[1].split(": ")[1].length,
    100,
  );
});

test("Instagram destinations accept only secure profile links", () => {
  assert.ok(
    isPublicInstagramHref("https://www.instagram.com/example.creator/"),
  );
  for (const link of [
    null,
    "https://instagram.com.evil.test/user",
    "javascript:alert(1)",
    "http://instagram.com/user",
    "https://instagram.com/p/post",
    "https://user:pass@instagram.com/profile",
    "https://instagram.com/profile?redirect=elsewhere",
  ])
    assert.equal(isPublicInstagramHref(link), false, String(link));
});
