# Visual quality upgrade research

Researched October 11, 2026 for the existing `codex/persona-reload-portfolio` branch. This document proposes a graphics upgrade; it does not change the running website or install dependencies or skills.

## Recommendation

Keep Next.js, React Three Fiber, and Three.js. Rebuild the visible world around detailed, smoothly shaded models, a rigged anime avatar, intentional materials, and carefully staged lighting. Aim for a contemporary anime campus with Persona-inspired presentation. The existing block-based scene is a useful interactive prototype, but its asset construction is the main limit on visual quality.

Start with one finished arrival courtyard: character, clock tower, one facade, vegetation, ground, lighting, and camera. Use that scene as the quality benchmark before extending the approach to every destination. Postprocessing alone will make the current geometry look more polished, but will retain its box-shaped silhouettes.

## What makes the current scene look blocky

Findings from the code and the existing desktop screenshot:

| Current implementation | Visible consequence | Proposed replacement |
| --- | --- | --- |
| `WorldCanvas.tsx:38`, `:143`: shared box primitive and buildings assembled from scaled boxes | Sharp, rectangular silhouettes; little architectural depth | Beveled facade modules, recessed windows, frames, trim, doorways, steps, and distinct roof profiles |
| `WorldCanvas.tsx:98`: six-sided trunks and low-detail icosahedron crowns | Faceted, geometric vegetation | Authored stylized tree silhouettes, branches, leaf clusters, textured ground cover |
| `WorldCanvas.tsx:667`: box torso/limbs, low-segment head, four-sided hair spikes | Toy-like character; mechanical joint movement | Smooth skinned GLB or VRM character with authored hair, clothing, idle and walk clips |
| `WorldCanvas.tsx:52`: most boxes share a flat-color standard material with roughness 0.72 | Concrete, clothing, roof, and furniture have similar surface responses | A small coherent material library with normal, roughness, color, and ambient-occlusion detail |
| `WorldCanvas.tsx:1014`: hemisphere light plus one directional light; no environment map or postprocessing composer | Weak local contact depth and simple reflections | Controlled environment lighting, softer direct shadows, static baked ambient detail, restrained screen-space AO |
| `lib/game/world.ts:156`: elevated camera offset, rising further at the harbor | The world reads as a small overhead diorama | Lower, closer third-person camera with obstacle handling and better landmark framing |

The screenshot's large pale surfaces also reduce visual contrast. That is an art-direction observation, not a measured exposure defect. Increasing sphere segments addresses faceting, but cannot add believable clothing, window recesses, or architecture. Anti-aliasing addresses jagged pixels, not missing model detail.

The project already has Three.js 0.184, Fiber 9, React 19, and installed `@react-three/postprocessing` 3.0.4. The effects library is currently unused in the world. Drei and a model-loading pipeline are absent, and no GLB/VRM/Blender assets were found in the repository.

## Useful repositories and documentation

| Source | Why it helps this project | Recommended use |
| --- | --- | --- |
| [pmndrs/drei](https://github.com/pmndrs/drei) | Model and texture loaders, animation helpers, environment lighting, shadow helpers, instancing, and performance tools | Add selectively: `useGLTF`, `useAnimations`, `Environment`, and repeated-object instancing. Rounded primitives are useful for secondary props, but do not replace authored hero models. |
| [pmndrs/gltfjsx](https://github.com/pmndrs/gltfjsx) | Converts GLTF assets into reusable React scene components and supports asset transformation | Generate typed wrappers where individual facade parts, materials, or interactable nodes need access. A plain cached GLTF loader is sufficient for indivisible assets. |
| [pmndrs/react-postprocessing](https://github.com/pmndrs/react-postprocessing) and [N8AO documentation](https://react-postprocessing.docs.pmnd.rs/passes/n8ao) | Ambient occlusion adds contact depth; bloom supports luminous blue accents | Use modest AO and bloom in the desktop quality tier. Select an anti-aliasing approach and deliberate tone mapping; avoid stacking redundant effects. |
| [pixiv/three-vrm](https://github.com/pixiv/three-vrm) | Loads VRM anime avatars into Three.js and provides MToon material support | Strong option for an original anime character. The model and compatible animations still need to be created or sourced and integrated. |
| [donmccurdy/glTF-Transform](https://github.com/donmccurdy/glTF-Transform) and [CLI documentation](https://gltf-transform.dev/cli) | Pruning, deduplication, geometry and texture optimization | Optimize exported models before shipping. Use Meshopt or Draco deliberately, and KTX2 textures when the loader supports them. Preserve an uncompressed source asset. |
| [brunosimon/folio-2025](https://github.com/brunosimon/folio-2025) | A relevant game-like portfolio with documented Blender export, texture compression, and separate foliage, lighting, weather, and rendering systems | Study the asset pipeline and environmental layering. Its visual identity and vehicle gameplay are different from ours. Use it as an engineering reference for authored assets and coordinated systems. |
| [pmndrs/ecctrl](https://github.com/pmndrs/ecctrl) | Character controllers, runtime animation states, touch controls, and Rapier integration | Optional later improvement for slopes, steps, and more physical movement. It is not necessary to begin the visual upgrade. |

The Folio 2025 repository declares an [MIT license](https://github.com/brunosimon/folio-2025/blob/main/license.md). Study its techniques without copying its entire identity. For each third-party asset, retain its own provenance and terms.

Compatibility detail: the installed postprocessing wrapper is 3.0.4. The [3.1.3 release](https://github.com/pmndrs/react-postprocessing/releases/tag/v3.1.3) fixes composer sizing when pixel ratio changes, including N8AO output. Our quality setting changes DPR, so an effects upgrade should include that fix and test quality transitions, resize, and paused/resumed rendering. The releases page also lists 3.2.0; choose and pin a compatible version during implementation rather than blindly upgrading every package.

The [Drei Environment documentation](https://drei.docs.pmnd.rs/staging/environment) warns that CDN presets are not intended for production. Self-host the selected environment file under `public`, and keep its resolution proportionate to the scene.

## Asset routes

### Character

[VRoid Studio](https://vroid.com/en/studio) can create an original anime character and export VRM. Pair that with three-vrm for toon shading, then integrate compatible idle/walk animation and bone attachments for headphones. VRM loading does not automatically provide locomotion or animation retargeting.

A custom Blender-authored rigged GLB is the alternative when a precise outfit and silhouette matter most. Define the bone rig and animation naming before integration. Preserve the golden-outfit secret with a material variant rather than a duplicate full model.

### Campus

Create a consistent modular architectural kit: facade bays, recessed windows, glass panes, cornices, railings, doors, stairs, planters, benches, and one distinctive clock-tower model. Bevel visible edges and author normals, UVs, and material separation deliberately. Give individual destinations their own silhouette and lighting, with a consistent palette.

[Quaternius Ultimate Stylized Nature](https://quaternius.com/packs/ultimatestylizednature.html) supplies textured nature assets with normal maps in glTF and Blender formats under CC0. It is a credible starting point for organic foliage. Check the actual assets against the campus style before adopting them; a pack labeled low-poly is not automatically an improvement.

[Poly Haven](https://polyhaven.com/license) provides CC0 HDRIs, textures, and models. Use its lighting and material assets selectively: stone pavement, concrete, metal, and an appropriate sky environment. Tone down photorealistic texture contrast to fit the anime direction.

For a genuinely detailed campus, authored geometry is required. A skill, shader, or new renderer cannot automatically supply a finished coherent 3D environment. Asset sourcing/modeling is the largest workstream.

## Skills worth considering

I checked the skills.sh leaderboard, individual listings, and source repositories. The CLI search hit an npm DNS failure; direct website and GitHub inspection supplied the findings below. Counts are reported by the directory at research time and are not a quality guarantee.

| Skill | Verified source/popularity | Fit |
| --- | --- | --- |
| [threejs-lighting](https://skills.sh/cloudai-x/threejs-skills/threejs-lighting) | CloudAI-X; approximately 10.5K installs; source repository approximately 3.5K GitHub stars | Environment lighting, shadow configuration, and lighting concepts |
| [threejs-loaders](https://skills.sh/cloudai-x/threejs-skills/threejs-loaders) | CloudAI-X; approximately 10.4K installs; same repository | GLTF loading, texture loading, asset coordination, and caching |
| [threejs-animation](https://skills.sh/cloudai-x/threejs-skills/threejs-animation) | CloudAI-X; approximately 17.3K installs; same repository | Skeletal animation, animation mixing, morph targets, and idle/walk blending |
| [react-three-fiber-game](https://github.com/openai/plugins/blob/main/plugins/game-studio/skills/react-three-fiber-game/SKILL.md) | Official OpenAI game-studio source; directory install count could not be verified | Scene/camera/gameplay separation and integrating a 3D runtime into the existing React app |
| [web-3d-asset-pipeline](https://github.com/openai/plugins/blob/main/plugins/game-studio/skills/web-3d-asset-pipeline/SKILL.md) | Official OpenAI game-studio source; directory install count could not be verified | Blender cleanup, GLB export, compression, LOD, collision proxies, and runtime asset validation |

The CloudAI-X files are community reference guides, not official Three.js or pmndrs documentation. Their animation examples include standalone `requestAnimationFrame` loops; adapt the concepts to Fiber's existing `useFrame` loop instead of copying those scaffolds. Verify API details against the installed versions and primary documentation.

Documented install commands for the community shortlist, if selected for implementation:

```powershell
npx skills add https://github.com/CloudAI-X/threejs-skills --skill threejs-lighting
npx skills add https://github.com/CloudAI-X/threejs-skills --skill threejs-loaders
npx skills add https://github.com/CloudAI-X/threejs-skills --skill threejs-animation
```

The official game-studio skills are useful source references; installation through the available plugin distribution would need to be checked separately. No skills were installed for this research. The already available frontend-design skill remains appropriate for the HUD and menu art direction, while these guides address the 3D runtime and asset workflow.

## Proposed visual direction

These are design recommendations, not claims about ATLUS's rendering implementation:

- Human-scale anime campus with more natural character proportions and smoothly shaded hair/clothing.
- Strong cobalt and cyan interface; warmer stone, muted vegetation, and varied surfaces in the world.
- A lower third-person camera that gives buildings depth and makes the avatar a focal point.
- Cool sky fill, warm directional highlights, dark window recesses, and convincing contact shadows.
- Subtle emissive signage, water highlights, and blue-hour light pools. Bloom only bright emissive features, not the entire screen.
- Restrained foliage motion and water animation; keep motion reduction support.
- Original architecture and avatar details that connect the campus to Faiz's work.

Maintain three purposeful lighting states: day, blue hour, and the existing secret night mode. Tune each as a composition instead of only recoloring the same lights.

## Implementation order

1. **Establish a baseline.** Capture the same desktop and phone views in high/low quality. Record frame time, draw calls, geometry count, and texture memory while walking; current performance has not been profiled for this research.
2. **Build the arrival courtyard to completion.** Import a rigged avatar, detailed clock tower and facade modules, organic trees, and a richer floor. Solve material consistency and the lower camera together. Keep existing destination anchors and simple collision proxies initially.
3. **Stage lighting and finishing.** Add a local environment map, tune sky/key light balance, author static AO or baked lighting for architectural detail, retain dynamic player shadows, and test modest N8AO/bloom. Avoid heavy depth-of-field or motion blur during navigation.
4. **Optimize that finished scene.** Share materials, instance repeated props, compress assets, and choose separate desktop/mobile effect settings. Validate the avatar rig, shadow bounds, foliage transparency, DPR transitions, and renderer pause/resume.
5. **Expand the approved look across the campus.** Replace workshop/archive/observatory/harbor assets using the same kit and lighting language. Preserve Easter-egg anchors and attach interactions to explicit model nodes.
6. **Polish movement where needed.** Blend animation based on actual speed; handle camera obstacles. Evaluate Ecctrl/Rapier only if the new terrain and steps outgrow the existing flat-ground collision system.

Suggested file boundaries: `WorldCanvas` owns the renderer; separate `CampusEnvironment`, `CampusLighting`, `AvatarModel`, `CharacterAnimation`, `CameraRig`, and `WorldEffects` components; keep destination and secret logic in the current `lib/game` modules. Ship optimized files under `public/models`, `public/textures`, and `public/environments`; keep provenance in the asset ledger.

Proposed acceptance targets, to be measured rather than promised: approximately 60 FPS on the desktop reference device, at least 30 FPS on the selected phone, a responsive first content view while 3D assets load, and a compact initial world payload (start with a 5–10 MB compressed model/texture budget, excluding streamed soundtrack files). Revisit budgets after the first finished courtyard. Use the [Fiber performance guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) for reuse, instancing, LOD, progressive loading, and adaptive quality.

## Decision

The best return comes from the avatar, architecture, lighting, and camera together. A quick rendering pass offers a smaller visible improvement; authored models create the substantial quality jump the user is asking about. Complete one beautiful, playable area first, then carry that standard through the rest of the portfolio.
