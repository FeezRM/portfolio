import { readdir, mkdir, writeFile } from "node:fs/promises";
import { identifyTrack } from "../lib/game/music.ts";

const directory = new URL("../public/music/", import.meta.url);
await mkdir(directory, { recursive: true });
const tracks = [];
for (const name of (await readdir(directory)).sort()) {
  const id = identifyTrack(name);
  if (!id) continue;
  if (tracks.some((track) => track.id === id)) {
    throw new Error(
      `Multiple audio files match ${id}. Keep one recording per track.`,
    );
  }
  tracks.push({ id, src: `/music/${encodeURIComponent(name)}` });
}
await writeFile(
  new URL("library.json", directory),
  JSON.stringify({ version: 1, tracks }, null, 2) + "\n",
);
console.log(`Prepared ${tracks.length} supplied soundtrack files.`);
