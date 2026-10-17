/** Inspect the shipped HTML/CSS, not source templates, after npm run build. */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve, join } from "node:path";

const output = resolve(import.meta.dirname, "../out");
const results = [];
for (const [route, experience] of [
  ["", "game"],
  ["game", "game"],
  ["classic", "classic"],
]) {
  const html = await readFile(join(output, route, "index.html"), "utf8");
  assert.match(
    html,
    new RegExp(`<body[^>]*data-experience="${experience}"`),
    `/${route} uses the wrong layout`,
  );
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map(([tag]) => ({
    rel: tag.match(/\brel="([^"]+)"/)?.[1],
    href: tag.match(/\bhref="([^"]+)"/)?.[1],
  }));
  const cssFiles = links
    .filter(
      (link) => link.rel === "stylesheet" && link.href?.startsWith("/_next/"),
    )
    .map((link) => link.href.split("?")[0]);
  assert.ok(cssFiles.length, "Stylesheets must be exported");
  const css = (
    await Promise.all(
      cssFiles.map((file) => readFile(join(output, file), "utf8")),
    )
  ).join("\n");
  if (experience === "game") {
    assert.ok(html.includes("EXPLORE MY WORLD"));
    assert.ok(html.includes('href="/classic/"'));
    assert.ok(css.includes(".experience-shell"), "Game theme missing");
    assert.ok(
      !css.includes(".hero-neural-field"),
      "Classic theme leaked into the game",
    );
  } else {
    for (const section of [
      "home",
      "stealth",
      "projects",
      "skills",
      "experience",
      "contact",
    ])
      assert.ok(
        html.includes(`id="${section}"`),
        `Classic section ${section} missing`,
      );
    assert.ok(html.includes('href="/game/"'));
    assert.ok(
      css.includes(".hero-neural-field"),
      "Original classic theme missing",
    );
    assert.ok(
      !css.includes(".experience-shell"),
      "Game theme leaked into classic",
    );
    assert.ok(
      !html.includes("soundtrack-widget"),
      "Game audio must not mount on classic",
    );
  }
  results.push({
    route: `/${route}${route ? "/" : ""}`,
    experience,
    stylesheets: cssFiles.length,
  });
}
const netlify = await readFile(
  resolve(import.meta.dirname, "../netlify.toml"),
  "utf8",
);
assert.match(
  netlify,
  /from\s*=\s*"\/"\s+to\s*=\s*"\/game\/"\s+status\s*=\s*302\s+force\s*=\s*true/,
  "Production homepage must default to the game",
);
console.table(results);
console.log(
  "Both experiences export correctly, switch in both directions, and load isolated themes. Game is the default.",
);
