// Actual soundtrack tracks delivered by Spotify's official, visible embed.
// Source: ATLUS's release announcement and the verified Spotify track pages.
export const personaTracks = [
  {
    id: "night",
    name: "Color Your Night",
    artist: "Lotus Juice · Azumi Takahashi · ATLUS Sound Team",
    spotifyId: "4pjFNyjGaoKgLTnndISP6V",
    mood: "NIGHT / HARBOR",
  },
  {
    id: "seasons",
    name: "Changing Seasons -Reload-",
    artist: "Azumi Takahashi · ATLUS Sound Team",
    spotifyId: "1PPzHVc3ietfHHU0vPPPDl",
    mood: "DAY / CAMPUS",
  },
  {
    id: "dorm",
    name: "Iwatodai Dorm -Reload-",
    artist: "Lotus Juice · ATLUS Sound Team",
    spotifyId: "3uekHQtWNzxkcU6eNn16fv",
    mood: "WORKSHOP / PROJECTS",
  },
] as const;

export type TrackId = (typeof personaTracks)[number]["id"];
export function musicForLocation(location: string, night: boolean): TrackId {
  if (night || location === "contact" || location === "stealth") return "night";
  return location === "projects" || location === "skills" ? "dorm" : "seasons";
}
