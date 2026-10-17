import styles from "./ExperienceSwitch.module.css";

/** Full-document navigation isolates each experience's CSS, audio and rendering loop. */
export function ExperienceSwitch({ to }: { to: "classic" | "game" }) {
  return (
    <a
      className={`${styles.switch} ${to === "classic" ? styles.fromGame : styles.fromClassic}`}
      href={to === "classic" ? "/classic/" : "/game/"}
      aria-label={`Switch to ${to === "classic" ? "classic portfolio" : "game portfolio"}`}
    >
      <span aria-hidden="true">{to === "classic" ? "☷" : "◇"}</span>
      {to === "classic" ? "Classic site" : "Game mode"}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
