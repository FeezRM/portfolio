/** Public-facing summary of Faiz's offer and positioning notes. See content-alchemy.md for sources. */
type AlchemyOffer = {
  title: string;
  description: string;
  deliverables: string[];
  href: string;
  cta: string;
};

export const contentAlchemy = {
  name: "Content Alchemy",
  description:
    "I help online coaches and consultants build their personal brand with short-form content, then connect that content to a system for qualified leads and enquiries.",
  audience: "FOR ONLINE COACHES & CONSULTANTS",
  approach:
    "Strategy, production, and conversion — built around your expertise, your audience, and the offer you sell.",
  contactHref: "mailto:faiz.kera@gmail.com?subject=Content%20Alchemy%20enquiry",
  // Public profile supplied by Faiz and verified on Instagram.
  instagramHref: "https://www.instagram.com/feezkera/" as string | null,
  instagramHandle: "@feezkera" as string | null,
  // Main agency offer + public application CTA, read in Notion on 2026-10-13.
  offer: {
    title: "Your content engine, built with you.",
    description:
      "A done-for-you content service for coaches and consultants who want a stronger personal brand and a clearer path from attention to enquiries. You bring the expertise and record. I build the strategy, support the production, and connect the content to your offer.",
    deliverables: [
      "Content strategy tailored to your audience, positioning, and offer.",
      "Short-form scripts, premium reel editing, and discoverability optimization.",
      "Reusable Instagram Stories and CTA sequences that lead into a conversation.",
      "ManyChat automations, lead qualification, and an Instagram lead funnel.",
      "Monthly performance reporting with changes for the next round of content.",
      "Biweekly strategy calls and a shared workspace for your content system.",
    ],
    href: "https://forms.gle/c9E6yqiZsb129GaF9",
    cta: "Apply to work together",
  } as AlchemyOffer | null,
};

export const alchemyPillars = [
  {
    number: "01",
    symbol: "◇",
    name: "The master plan",
    category: "STRATEGY",
    description:
      "Find the audience, sharpen the positioning, and plan content around the offer. Every post has a job to do.",
  },
  {
    number: "02",
    symbol: "◉",
    name: "The content machine",
    category: "PRODUCTION",
    description:
      "Turn your expertise into ideas, scripts, and polished short-form videos. A repeatable workflow keeps the process moving.",
  },
  {
    number: "03",
    symbol: "↗",
    name: "The lead engine",
    category: "CONVERSION",
    description:
      "Connect reels and Stories to calls to action, DM automations, and lead qualification. Give interested viewers a clear next step.",
  },
] as const;

export const alchemyProjects = [
  {
    name: "Alchemist OS",
    label: "THE WORKSPACE",
    description:
      "My Notion workspace for ideas, scripts, production, and content planning — the foundation behind the content system.",
  },
  {
    name: "Content Alchemy",
    label: "IN DEVELOPMENT",
    description:
      "The bigger platform I’m building: Alchemist OS, the Content Blueprint, coaching, resources, and a creator community in one place.",
  },
  {
    name: "ContentSpy",
    label: "BUILDING THE PRODUCT",
    description:
      "AI content intelligence for creator research and planning. A place where my software work and content business come together.",
  },
] as const;

// The core production stages are shared by Alchemist OS and Content Blueprint.
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
