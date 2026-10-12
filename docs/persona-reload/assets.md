# Original asset ledger

The character, architecture, illustration, foliage textures, and interface tones are original assets authored for this portfolio. The lighting environment comes from Poly Haven under CC0. Persona soundtrack playback uses the user-supplied audio files through a native HTML audio player. No Spotify or YouTube player is loaded.

| Asset                                                             | Location                                                 | Production method                                                                                                                                |
| ----------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Headphone character illustration                                  | `components/game/Portrait.tsx`                           | Original SVG paths and gradients; used on the title screen and main menu.                                                                        |
| Campus architecture, clock tower, harbor, benches, foliage, signs | `components/game/WorldCanvas.tsx`                        | Authored procedural Three.js geometry and locally generated canvas textures.                                                                     |
| Articulated avatar                                                | `components/game/WorldCanvas.tsx`                        | Original skinned GLB at `public/models/faiz-blue-hour.glb`; authoring source in `scripts/author-campus-avatar.mjs`; blended Idle/Walk clips.                                              |
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


## Visual upgrade — October 12, 2026

- `public/models/faiz-blue-hour.glb`: original 17-bone avatar, smooth clothing/hair meshes, headphone details, Idle and Walk animation clips. Authored with the reproducible Three.js mesh/export script, not downloaded from a game or avatar marketplace. Uncompressed GLB: 953,448 bytes. Run `node scripts/author-campus-avatar.mjs` to regenerate.
- `components/game/CampusArchitecture.tsx`: original beveled facade kit, inset framed windows, door hardware, wooden benches, lathed clock column, four clock faces, ground color/bump textures, and painted leaf-cluster cutouts. Static trim is batched by material; foliage uses instancing.
- `public/environments/kiara-dawn-1k.hdr`: Kiara 1 Dawn by Greg Zaal, from [Poly Haven](https://polyhaven.com/a/kiara_1_dawn), downloaded from [the official asset CDN](https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kiara_1_dawn_1k.hdr). [CC0 asset license](https://polyhaven.com/license). 1,475,077 bytes. Self-hosted, used for lighting/reflections.
- Total new model/environment files: 2,428,525 bytes (approximately 2.32 MiB), before HTTP compression. Source GLB remains readable and below 1 MiB; geometry compression is not required for this initial asset.
- Environment materials, lighting, ambient occlusion, bloom, and water shading are art-directed for this portfolio. They are not representations of ATLUS shader code. No Quaternius pack or three-vrm dependency is bundled; the shipped character uses the native GLTF path.
