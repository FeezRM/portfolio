export const soundPreferenceVersion = 2;

export function restoreInterfaceSound(saved: unknown): boolean {
  if (!saved || typeof saved !== "object") return true;
  const preferences = saved as {
    sound?: unknown;
    soundPreferenceVersion?: unknown;
  };
  // Older sessions saved the former off-by-default value without an explicit choice.
  return preferences.soundPreferenceVersion === soundPreferenceVersion &&
    typeof preferences.sound === "boolean"
    ? preferences.sound
    : true;
}
