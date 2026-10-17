# Two portfolios, one deployment

The game is the default homepage. The exported site includes:

- `/` — game entry, including existing hash links such as `/#projects` and `/#alchemy/studio`.
- `/game/` — explicit game URL with the same entry and saved game preferences.
- `/classic/` — original scrolling portfolio, restored from main at commit 4e8c164.

The game title screen and menu have a Classic site link. The classic navigation and footer have a Game mode link. Navigation replaces the document, which releases the old experience’s audio, animation loops and stylesheets. Game settings, position and discoveries keep their existing storage keys; visiting classic does not change them or the default homepage.

## Theme separation

Next.js route groups provide independent root layouts: `app/(game)/layout.tsx` and `app/(classic)/layout.tsx`. Each imports only its own global CSS and display font. The original classic sections still share the common portfolio data with the game. The game keeps Barlow Condensed, full-screen overflow rules and custom pointers; classic restores Syne, its scrollable page, mouse glow, original animations and styling. `ExperienceSwitch` uses ordinary anchors, not prefetched client navigation.

The static export uses trailing slashes so each route exports an `index.html` directory and works with the existing preview server and Netlify. The Netlify production root has a temporary redirect to `/game/`. Its target is the single deployment setting for choosing the homepage: change `to = "/game/"` to `to = "/classic/"` in `netlify.toml` and redeploy. Both direct URLs remain available. The exported root HTML is also the game, providing the same default on other static hosts.

## Validation

Run `npm test`, `npm run lint`, `npm run build`, and `npm run verify:experiences`. The export check inspects actual HTML and linked CSS for all three routes, restored classic section anchors, bidirectional links, correct production default, theme isolation and absence of the game audio UI on classic.

Framework reference: [Next.js multiple root layouts](https://nextjs.org/docs/app/api-reference/file-conventions/layout). Deployment reference: [Netlify redirects](https://docs.netlify.com/manage/routing/redirects/overview/).
