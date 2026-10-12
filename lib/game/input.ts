const movementKeys = new Set([
  "w",
  "a",
  "s",
  "d",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
]);
const editable = "input,textarea,select,[contenteditable=true]";

/** Capture key releases before a focused control can swallow them. */
export function bindMovementKeys(
  host: EventTarget,
  keys: Set<string>,
  enabled: () => boolean,
  onClear: () => void,
) {
  const clear = () => {
    keys.clear();
    onClear();
  };
  const down = (event: Event) => {
    const key = event as KeyboardEvent;
    if (
      !enabled() ||
      key.ctrlKey ||
      key.metaKey ||
      key.altKey ||
      (key.target as Element | null)?.closest?.(editable)
    )
      return;
    const normalized = key.key.toLowerCase();
    if (movementKeys.has(normalized)) {
      key.preventDefault();
      keys.add(normalized);
    }
  };
  const up = (event: Event) =>
    keys.delete((event as KeyboardEvent).key.toLowerCase());
  const pointer = (event: Event) => {
    if ((event as PointerEvent).pointerType !== "touch") clear();
  };
  const focus = (event: Event) => {
    if ((event.target as Element | null)?.closest?.(`button,a,${editable}`))
      clear();
  };
  const events = [
    ["keydown", down],
    ["keyup", up],
    ["pointerdown", pointer],
    ["focusin", focus],
    ["blur", clear],
    ["pagehide", clear],
  ] as const;
  const capture = { capture: true };
  events.forEach(([type, handler]) =>
    host.addEventListener(type, handler, capture),
  );
  return () => {
    events.forEach(([type, handler]) =>
      host.removeEventListener(type, handler, capture),
    );
    clear();
  };
}
