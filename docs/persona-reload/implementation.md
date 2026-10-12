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
- Native background audio player with ten playlist slots across Persona 3 Reload, Persona 4, and Persona 5. Playback starts quietly after a visitor interaction, and controls can be hidden without stopping it. Available recordings queue automatically; missing files are skipped. Full-duration seek, previous/next, game collections, browser media controls, and persistent mute/volume are supported. Supplied public files are indexed before dev/build; personal imports persist locally in IndexedDB without uploading.

## Asset approach

See [assets.md](assets.md). Geometry, the character illustration, shaders, exhibit visuals, and sounds are original and local. The campus deliberately uses a stylized procedural architecture kit and mesh rig, so it requires no external model, texture, or audio downloads. Google font files are fetched at build time and served by Next.js.

The research/build plan remains the design reference. This implementation uses an articulated code-based character, symbolic project illustrations, original interface tones, and an native soundtrack player using supplied audio files. The title screen always provides an intentional entry point rather than automatically starting a previously visited 3D session.

## Validation

Sixteen focused Node tests cover camera-relative normalized movement, collision tunneling/sliding, world boundaries and safe travel anchors, exhibit proximity, hash parsing, local date rollover, arcade sequence recognition, discovery validation/uniqueness, reachable secret actions, soundtrack selection/queue wrapping and validated audio preferences, and a waterfront camera regression that verifies the view clears the laboratory roof.

Browser verification covers desktop and phone layouts, walk-to-exhibit → E → case study, project switching, Back navigation, fast travel, menus, night/low-quality settings, and focus return. The phone joystick moved the minimap marker during an emulated pointer drag; physical touchscreen testing remains pending. The production static export returned HTTP 200 and rendered the campus with no browser console errors. Typecheck, lint, all sixteen logic tests, and the production build passed. The previous Spotify/YouTube player has been replaced by native audio; validation is recorded below. The calendar and arcade Easter eggs unlocked, and the journal retained both discoveries after a reload.

Measured 60 fps across named physical target devices, cross-browser Safari/Firefox coverage, screen-reader auditing, and real unsupported-GPU/context-loss testing remain follow-up verification. These are not claimed as completed by the local browser preview.

The native audio engine is tested with original synthetic WAV fixtures rather than commercial recordings. Validation includes playlist filtering/wrapping, title-to-file matching, rejecting invalid manifests, safe audio preferences, and full-duration time formatting. The three provided MP3 recordings are now included in the static export. Browser validation confirmed full durations (Color Your Night 3:47, Beneath the Mask Rain 4:40, No More What Ifs 4:00), native seeking to the end followed by automatic advance, 15% volume, mute, and uninterrupted playback while controls were hidden and projects opened. Personal test files were removed from browser storage after QA. Byte-range playback returned HTTP 206 with audio/mpeg. Persona 4 audio files are still needed to activate that part of the catalog.
