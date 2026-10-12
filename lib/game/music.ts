// The recordings are supplied separately; this file contains playlist metadata only.
export const personaTracks = [
  {
    id: "night",
    name: "Color Your Night",
    game: "3",
    edition: "Persona 3 Reload",
    artist: "Lotus Juice · Azumi Takahashi",
    slug: "color-your-night",
  },
  {
    id: "heartbeat",
    name: "Heartbeat, Heartbreak",
    game: "4",
    edition: "Persona 4",
    artist: "Shihoko Hirata",
    slug: "heartbeat-heartbreak",
  },
  {
    id: "mask",
    name: "Beneath the Mask -Rain-",
    game: "5",
    edition: "Persona 5",
    artist: "Lyn",
    slug: "beneath-the-mask",
  },
  {
    id: "seasons",
    name: "Changing Seasons -Reload-",
    game: "3",
    edition: "Persona 3 Reload",
    artist: "Azumi Takahashi",
    slug: "changing-seasons",
  },
  {
    id: "affection",
    name: "Your Affection",
    game: "4",
    edition: "Persona 4",
    artist: "Shihoko Hirata",
    slug: "your-affection",
  },
  {
    id: "daylight",
    name: "Tokyo Daylight",
    game: "5",
    edition: "Persona 5",
    artist: "ATLUS Sound Team",
    slug: "tokyo-daylight",
  },
  {
    id: "dorm",
    name: "Iwatodai Dorm -Reload-",
    game: "3",
    edition: "Persona 3 Reload",
    artist: "Lotus Juice",
    slug: "iwatodai-dorm",
  },
  {
    id: "signs",
    name: "Signs of Love",
    game: "4",
    edition: "Persona 4",
    artist: "Shihoko Hirata",
    slug: "signs-of-love",
  },
  {
    id: "sunset",
    name: "Sunset Bridge",
    game: "5",
    edition: "Persona 5",
    artist: "ATLUS Sound Team",
    slug: "sunset-bridge",
  },
  {
    id: "whatifs",
    name: "No More What Ifs",
    game: "5",
    edition: "Persona 5 Royal",
    artist: "Lyn",
    slug: "no-more-what-ifs",
  },
] as const;
export type TrackId = (typeof personaTracks)[number]["id"];
export type Station = "mix" | "3" | "4" | "5";
export type TrackSources = Partial<Record<TrackId, string>>;
export const defaultMusicVolume = 15;
export const musicPreferenceKey = "faiz-persona-radio-v3";
export const audioExtension = /\.(mp3|ogg|m4a|aac|wav|flac)$/i;
export function tracksForStation(station: Station) {
  return personaTracks.filter(
    (track) => station === "mix" || track.game === station,
  );
}
export function nextTrack(
  id: TrackId,
  station: Station,
  direction = 1,
): TrackId {
  return nextAvailableTrack(
    id,
    station,
    personaTracks.map((track) => track.id),
    direction,
  )!;
}
export function nextAvailableTrack(
  id: TrackId,
  station: Station,
  available: TrackId[],
  direction = 1,
): TrackId | null {
  const queue = tracksForStation(station).filter((track) =>
    available.includes(track.id),
  );
  if (!queue.length) return null;
  const index = queue.findIndex((track) => track.id === id);
  if (index < 0) return queue[0].id;
  return queue[
    (index + (direction % queue.length) + queue.length) % queue.length
  ].id;
}
export function musicForLocation(location: string, night: boolean): TrackId {
  if (night || location === "contact" || location === "stealth") return "night";
  if (location === "projects") return "mask";
  if (location === "skills") return "dorm";
  return "seasons";
}
export function identifyTrack(filename: string): TrackId | null {
  if (!audioExtension.test(filename)) return null;
  const normalized = filename.toLowerCase().replace(/[^a-z0-9]/g, "");
  return (
    personaTracks.find((track) =>
      normalized.includes(track.slug.replace(/-/g, "")),
    )?.id ?? null
  );
}
export function restoreBundledSources(value: unknown): TrackSources {
  const result: TrackSources = {};
  if (
    !value ||
    typeof value !== "object" ||
    !("tracks" in value) ||
    !Array.isArray(value.tracks)
  )
    return result;
  for (const item of value.tracks) {
    if (!item || typeof item !== "object") continue;
    if (
      personaTracks.some((track) => track.id === item.id) &&
      typeof item.src === "string" &&
      /^\/music\/[^/\\]+$/.test(item.src) &&
      audioExtension.test(item.src)
    )
      result[item.id as TrackId] = item.src;
  }
  return result;
}
export function restoreMusicPreferences(value: unknown) {
  const preferences =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  return {
    volume:
      typeof preferences.volume === "number" &&
      Number.isFinite(preferences.volume)
        ? Math.max(0, Math.min(100, preferences.volume))
        : defaultMusicVolume,
    muted: preferences.muted === true,
  };
}
export function formatMusicTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}
