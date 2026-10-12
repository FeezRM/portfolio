import { contentAlchemy, isPublicInstagramHref } from "./alchemy.ts";

const secretDefinitions = [
  {
    id: "campus-dog",
    title: "A very good companion",
    action: "Pet the campus dog",
    hint: "A small friend is waiting by the waterfront benches.",
    message:
      "You gave the campus dog a head pat. Social Link +1. Some connections need no words.",
    symbol: "♡",
    position: { x: 5.6, z: -17 },
  },
  {
    id: "velvet-door",
    title: "A door between worlds",
    action: "Investigate the blue door",
    hint: "Take the quieter path behind the workshop. Look for a door that glows.",
    message:
      "Welcome to the space between ideas and reality. Every great project begins with a possibility.",
    symbol: "◇",
    position: { x: -13.5, z: -8.5 },
  },
  {
    id: "moon-soda",
    title: "Midnight refreshment",
    action: "Try the vending machine",
    hint: "There is a peculiar vending machine near the archive. Its best drink is never on the menu.",
    message:
      "Obtained: Moonlight Soda. Curiosity restored. You feel ready to build something extraordinary.",
    symbol: "✧",
    position: { x: 12.5, z: 8.5 },
  },
  {
    id: "dark-hour",
    title: "The hour between days",
    action: "",
    hint: "The moon beside the date is more than decoration. Seven little taps might reveal something.",
    message:
      "You found the Dark Hour. The campus slips into blue, but your time is still your own.",
    symbol: "◐",
  },
  {
    id: "arcade-code",
    title: "Old-school instincts",
    action: "",
    hint: "An old arcade secret: ↑ ↑ ↓ ↓ ← → ← → B A. Try it on the title screen or while exploring.",
    message:
      "A familiar sequence. A new possibility. Your arcade instincts are still sharp.",
    symbol: "⚡",
  },
  {
    id: "alchemy-lab",
    title: "The other side of Faiz",
    action: "Investigate the alchemy desk",
    hint: "Past the workshop, a desk glows a little warmer than the rest of the campus. Look for three tiny bottles.",
    message:
      "You found Content Alchemy. There is a creator behind the engineer. Step inside and build a little content magic.",
    symbol: "△",
    position: { x: -16, z: 8 },
  },
  {
    id: "hello-world",
    title: "The first message",
    action: "",
    hint: "A lighthouse on the far shore sends a familiar greeting. Click the tower across the water.",
    message:
      "HELLO, WORLD. Even a tiny first program can be the beginning of something big. Lighthouse connection established.",
    symbol: "⌘",
  },
  {
    id: "alchemy-seal",
    title: "The creator's codex",
    action: "",
    hint: "Inside the hidden studio, four ingredients belong in one particular order. Start with a spark; finish with refinement.",
    message:
      "Ideation → scripting → recording → editing. You turned scattered ingredients into a system. The creator's codex is yours.",
    symbol: "✦",
  },
  {
    id: "creator-signal",
    title: "A signal from the studio",
    action: "Inspect the studio phone",
    hint: "There is a little phone beside the courtyard benches. Its signal comes from outside this world.",
    message:
      "You found the creator's frequency. Follow the signal to Faiz's Instagram.",
    symbol: "◉",
    position: { x: -5.8, z: 12.4 },
    available: isPublicInstagramHref(contentAlchemy.instagramHref),
  },
  {
    id: "alchemy-offer",
    title: "An invitation to build",
    action: "Read the sealed commission",
    hint: "A sealed envelope sits beside the alchemy desk. Some quests are meant to become real collaborations.",
    message:
      "A new quest awaits. Open the commission to explore working with Content Alchemy.",
    symbol: "✉",
    position: { x: -14.5, z: 6.7 },
    available: contentAlchemy.offer !== null,
  },
] as const;

export const secrets = secretDefinitions.filter(
  (secret) => !("available" in secret) || secret.available,
);
export type SecretId = (typeof secretDefinitions)[number]["id"];
const coreSecretIds: SecretId[] = [
  "campus-dog",
  "velvet-door",
  "moon-soda",
  "dark-hour",
  "arcade-code",
];

// Additional stories never take the original outfit reward away from returning explorers.
export function hasGoldenJacket(discovered: readonly SecretId[]) {
  return coreSecretIds.every((id) => discovered.includes(id));
}
export const secretStorageKey = "faiz-blue-hour-discoveries-v1";
export const secretCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function advanceSecretCode(index: number, key: string) {
  const normalized = key.length === 1 ? key.toLowerCase() : key;
  const next =
    normalized === secretCode[index]
      ? index + 1
      : normalized === secretCode[0]
        ? 1
        : 0;
  return {
    index: next === secretCode.length ? 0 : next,
    complete: next === secretCode.length,
  };
}

export function restoreDiscoveries(value: unknown): SecretId[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value.filter((id): id is SecretId =>
        secrets.some((secret) => secret.id === id),
      ),
    ),
  );
}

export function addDiscovery(discovered: SecretId[], id: SecretId) {
  return discovered.includes(id) ? discovered : [...discovered, id];
}
