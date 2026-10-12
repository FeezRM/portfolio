import { secrets, type SecretId } from "./secrets.ts";

export type Section =
  | "profile"
  | "projects"
  | "skills"
  | "experience"
  | "stealth"
  | "contact";
export type Overlay =
  | Section
  | "menu"
  | "map"
  | "settings"
  | "journal"
  | "alchemy"
  | null;
export type Point = { x: number; z: number };
export type Obstacle = { x: number; z: number; width: number; depth: number };

export const destinations: {
  id: Section;
  name: string;
  title: string;
  number: string;
  position: Point;
  color: string;
}[] = [
  {
    id: "profile",
    name: "Arrival court",
    title: "Profile",
    number: "01",
    position: { x: 0, z: 7 },
    color: "#35f2ef",
  },
  {
    id: "projects",
    name: "Project laboratory",
    title: "Projects",
    number: "02",
    position: { x: -5, z: -3 },
    color: "#35f2ef",
  },
  {
    id: "skills",
    name: "The workshop",
    title: "Skills",
    number: "03",
    position: { x: -13, z: 3 },
    color: "#f8e66a",
  },
  {
    id: "experience",
    name: "The archive",
    title: "Experience",
    number: "04",
    position: { x: 13, z: 2 },
    color: "#b7c5ff",
  },
  {
    id: "stealth",
    name: "Signal observatory",
    title: "ContentSpy",
    number: "05",
    position: { x: 12, z: -11 },
    color: "#ff8bb4",
  },
  {
    id: "contact",
    name: "Harbor terrace",
    title: "Contact",
    number: "06",
    position: { x: 0, z: -18 },
    color: "#35f2ef",
  },
];

export const exhibits = [
  {
    id: "focusflow",
    name: "FocusFlow",
    position: { x: -7, z: -5 },
    color: "#35f2ef",
  },
  {
    id: "shortform-editor",
    name: "AI video editor",
    position: { x: -3, z: -5 },
    color: "#f8e66a",
  },
  {
    id: "soulsync",
    name: "SoulSync",
    position: { x: 1, z: -5 },
    color: "#ff8bb4",
  },
  {
    id: "research-agent",
    name: "Research agent",
    position: { x: 5, z: -5 },
    color: "#a9bbff",
  },
];

export const trees = [
  [-11, 7],
  [11, 7],
  [-10, -17],
  [7, -17],
  [-10, 12],
  [13, 12],
  [-12, -7],
];
export const benches = [
  [-7, 11],
  [8, 11],
  [-4, -18],
  [4, -18],
];
export const planters = [-12, 10];

export const obstacles: Obstacle[] = [
  { x: -3, z: -13, width: 15, depth: 5 },
  { x: -17, z: 0, width: 4, depth: 10 },
  { x: 17, z: 0, width: 4, depth: 10 },
  { x: 13, z: -15, width: 7, depth: 4 },
  { x: 0, z: 1, width: 4, depth: 4 },
  { x: -4.6, z: 7, width: 3.4, depth: 0.4 },
  ...exhibits.map((e) => ({ ...e.position, width: 1.2, depth: 1.2 })),
  ...trees.map(([x, z]) => ({ x, z, width: 1.3, depth: 1.3 })),
  ...benches.map(([x, z]) => ({ x, z, width: 2, depth: 0.6 })),
  ...planters.map((x) => ({ x, z: 9, width: 4, depth: 1.8 })),
  { x: -13.5, z: -8.5, width: 1.5, depth: 0.55 },
  { x: 12.5, z: 8.5, width: 1.1, depth: 0.8 },
  { x: -16, z: 8, width: 2, depth: 0.9 },
];

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function isWalkable(point: Point, radius = 0.32) {
  return (
    point.x >= -19 + radius &&
    point.x <= 19 - radius &&
    point.z >= -20 + radius &&
    point.z <= 16 - radius &&
    !obstacles.some(
      (o) =>
        Math.abs(point.x - o.x) < o.width / 2 + radius &&
        Math.abs(point.z - o.z) < o.depth / 2 + radius,
    )
  );
}

// Small substeps prevent crossing thin exhibit colliders; independent axes allow wall sliding.
export function movePlayer(position: Point, dx: number, dz: number): Point {
  const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.15));
  let x = position.x,
    z = position.z;
  for (let i = 0; i < steps; i++) {
    if (isWalkable({ x: x + dx / steps, z })) x += dx / steps;
    if (isWalkable({ x, z: z + dz / steps })) z += dz / steps;
  }
  return { x, z };
}

export function cameraOffset(position: Point) {
  const t = clamp((-position.z - 9) / 5, 0, 1);
  const north = t * t * (3 - 2 * t);
  const e = clamp((position.x - 8) / 6, 0, 1);
  const east = e * e * (3 - 2 * e);
  // Frame the avatar at human scale; look from the plaza side near the archive.
  // At the waterfront, orbit over the water and look back toward the campus.
  // The mid-orbit lift clears rooftops without leaving the final view overhead.
  return {
    x: (6.3 - east * 11) * (1 - north) + 5.8 * north,
    y: 5.8 + north * 0.5 + Math.sin(north * Math.PI) * 6,
    z: (9.8 - east * 4.4) * (1 - north) - 9.2 * north,
  };
}

export function movementVector(
  horizontal: number,
  vertical: number,
  cameraX = 9,
  cameraZ = 13,
) {
  const length = Math.max(1, Math.hypot(horizontal, vertical));
  const cameraLength = Math.hypot(cameraX, cameraZ) || 1;
  // Screen-relative controls follow the actual camera heading, including harbor framing.
  return {
    x: (horizontal * cameraZ + vertical * cameraX) / cameraLength / length,
    z: (-horizontal * cameraX + vertical * cameraZ) / cameraLength / length,
  };
}

function visible(from: Point, to: Point) {
  // Endpoints may be the centers of exhibits; sample the path before the target's surface.
  const distance = Math.hypot(to.x - from.x, to.z - from.z);
  const steps = Math.max(1, Math.ceil(Math.max(0, distance - 0.8) / 0.15));
  for (let i = 1; i <= steps; i++) {
    const t = (i / steps) * Math.max(0, (distance - 0.8) / distance);
    if (
      !isWalkable(
        { x: from.x + (to.x - from.x) * t, z: from.z + (to.z - from.z) * t },
        0,
      )
    )
      return false;
  }
  return true;
}

export function nearestTarget(position: Point): {
  section: Section | null;
  project?: string;
  secret?: SecretId;
  label: string;
} | null {
  const targets: {
    position: Point;
    section: Section | null;
    project?: string;
    secret?: SecretId;
    label: string;
  }[] = [
    ...exhibits.map((e) => ({
      position: e.position,
      section: "projects" as Section,
      project: e.id,
      label: e.name,
    })),
    ...destinations
      .filter((d) => d.id !== "projects")
      .map((d) => ({
        position: d.position,
        section: d.id,
        project: undefined,
        label: d.title,
      })),
    ...secrets.flatMap((secret) =>
      "position" in secret
        ? [
            {
              position: secret.position,
              section: null,
              secret: secret.id,
              label: secret.action,
            },
          ]
        : [],
    ),
  ];
  targets.sort(
    (a, b) =>
      Math.hypot(a.position.x - position.x, a.position.z - position.z) -
      Math.hypot(b.position.x - position.x, b.position.z - position.z),
  );
  const target = targets.find(
    (t) =>
      Math.hypot(t.position.x - position.x, t.position.z - position.z) < 2.6 &&
      visible(position, t.position),
  );
  return target
    ? target.secret
      ? { section: null, secret: target.secret, label: target.label }
      : {
          section: target.section,
          project: target.project,
          label: target.label,
        }
    : null;
}

export function parseHash(hash: string): {
  overlay: Overlay;
  project?: string;
} {
  const [section, project] = hash.replace(/^#\/?/, "").split("/");
  if (section === "home" || !section) return { overlay: null };
  if (section === "alchemy")
    return {
      overlay: "alchemy",
      project: ["studio", "signal", "offer"].includes(project)
        ? project
        : "studio",
    };
  if (destinations.some((d) => d.id === section))
    return {
      overlay: section as Section,
      project: exhibits.some((e) => e.id === project) ? project : undefined,
    };
  return { overlay: null };
}

export function dateParts(date: Date) {
  return {
    month: String(date.getMonth() + 1).padStart(2, "0"),
    day: String(date.getDate()).padStart(2, "0"),
    weekday: new Intl.DateTimeFormat("en", { weekday: "short" })
      .format(date)
      .toUpperCase(),
    year: date.getFullYear(),
    period:
      date.getHours() < 12
        ? "Morning"
        : date.getHours() < 18
          ? "Afternoon"
          : "Evening",
  };
}
