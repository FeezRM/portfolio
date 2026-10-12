/** Public-facing business content. Only verified details belong in this file. */
export const contentAlchemy = {
  name: "Content Alchemy",
  description:
    "Ideas become easier to act on when there is a system behind them.",
  contactHref: "mailto:faiz.kera@gmail.com?subject=Content%20Alchemy%20enquiry",
  // Public profile supplied by Faiz and verified on Instagram.
  instagramHref: "https://www.instagram.com/feezkera/" as string | null,
  instagramHandle: "@feezkera" as string | null,
  // The offer stays unset until Faiz provides the public package details.
  offer: null as {
    title: string;
    description: string;
    deliverables: string[];
    href: string;
    cta: string;
  } | null,
};

// Based on the user's four-stage content-system notes in “Content System Ideas”.
export const alchemyIngredients = [
  {
    id: "ideation",
    name: "Ideation",
    symbol: "◇",
    element: "THE SPARK",
    instruction:
      "Collect problems, hooks, stories, and formats in an idea bank. Choose one clear idea before writing.",
    prompt: "What is one problem your audience keeps running into?",
  },
  {
    id: "scripting",
    name: "Scripting",
    symbol: "✎",
    element: "THE BLUEPRINT",
    instruction:
      "Give the idea a shape: hook → context → useful takeaway → next action. A repeatable template removes the blank page.",
    prompt: "What should someone understand or do after watching?",
  },
  {
    id: "recording",
    name: "Recording",
    symbol: "◉",
    element: "THE VOICE",
    instruction:
      "Batch a few scripts in one session. Keep the setup ready and record one clean thought at a time.",
    prompt: "Which scripts can you record with the same setup?",
  },
  {
    id: "editing",
    name: "Editing",
    symbol: "✧",
    element: "THE REFINEMENT",
    instruction:
      "Reuse a clear editing style. Remove repetition, make captions readable, and let each cut support the idea.",
    prompt: "What can you remove without losing the meaning?",
  },
] as const;

export type IngredientId = (typeof alchemyIngredients)[number]["id"];
export type AlchemyTab = "studio" | "signal" | "offer";

export function advanceAlchemyRecipe(progress: number, ingredient: string) {
  const safeProgress =
    Number.isInteger(progress) &&
    progress >= 0 &&
    progress <= alchemyIngredients.length
      ? progress
      : 0;
  const expected = alchemyIngredients[safeProgress];
  if (!expected)
    return { progress: safeProgress, accepted: false, complete: true };
  const accepted = ingredient === expected.id;
  const next = accepted ? safeProgress + 1 : safeProgress;
  return {
    progress: next,
    accepted,
    complete: next === alchemyIngredients.length,
  };
}

export function creatorCodexText(topic = "your next idea") {
  const cleanTopic =
    topic.trim().replace(/\s+/g, " ").slice(0, 100) || "your next idea";
  return [
    `CONTENT ALCHEMY / CREATOR'S CODEX`,
    `Build a content system around: ${cleanTopic}`,
    "",
    ...alchemyIngredients.flatMap((ingredient, index) => [
      `${index + 1}. ${ingredient.name.toUpperCase()}`,
      ingredient.instruction,
      ingredient.prompt,
      "",
    ]),
    "Capture the idea. Give it a structure. Batch the recording. Reuse the edit.",
  ].join("\n");
}

export function isPublicInstagramHref(value: string | null) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      ["instagram.com", "www.instagram.com"].includes(url.hostname) &&
      /^\/[A-Za-z0-9_.]+\/?$/.test(url.pathname)
    );
  } catch {
    return false;
  }
}
