# Coastal world and controls

Movement input captures key releases before focused controls can swallow them. Mouse/pen pointer presses, focused controls, window blur, page exit, visibility changes, paused panels, and effect cleanup clear held movement and momentum. The touch joystick accepts touch/pen input only; global pointer release/cancellation and capture loss reset its owning pointer. Mouse presses on the narrow-screen joystick do not start movement.

Panels retain a parent trail. Sections opened from the menu return there with Back or Escape; closing the menu returns to the world. Sections opened directly from the world or a URL close directly to the world. Project selection within one section does not add redundant panel levels. Menu/map/settings/journal URLs now also resolve through hash navigation; native browser navigation trims the in-memory trail to the revisited parent.

The ocean surrounds the whole campus. An irregular, beveled rock foundation descends below its surface, with a green verge and shore boulders beyond the paved campus. Remote neighborhoods, low wooded islets, a supported causeway, hills, an integrated-circuit landmark, and a clickable Hello World lighthouse add context around the island. These are original procedural assets; static geometry is batched by material and works at both graphics settings. The new secret does not change the original golden jacket requirements.

Validation: 29 Node tests cover existing gameplay/music/assets plus menu parent navigation, direct-link behavior, native history, interrupted movement, key release, paused controls, and cleanup. Browser checks cover Back/Escape, stationary avatar positions after repeated mouse clicks, narrow-screen mouse presses on the touch joystick, and the coastal scene.
