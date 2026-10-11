# Persona 3 Reload research

Researched October 11, 2026. This is a design and engineering investigation for Faiz Kerawala's portfolio, not an implementation. Recommendations are in [build-plan.md](build-plan.md).

## 1. Evidence and design interpretation

The original [Famitsu developer interview](https://www.famitsu.com/news/202311/29325647.html), published November 29, 2023, is the strongest primary source. Art director Tomohiro Kumagai describes water and bubbles, an inward psychological ocean, shimmering reflections, and transparency as UI influences. The team created a dedicated menu character model and refined expressions and motion for individual screens. They also prioritized responsiveness and tested concepts in use before selecting them. These are paraphrases of the Japanese interview.

Our interpretation: the portfolio needs one coherent relationship between world, character, typography, and interaction. Color alone will not achieve the requested effect. Menu composition deserves the same attention as the 3D environment.

The [official ATLUS site](https://p3re.jp/en/) presents daily life and dungeon exploration as complementary experiences and highlights improvements to graphics and usability. Its dormitory, school, and island setting suggests a portfolio organized around familiar destinations with different activities. This is inspiration for an original environment; portfolio destinations below are our proposals.

The [PlayStation developer interview](https://blog.ja.playstation.com/2024/02/01/20240201-p3re/) provides additional primary context on the remake's visual and experiential direction. Use it as supporting context, not a source of web implementation techniques.

## 2. Visual references actually inspected

I opened the following images in a browser and examined their composition. These are developer-provided pre-release screenshots hosted by Famitsu, so they establish a direction rather than a pixel-perfect specification for every released screen.

| Reference | Observable details | Portfolio interpretation |
| --- | --- | --- |
| [Main menu](https://www.famitsu.com/images/000/325/647/y_6565605bcae6b.jpg) | Cyan above deep blue; scene visible underneath; oversized cropped lettering; tilted menu list; inverted portrait; contrasting selected row. | Pause menu with a blue wash over the world, an original silhouette, and large typographic navigation. |
| [Equipment menu](https://www.famitsu.com/images/000/325/647/y_6565605bce88d.jpg) | Large white angular field; black list rows; small blue information labels; enormous gray background title; portrait occupies the opposite side. | Project detail layout with strong information hierarchy, white reading space, and a dedicated visual composition. |
| [Exploration HUD](https://www.famitsu.com/images/000/325/647/y_6565605bb3cc2.jpg) | Third-person character; warm architectural environment; minimal corner UI; upper-right date; lower-left map and location; prominent doorway. | Walkable campus with clear architectural landmarks, stable corner HUD, and a real date. |

Additional authoritative visual catalog: [ATLUS game-system and character imagery](https://p3re.jp/en/). The official trailer link was found, but a playable video was not inspected; this research does not claim frame-by-frame motion analysis. Animation timings in the plan are proposed web timings.

## 3. Design rules for this portfolio

These are original recommendations, not claims about ATLUS's exact assets, fonts, color values, or timings.

1. Make blue the dominant interface color: bright aqua light, saturated cobalt fields, midnight depth, white reading panels, black typography.
2. Let the world have warmth and material variation. Blue everywhere would flatten the distinction between exploration and menus.
3. Compose camera views around a landmark, avatar, and destination. Architecture should frame navigation naturally.
4. Use scale contrast: giant decorative headings, large actionable rows, restrained supporting copy.
5. Use diagonal shapes around readable content. Keep paragraphs upright and selectable.
6. Treat menu selection as a small piece of choreography: active bar, title, silhouette, and contextual hint respond together.
7. Give environmental motion a slow rhythm and input feedback a fast one.
8. Keep date, map, location, controls, and content access consistent between destinations.
9. Establish an original character and campus identity around Faiz and his work.
10. Spend the visual budget on lighting, composition, avatar movement, and menus before adding more buildings.

## 4. Browser implementation research

| Primary documentation | Verified capability or constraint | Proposed use |
| --- | --- | --- |
| [React Three Fiber introduction](https://r3f.docs.pmnd.rs/getting-started/introduction) | Fiber 9 pairs with React 19; Fiber 10 is currently described as alpha. | Retain the repository's declared React 19 / Fiber 9 combination. |
| [Three.js WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html) | Current renderer uses WebGL 2; WebGL 1 has not been supported since r163. | Check WebGL 2 and provide a readable alternative on failure. |
| [Next.js lazy loading](https://nextjs.org/docs/app/guides/lazy-loading) | Client components can be deferred; `ssr: false` belongs in a client boundary. | Keep initial HTML useful; mount the world through a client wrapper. |
| [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports) | Static export generates deployable HTML and assets; browser APIs require client-side handling. | Preserve the existing `output: "export"` and Netlify `out` deployment. |
| [Fiber hooks](https://r3f.docs.pmnd.rs/api/hooks) | `useFrame` supplies frame timing and scene access inside Canvas. | Update movement, camera, and avatar animations without React updates each frame. |
| [Fiber performance pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls) | Frequent state updates and repeated object creation in frame loops are problematic. | Use mutable vectors and input refs; React state tracks discrete UI changes. |
| [Fiber scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) | Resource reuse, instancing, adaptive resolution, and demand rendering can reduce cost. | Reuse campus geometry; lower quality when needed; stop ambient motion before rendering on demand. |
| [Three.js GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html) | Supports glTF assets, animation clips, and registered Meshopt/KTX2 decoding. | Export optimized original environment and rigged avatar assets as GLB. |
| [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) | The media query reports the visitor's preference to reduce nonessential motion. | Offer instant location changes and static menu transitions automatically. |
| [MDN WebGL context loss](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/isContextLost) | GPU contexts can be lost, including under competing resource demands. | Keep HTML content available during renderer failures and allow retry. |

The numerical budgets in the build plan are project targets, not measured performance or guarantees from these documents.

## 5. Repository findings

- Clean `main` working tree at inspection; base commit `4e8c164` (`Add ContentSpy launch preview`).
- Created `codex/persona-reload-portfolio` for planning and subsequent implementation.
- `package.json` declares Next.js 16.2.4, React 19.2.5, Fiber ^9.6.1, Three.js ^0.184.0, and postprocessing dependencies. Dependencies are not installed locally; `npm ls --depth=0` reported them missing.
- `app/page.tsx` currently renders Hero, StealthStartup, Projects, Skills, Experience, and Contact. The `About` component exists but is not mounted.
- `lib/data.ts` provides four public projects, six skill groups, three experience/education entries, public contact links, and some older stealth-startup metadata.
- The rendered `StealthStartup` currently names **ContentSpy**, says it is launching soon, and links to **https://contentspy.me**. This is newer than the generic AI Startup object in `lib/data.ts`; migrate the current visible content deliberately.
- `public/resume.md` exists; no resume PDF was found. A download action must not promise a PDF until one is supplied or created separately.
- Existing Three.js usage is an effects component; no walkable scene, rigged avatar, navigation graph, collision system, or original 3D environment assets were found.
- `next.config.mjs` enables static export; `netlify.toml` builds and publishes `out`. The redesign can remain a static site.

## 6. Limits and open dependencies

The hardest work is art production and polish: a convincing original avatar, animation, authored architectural props, baked lighting, and pleasing camera composition. The declared JavaScript stack makes a prototype feasible, but does not supply these assets.

A constrained flat campus makes navigation and collision practical without a full physics engine. Multiple elaborate interiors, freely rotating cameras, crowds, and a large city would significantly increase production and testing effort. Those are expansion ideas after the initial campus meets its quality goals.

No application code was changed or benchmarked during this planning task. No models, music, or textures were purchased or licensed. Exact game fonts and production shader code were not verified. The plan uses original design tokens and assets rather than treating reference screenshots as runtime resources.
