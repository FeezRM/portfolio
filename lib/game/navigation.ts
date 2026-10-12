import type { Overlay } from "./world.ts";

export type Panel = { overlay: Overlay; project?: string };
export type PanelNavigation = { current: Panel; parents: Panel[] };
export const rootNavigation = (): PanelNavigation => ({
  current: { overlay: null },
  parents: [],
});

export function openPanel(
  navigation: PanelNavigation,
  next: Panel,
): PanelNavigation {
  if (!next.overlay) return rootNavigation();
  if (next.overlay === "menu") return { current: next, parents: [] };
  const parents =
    navigation.current.overlay && navigation.current.overlay !== next.overlay
      ? [...navigation.parents, navigation.current]
      : navigation.parents;
  return { current: next, parents };
}

export function backPanel(navigation: PanelNavigation): PanelNavigation {
  const previous = navigation.parents.at(-1);
  return previous
    ? { current: previous, parents: navigation.parents.slice(0, -1) }
    : rootNavigation();
}

// Browser Back can revisit a parent or open a direct URL outside this in-memory trail.
export function syncPanel(
  navigation: PanelNavigation,
  next: Panel,
): PanelNavigation {
  if (
    navigation.current.overlay === next.overlay &&
    navigation.current.project === next.project
  )
    return navigation;
  const index = navigation.parents.findLastIndex(
    (panel) => panel.overlay === next.overlay && panel.project === next.project,
  );
  return {
    current: next,
    parents: index >= 0 ? navigation.parents.slice(0, index) : [],
  };
}

export function panelHash(panel: Panel) {
  return panel.overlay
    ? `#${panel.overlay}${panel.project ? `/${panel.project}` : ""}`
    : "";
}
