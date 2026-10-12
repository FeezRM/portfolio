# Blue Hour implementation

Implemented on `codex/persona-reload-portfolio` as an original Persona 3 Reload inspired portfolio.

## Run locally

Use Node.js 22.18+ (Node 24 recommended) for the TypeScript-aware built-in test runner.

```sh
npm ci
npm run dev
```

Production static export:

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Netlify continues to publish `out` using the existing configuration.

## Features

- Illustrated title screen with immediate projects, profile, contact, and resume access.
- Real WebGL 2 campus, articulated avatar, camera-relative walking, obstacle collision/sliding, and four individually interactive project exhibits.
- Six destinations, HUD minimap, proximity prompts, direct pointer interactions, and fast travel.
- Profile, projects, skills, experience, ContentSpy, contact, main menu, and settings panels.
- Visitor-local calendar, versioned local graphics/audio/motion/position preferences, blue-hour lighting, and optional original interface tones.
- Keyboard: WASD/arrows to walk, E/Enter to interact, M for map, Escape for menus/back.
- Pointer joystick on touch devices and narrow layouts; visible action buttons and complete browsing access.
- Static hash links, including `#projects/focusflow`; browser Back/Forward and existing section anchors are handled.
- Client-only deferred world loading, WebGL startup checks, error boundary/context-loss fallback, loading timeout, and retry.
- System reduced-motion preference, modal focus management, inert background, selectable HTML content, and no-script portfolio.
- Automatic reduction to low graphics after sustained slow frame rate; world rendering pauses behind menus and on hidden tabs. Memoized world prevents HUD position updates from rerendering the whole scene.
- Five persistent discoveries: waterfront dog, blue door, vending machine, calendar moon interaction, and arcade keyboard sequence. Field journal provides optional hints; finding all five unlocks a golden jacket.
- Persona radio streams three official soundtrack tracks through Spotify. Follow-world mode selects daytime, workshop/project, and night/harbor themes. Manual selection pins a track. The player remains mounted through portfolio navigation, pauses on hidden tabs, and is destroyed when switched off. Music is separate from synthesized interface sound.

## Asset approach

See [assets.md](assets.md). Geometry, the character illustration, shaders, exhibit visuals, and sounds are original and local. The campus deliberately uses a stylized procedural architecture kit and mesh rig, so it requires no external model, texture, or audio downloads. Google font files are fetched at build time and served by Next.js.

The research/build plan remains the design reference. This implementation uses an articulated code-based character, symbolic project illustrations, original interface tones, and an optional official Spotify soundtrack radio. The title screen always provides an intentional entry point rather than automatically starting a previously visited 3D session.

## Validation

Eleven focused Node tests cover camera-relative normalized movement, collision tunneling/sliding, world boundaries and safe travel anchors, exhibit proximity, hash parsing, local date rollover, arcade sequence recognition, discovery validation/uniqueness, reachable secret actions, soundtrack selection, and a waterfront camera regression that verifies the view clears the laboratory roof.

Browser verification covers desktop and phone layouts, walk-to-exhibit → E → case study, project switching, Back navigation, fast travel, menus, night/low-quality settings, and focus return. The phone joystick moved the minimap marker during an emulated pointer drag; physical touchscreen testing remains pending. The production static export returned HTTP 200 and rendered the campus with no browser console errors. Typecheck, lint, all eleven logic tests, and the production build passed. The radio's Spotify preview played successfully and switching from Color Your Night to Iwatodai Dorm updated the native player. The calendar and arcade Easter eggs unlocked, and the journal retained both discoveries after a reload.

Measured 60 fps across named physical target devices, cross-browser Safari/Firefox coverage, screen-reader auditing, and real unsupported-GPU/context-loss testing remain follow-up verification. These are not claimed as completed by the local browser preview.
