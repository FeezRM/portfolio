# Original asset ledger

Locally bundled artwork and interface tones were authored in this repository. No game models, character portraits, screenshots, or soundtrack recordings are shipped. Persona soundtrack playback uses supplied audio files through a native HTML audio player. No Spotify or YouTube player is loaded.

| Asset                                                             | Location                                                 | Production method                                                                                                                                |
| ----------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Headphone character illustration                                  | `components/game/Portrait.tsx`                           | Original SVG paths and gradients; used on the title screen and main menu.                                                                        |
| Campus architecture, clock tower, harbor, benches, foliage, signs | `components/game/WorldCanvas.tsx`                        | Authored procedural Three.js geometry and locally generated canvas textures.                                                                     |
| Articulated avatar                                                | `components/game/WorldCanvas.tsx`                        | Original hierarchical mesh rig; joints animate while walking and turning. No external GLB download.                                              |
| Project exhibit sculptures                                        | `components/game/WorldCanvas.tsx`                        | Four original geometric sculptures representing attention, editing, voice, and research.                                                         |
| Project illustrations                                             | `components/game/PortfolioPanel.tsx` + `app/globals.css` | Original CSS illustrations. These are symbolic graphics, not claimed screenshots of the projects.                                                |
| Water                                                             | `components/game/WorldCanvas.tsx`                        | Original procedural GLSL wave pattern.                                                                                                           |
| UI tones                                                          | `lib/game/audio.ts`                                      | Original Web Audio sine-tone sequences, played only after sound is enabled.                                                                      |
| Easter egg dog, blue door, and vending machine                    | `components/game/WorldCanvas.tsx`                        | Original procedural models with Persona-inspired references.                                                                                     |
| Persona soundtrack radio                                          | `lib/game/music.ts` + `components/game/PersonaRadio.tsx` | Native audio playback of supplied recordings. Public files are indexed by scripts/prepare-music.mjs; personal imports remain in browser storage. |
| Display/body/metadata fonts                                       | `app/layout.tsx`                                         | Barlow Condensed, Manrope, JetBrains Mono through Next.js Google Fonts integration; upstream open font families.                                 |

The original character is an illustrative avatar and does not claim to be a likeness of Faiz. The next possible art upgrade is an authored skinned avatar with detailed clothing and richer animation clips; the current release uses an articulated procedural rig.

The catalog contains ten selections across Persona 3 Reload, Persona 4, Persona 5, and Persona 5 Royal. The portfolio owner supplied three full MP3 recordings in public/music: Color Your Night, Beneath The Mask Rain, and No More What Ifs. These are bundled for all visitors. No Persona 4 recording is present yet; its catalog entries remain available for adding files.

See [the supplied-file guide](../../public/music/README.md) for the supported filenames. Add recordings to `public/music/` for inclusion in the static export; filenames containing English song titles are identified automatically. MP3/OGG/M4A/AAC/WAV/FLAC are supported, subject to the browser's decoder.

The player starts quietly at 15% after a visitor interaction, with persistent mute/volume preferences, full-duration seeking, and automatic queueing through available recordings. Its controls can be hidden while the audio keeps playing. It does not request missing tracks, impose a preview cutoff, or contact a third-party music provider.

The optional Add Audio control stores personal copies in IndexedDB on that device. These are never uploaded or included in a deployment. For the owner's soundtrack to play for every visitor, the supplied files must be placed in the public directory and rebuilt.

QA uses two original, quiet synthetic WAV fixtures in ignored `.qa/` storage. Those are audio-engine test fixtures, not Persona recordings, and are not exported with the website.
