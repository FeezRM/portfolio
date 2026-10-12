# Supplied Persona soundtrack files

Put the full audio files in this directory, then run `npm run dev` or `npm run build`.
The prebuild script identifies English song titles in filenames and writes `library.json`.
MP3, OGG, M4A, AAC, WAV, and FLAC are accepted; MP3 is the simplest browser-compatible choice.
Only supplied files are queued. Missing tracks are never requested or replaced by previews.

| Game             | Song                    | Suggested filename          |
| ---------------- | ----------------------- | --------------------------- |
| Persona 3 Reload | Color Your Night        | `color-your-night.mp3`      |
| Persona 3 Reload | Changing Seasons        | `changing-seasons.mp3`      |
| Persona 3 Reload | Iwatodai Dorm           | `iwatodai-dorm.mp3`         |
| Persona 4        | Heartbeat, Heartbreak   | `heartbeat-heartbreak.mp3`  |
| Persona 4        | Your Affection          | `your-affection.mp3`        |
| Persona 4        | Signs of Love           | `signs-of-love.mp3`         |
| Persona 5        | Beneath the Mask -Rain- | `beneath-the-mask-rain.mp3` |
| Persona 5        | Tokyo Daylight          | `tokyo-daylight.mp3`        |
| Persona 5        | Sunset Bridge           | `sunset-bridge.mp3`         |
| Persona 5 Royal  | No More What Ifs        | `no-more-what-ifs.mp3`      |

For a personal preview, the player also accepts files through **Add Audio**.
Recognized filenames map automatically; a single unfamiliar filename is assigned to the selected song.
Those files stay in that browser's IndexedDB and are not published to the website.
Files in this directory become part of the static export and play for all visitors.

The player starts at 15% volume after a visitor interaction. Mute and volume preferences persist.
Closing the controls keeps music playing; pause stops it. The mix advances through supplied full recordings.
Three supplied recordings are currently included: Color Your Night, Beneath the Mask Rain, and No More What Ifs. Persona 4 recordings and the remaining catalog selections can be added without changing the player.
