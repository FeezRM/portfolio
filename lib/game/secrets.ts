export const secrets = [
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
] as const;

export type SecretId = (typeof secrets)[number]["id"];
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
