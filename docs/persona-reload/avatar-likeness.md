# Faiz's avatar likeness

Reference sources: the two photos supplied by Faiz, stills viewed from the authorized Desktop/Raw Vid footage, and the public Instagram profile `https://www.instagram.com/feezkera/`. Raw photos and videos are reference material only and are not bundled in the site.

The original rigged GLB now uses a warm skin palette, a slimmer jaw, fuller tousled hair with shorter sides, dark browline glasses with thin silver lower rims and clear lenses, a mustache/goatee, white earbuds, a dark crew-neck tee and silver chain. The vector entry/menu portrait uses the same identifying details. All are original authored geometry/vector artwork, with the existing Idle/Walk rig and gold outfit reward retained.

The model remains below the existing 1.2 MiB asset budget. The hair is batched into two material meshes; facial hair is painted into the curved face surface. The runtime URL includes a likeness revision so cached older models cannot replace the new character. Tests verify animation/skeleton integrity, normalized skin weights, head attachment of glasses/earbuds/facial hair, and translucent lenses.

The public Instagram handle activates the studio Signal tab, its external profile link, and the hidden phone discovery. Offer/pricing content remains unset.

For model review, run `node scripts/preview-avatar.mjs` after a production build and open `/avatar-review/index.html` in the local preview. Front, face, three-quarter, Walk and gold outfit controls display the actual shipped model. Run `node scripts/preview-avatar.mjs --clean` before exporting/publishing the build; the review page and copied vendor files are development artifacts.
