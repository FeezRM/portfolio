import { test } from "node:test";
import assert from "node:assert/strict";
import {
  rootNavigation,
  openPanel,
  backPanel,
  syncPanel,
  panelHash,
} from "../lib/game/navigation.ts";
import { bindMovementKeys } from "../lib/game/input.ts";
import { parseHash } from "../lib/game/world.ts";

test("menu sections return to the menu, then back to the world", () => {
  for (const overlay of [
    "profile",
    "projects",
    "skills",
    "experience",
    "stealth",
    "contact",
    "map",
    "settings",
    "journal",
    "alchemy",
  ]) {
    let navigation = openPanel(rootNavigation(), { overlay: "menu" });
    navigation = openPanel(navigation, { overlay });
    if (overlay === "projects")
      navigation = openPanel(navigation, { overlay, project: "focusflow" });
    navigation = backPanel(navigation);
    assert.equal(navigation.current.overlay, "menu", overlay);
    assert.equal(navigation.parents.length, 0);
    assert.equal(backPanel(navigation).current.overlay, null);
  }
});

test("world discoveries and direct links close to the world, with deeper panels preserving their parent", () => {
  const direct = openPanel(rootNavigation(), { overlay: "profile" });
  assert.equal(backPanel(direct).current.overlay, null);
  const nested = openPanel(direct, { overlay: "contact" });
  assert.equal(backPanel(nested).current.overlay, "profile");
  const external = syncPanel(nested, { overlay: "skills" });
  assert.equal(backPanel(external).current.overlay, null);
});

test("native history can revisit the menu without retaining stale panel parents", () => {
  const menu = openPanel(rootNavigation(), { overlay: "menu" });
  const child = openPanel(menu, { overlay: "projects" });
  const back = syncPanel(child, parseHash("#menu"));
  assert.equal(back.current.overlay, "menu");
  assert.deepEqual(back.parents, []);
  for (const overlay of ["menu", "map", "settings", "journal"])
    assert.equal(parseHash(panelHash({ overlay })).overlay, overlay);
});

function dispatch(host, type, properties = {}) {
  const event = new Event(type, { cancelable: true });
  Object.assign(event, properties);
  host.dispatchEvent(event);
}

test("a mouse click or focus loss clears a stale movement key and momentum", () => {
  const host = new EventTarget(),
    keys = new Set();
  let resets = 0;
  const remove = bindMovementKeys(
    host,
    keys,
    () => true,
    () => resets++,
  );
  for (const interruption of ["pointerdown", "blur", "pagehide"]) {
    dispatch(host, "keydown", { key: "W" });
    assert.ok(keys.has("w"));
    dispatch(host, interruption, { pointerType: "mouse" });
    assert.equal(keys.size, 0);
  }
  assert.equal(resets, 3);
  dispatch(host, "keydown", { key: "a" });
  dispatch(host, "keyup", { key: "A", ctrlKey: true });
  assert.equal(
    keys.size,
    0,
    "a release always wins, even after modifier changes",
  );
  remove();
  dispatch(host, "keydown", { key: "w" });
  assert.equal(keys.size, 0, "unmounted controls cannot retain movement");
});

test("paused controls ignore movement and a touch pointer does not cancel keyboard input", () => {
  const host = new EventTarget(),
    keys = new Set();
  let enabled = false;
  const remove = bindMovementKeys(
    host,
    keys,
    () => enabled,
    () => {},
  );
  dispatch(host, "keydown", { key: "d" });
  assert.equal(keys.size, 0);
  enabled = true;
  dispatch(host, "keydown", { key: "d" });
  dispatch(host, "pointerdown", { pointerType: "touch" });
  assert.ok(keys.has("d"));
  dispatch(host, "keyup", { key: "d" });
  assert.equal(keys.size, 0);
  remove();
});
