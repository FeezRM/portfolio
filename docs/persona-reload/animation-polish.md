# Sound, face and animation refinement

Interface effects now start enabled. Preference version 2 migrates the old saved off-by-default value once; subsequent explicit mute choices persist. Reset preferences also enables effects. Tones wait for AudioContext.resume() before scheduling their quiet envelopes, so the first permitted user interaction can produce sound.

The illustrated face uses a consistent eye line, matched glasses, a balanced jaw and subtler facial features. The GLB has a continuously shaped nose, surface-projected almond eyes and lips, a smoothly tapered jaw, and improved head/neck proportions. Facial hair stays on the face surface. The original glasses, earbuds, tee, chain, skeleton and Idle/Walk animations remain. The model is approximately 987 KB; the cache revision is likeness-2.

The menu remounts when the panel type changes, allowing its entrance to replay on Back. Rows reveal in sequence and the portrait slides into place. The overlay uses opacity/translation instead of a full-screen animated clip-path. Hover transforms remain independent of entry motion. Existing reduced-motion preferences disable these effects.

Fiber resets its clock when switching between always and demand rendering. WorldAnimation supplies a persistent simulation timeline that excludes paused frames and caps a stalled frame at 50 ms. Water, foliage, beacons, the sculpture, the Alchemy seal, dog and character all use that timeline. The character's mixer is updated explicitly with the bounded delta; player movement runs before the mixer to avoid a frame of lag. Menu and hidden-tab pauses preserve the current pose and phase.

Validation: 34 tests, ESLint, and the production build pass. Regression coverage includes pause/resume and clock restart, invalid/stalled frame deltas, sound migration and saved mute, and audio activation before oscillator scheduling. Browser QA verified menu → Projects → Back → menu, sound mute/reload/reset, walking, and high-quality world pause/resume. Observed high-quality diagnostics were approximately 75–99 FPS on the current browser/device, with no runtime errors; this is not a cross-device performance guarantee.
