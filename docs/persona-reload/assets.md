# Original asset ledger

All visual and audio assets introduced for Blue Hour were authored in this repository. No game models, character portraits, screenshots, or soundtrack recordings are shipped.

| Asset | Location | Production method |
| --- | --- | --- |
| Headphone character illustration | `components/game/Portrait.tsx` | Original SVG paths and gradients; used on the title screen and main menu. |
| Campus architecture, clock tower, harbor, benches, foliage, signs | `components/game/WorldCanvas.tsx` | Authored procedural Three.js geometry and locally generated canvas textures. |
| Articulated avatar | `components/game/WorldCanvas.tsx` | Original hierarchical mesh rig; joints animate while walking and turning. No external GLB download. |
| Project exhibit sculptures | `components/game/WorldCanvas.tsx` | Four original geometric sculptures representing attention, editing, voice, and research. |
| Project illustrations | `components/game/PortfolioPanel.tsx` + `app/globals.css` | Original CSS illustrations. These are symbolic graphics, not claimed screenshots of the projects. |
| Water | `components/game/WorldCanvas.tsx` | Original procedural GLSL wave pattern. |
| UI tones | `lib/game/audio.ts` | Original Web Audio sine-tone sequences, played only after sound is enabled. |
| Display/body/metadata fonts | `app/layout.tsx` | Barlow Condensed, Manrope, JetBrains Mono through Next.js Google Fonts integration; upstream open font families. |

The original character is an illustrative avatar and does not claim to be a likeness of Faiz. The next possible art upgrade is an authored skinned avatar with detailed clothing and richer animation clips; the current release uses an articulated procedural rig.
