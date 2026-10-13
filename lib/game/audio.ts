// Original synthesized UI tones. No third-party recordings or soundtrack assets.
let context: AudioContext | null = null;
export async function playTone(
  kind: "select" | "open" | "travel",
  enabled: boolean,
) {
  if (!enabled) return;
  try {
    context ??= new AudioContext();
    await context.resume();
    const audio = context;
    const now = audio.currentTime;
    const frequencies =
      kind === "travel"
        ? [392, 523.25, 783.99]
        : kind === "open"
          ? [523.25, 659.25]
          : [880];
    frequencies.forEach((frequency, index) => {
      const oscillator = audio.createOscillator(),
        gain = audio.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, now + index * 0.055);
      gain.gain.linearRampToValueAtTime(0.035, now + index * 0.055 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.055 + 0.22);
      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start(now + index * 0.055);
      oscillator.stop(now + index * 0.055 + 0.25);
    });
  } catch {
    /* Sound is optional; unavailable audio never blocks navigation. */
  }
}
