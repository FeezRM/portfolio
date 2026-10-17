"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent,
} from "react";
import { projects, experience } from "@/lib/data";
import {
  dateParts,
  destinations,
  isWalkable,
  parseHash,
  type Overlay,
  type Point,
  type Section,
  type nearestTarget,
} from "@/lib/game/world";
import { playTone } from "@/lib/game/audio";
import { ExperienceSwitch } from "@/components/ExperienceSwitch";
import {
  restoreInterfaceSound,
  soundPreferenceVersion,
} from "@/lib/game/preferences";
import {
  rootNavigation,
  openPanel,
  backPanel,
  syncPanel,
  panelHash,
} from "@/lib/game/navigation";
import { Portrait } from "./Portrait";
import { PortfolioPanel } from "./PortfolioPanel";
import { PersonaRadio } from "./PersonaRadio";
import { SecretJournal } from "./SecretJournal";
import { CreatorStudio } from "./CreatorStudio";
import type { AlchemyTab } from "@/lib/game/alchemy";
import {
  secrets,
  advanceSecretCode,
  restoreDiscoveries,
  addDiscovery,
  hasGoldenJacket,
  secretStorageKey,
  type SecretId,
} from "@/lib/game/secrets";

const WorldCanvas = dynamic(() => import("./WorldCanvas"), {
  ssr: false,
  loading: () => (
    <div className="world-loading">
      <span className="loading-orbit" />
      <p>FINDING YOUR BLUE HOUR</p>
      <small>Preparing the campus…</small>
    </div>
  ),
});
const settingsKey = "faiz-blue-hour-v1";
type Settings = {
  sound: boolean;
  soundPreferenceVersion: number;
  quality: "high" | "low";
  night: boolean;
  motion: boolean;
  mode: "entry" | "explore";
  position: Point;
};

class WorldBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Calendar({ onMoonTap }: { onMoonTap: () => void }) {
  const [date, setDate] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setDate(new Date());
    const start = window.setTimeout(tick, 0);
    const interval = window.setInterval(tick, 15000);
    window.addEventListener("focus", tick);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
      window.removeEventListener("focus", tick);
    };
  }, []);
  const parts = date ? dateParts(date) : null;
  return (
    <div className="calendar-hud">
      <div className="calendar-main">
        <time
          dateTime={date?.toISOString()}
          aria-label={
            date
              ? `${date.toLocaleDateString(undefined, { dateStyle: "full" })}, your local time`
              : "Loading local date"
          }
        >
          <b>{parts?.month ?? "—"}</b>
          <i>/</i>
          <b>{parts?.day ?? "—"}</b>
        </time>
        <span className="calendar-weekday">
          {parts?.weekday ?? "DAY"}
          <small>{parts?.year ?? ""}</small>
        </span>
      </div>
      <div className="calendar-sub">
        <span>{parts?.period ?? "Your local time"}</span>
        <button
          className="moon-icon"
          onClick={onMoonTap}
          aria-label="Inspect the calendar moon"
        >
          ◐
        </button>
      </div>
    </div>
  );
}

function MiniMap({
  position,
  onClick,
}: {
  position: Point;
  onClick: () => void;
}) {
  return (
    <button
      className="mini-map"
      onClick={onClick}
      aria-label="Open campus map and fast travel"
    >
      <svg viewBox="0 0 160 140" aria-hidden="true">
        <path d="M10 14H150V122H10Z" fill="#133572" stroke="#3c81b3" />
        <path d="M10 14H150V25H10Z" fill="#35f2ef" opacity=".6" />
        <path
          d="M20 31H79V51H20ZM17 62H33V92H17ZM129 62H145V92H129ZM114 32H141V50H114Z"
          fill="#5a97bd"
        />
        <path d="M78 26V122M20 57H143" stroke="#27749e" strokeWidth="5" />
        <circle cx="80" cy="76" r="7" fill="#164de1" stroke="#35f2ef" />
        {destinations.map((d) => (
          <circle
            key={d.id}
            cx={10 + (d.position.x + 20) * 3.5}
            cy={14 + (d.position.z + 20) * 3}
            r="2.5"
            fill={d.color}
          />
        ))}
        <circle
          cx={10 + (position.x + 20) * 3.5}
          cy={14 + (position.z + 20) * 3}
          r="5"
          fill="#fff"
          stroke="#163ceb"
          strokeWidth="2"
        />
      </svg>
      <span>
        CAMPUS MAP <b>↗</b>
      </span>
    </button>
  );
}

function TouchStick({ onMove }: { onMove: (point: Point) => void }) {
  const [knob, setKnob] = useState({ x: 0, z: 0 });
  const active = useRef<number | null>(null);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (active.current !== event.pointerId) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    let x = (event.clientX - bounds.left - bounds.width / 2) / 38,
      z = (event.clientY - bounds.top - bounds.height / 2) / 38;
    const length = Math.max(1, Math.hypot(x, z));
    x /= length;
    z /= length;
    onMove({ x, z });
    setKnob({ x, z });
  };
  const stop = useCallback(() => {
    active.current = null;
    onMove({ x: 0, z: 0 });
    setKnob({ x: 0, z: 0 });
  }, [onMove]);
  useEffect(() => {
    const release = (event: globalThis.PointerEvent) => {
      if (event.pointerId === active.current) stop();
    };
    window.addEventListener("blur", stop);
    window.addEventListener("pointerup", release, true);
    window.addEventListener("pointercancel", release, true);
    document.addEventListener("visibilitychange", stop);
    return () => {
      window.removeEventListener("blur", stop);
      window.removeEventListener("pointerup", release, true);
      window.removeEventListener("pointercancel", release, true);
      document.removeEventListener("visibilitychange", stop);
      onMove({ x: 0, z: 0 });
    };
  }, [onMove, stop]);
  return (
    <div
      className="touch-stick"
      role="group"
      aria-label="Touch movement joystick"
      onPointerDown={(event) => {
        if (event.pointerType === "mouse" || active.current !== null) return;
        event.preventDefault();
        event.stopPropagation();
        active.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        move(event);
      }}
      onPointerMove={move}
      onPointerUp={(event) => {
        event.stopPropagation();
        if (event.pointerId === active.current) stop();
      }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onPointerCancel={(event) => {
        if (event.pointerId === active.current) stop();
      }}
      onLostPointerCapture={(event) => {
        if (event.pointerId === active.current) stop();
      }}
    >
      <i
        style={{ transform: `translate(${knob.x * 32}px, ${knob.z * 32}px)` }}
      />
      <span>MOVE</span>
    </div>
  );
}

export function PortfolioExperience() {
  const [mode, setMode] = useState<"entry" | "explore">("entry"),
    [overlay, setOverlay] = useState<Overlay>(null),
    [projectId, setProjectId] = useState<string | undefined>();
  const [sound, setSound] = useState(true),
    [quality, setQuality] = useState<"high" | "low">("high"),
    [night, setNight] = useState(false),
    [motion, setMotion] = useState(false),
    [systemReduced, setSystemReduced] = useState(false);
  const [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [hidden, setHidden] = useState(false),
    [hydrated, setHydrated] = useState(false),
    [worldKey, setWorldKey] = useState(0);
  const [position, setPosition] = useState<Point>({ x: 0, z: 7 }),
    [travel, setTravel] = useState({ position: { x: 0, z: 7 }, serial: 0 }),
    [target, setTarget] = useState<ReturnType<typeof nearestTarget>>(null);
  const joystick = useRef<Point>({ x: 0, z: 0 }),
    mainRef = useRef<HTMLElement>(null),
    dialogRef = useRef<HTMLDivElement>(null),
    returnFocus = useRef<HTMLElement | null>(null),
    previousPosition = useRef<Point>({ x: 0, z: 7 });
  const panelNavigation = useRef(rootNavigation());
  const reducedMotion = motion || systemReduced;
  const [discovered, setDiscovered] = useState<SecretId[]>([]),
    [secretToast, setSecretToast] = useState<SecretId | null>(null);
  const discoveryRef = useRef<SecretId[]>([]),
    codeProgress = useRef({ index: 0, lastKey: 0 }),
    moonTaps = useRef({ count: 0, lastTap: 0 });
  const discover = useCallback(
    (id: SecretId) => {
      const next = addDiscovery(discoveryRef.current, id);
      discoveryRef.current = next;
      setDiscovered(next);
      setSecretToast(id);
      if (id === "dark-hour") setNight(true);
      try {
        localStorage.setItem(secretStorageKey, JSON.stringify(next));
      } catch {
        /* Discoveries work without storage. */
      }
      playTone("travel", sound);
    },
    [sound],
  );
  const inspectMoon = useCallback(() => {
    const now = performance.now();
    moonTaps.current.count =
      now - moonTaps.current.lastTap > 4000 ? 1 : moonTaps.current.count + 1;
    moonTaps.current.lastTap = now;
    if (moonTaps.current.count >= 7) {
      moonTaps.current.count = 0;
      discover("dark-hour");
    }
  }, [discover]);
  const resetDiscoveries = useCallback(() => {
    discoveryRef.current = [];
    setDiscovered([]);
    setSecretToast(null);
    try {
      localStorage.removeItem(secretStorageKey);
    } catch {
      /* Storage is optional. */
    }
  }, []);
  useEffect(() => {
    if (!secretToast) return;
    const timer = window.setTimeout(() => setSecretToast(null), 8000);
    return () => clearTimeout(timer);
  }, [secretToast]);

  const open = useCallback(
    (section: Overlay, project?: string) => {
      if (
        document.activeElement instanceof HTMLElement &&
        !dialogRef.current?.contains(document.activeElement)
      )
        returnFocus.current = document.activeElement;
      joystick.current = { x: 0, z: 0 };
      panelNavigation.current = openPanel(panelNavigation.current, {
        overlay: section,
        project,
      });
      setOverlay(section);
      setProjectId(project);
      playTone("open", sound);
      if (section) {
        const hash = panelHash({ overlay: section, project });
        if (location.hash !== hash) history.pushState(null, "", hash);
      }
    },
    [sound],
  );
  const handleSecret = useCallback(
    (id: SecretId) => {
      discover(id);
      if (id === "alchemy-lab") open("alchemy", "studio");
      else if (id === "creator-signal") open("alchemy", "signal");
      else if (id === "alchemy-offer") open("alchemy", "offer");
    },
    [discover, open],
  );
  const close = useCallback(() => {
    const next = backPanel(panelNavigation.current);
    panelNavigation.current = next;
    setOverlay(next.current.overlay);
    setProjectId(next.current.project);
    joystick.current = { x: 0, z: 0 };
    history.replaceState(
      null,
      "",
      location.pathname + location.search + panelHash(next.current),
    );
    if (!next.current.overlay)
      requestAnimationFrame(() => {
        if (returnFocus.current?.isConnected) returnFocus.current.focus();
        else mainRef.current?.focus();
      });
    playTone("select", sound);
  }, [sound]);
  const failure = useCallback(() => {
    setFailed(true);
    setReady(false);
  }, []);
  const worldReady = useCallback(() => {
    setReady(true);
    setFailed(false);
  }, []);
  const updatePosition = useCallback((next: Point) => {
    previousPosition.current = next;
    setPosition(next);
  }, []);
  const updateTarget = useCallback(
    (next: ReturnType<typeof nearestTarget>) => setTarget(next),
    [],
  );
  const updateJoystick = useCallback((next: Point) => {
    joystick.current = next;
  }, []);
  const lowerQuality = useCallback(() => setQuality("low"), []);

  const explore = useCallback(() => {
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2");
      if (!context) {
        setFailed(true);
        open("projects");
        return;
      }
      context.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      setFailed(true);
      open("projects");
      return;
    }
    setMode("explore");
    setReady(false);
    setFailed(false);
    setOverlay(null);
    panelNavigation.current = rootNavigation();
    setWorldKey((key) => key + 1);
    joystick.current = { x: 0, z: 0 };
    if (location.hash)
      history.pushState(null, "", location.pathname + location.search);
    requestAnimationFrame(() => mainRef.current?.focus());
    playTone("travel", sound);
  }, [open, sound]);

  const fastTravel = useCallback(
    (section: Section) => {
      const destination = destinations.find((d) => d.id === section)!;
      if (mode !== "explore" || failed) explore();
      setTravel((previous) => ({
        position: destination.position,
        serial: previous.serial + 1,
      }));
      setPosition(destination.position);
      previousPosition.current = destination.position;
      setTarget(null);
      setOverlay(null);
      panelNavigation.current = rootNavigation();
      joystick.current = { x: 0, z: 0 };
      if (location.hash)
        history.pushState(null, "", location.pathname + location.search);
      requestAnimationFrame(() => mainRef.current?.focus());
      playTone("travel", sound);
    },
    [mode, failed, explore, sound],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setSystemReduced(media.matches);
    const onHash = () => {
      const state = parseHash(location.hash);
      panelNavigation.current = syncPanel(panelNavigation.current, state);
      setOverlay(state.overlay);
      setProjectId(state.project);
      joystick.current = { x: 0, z: 0 };
    };
    const onVisibility = () => {
      setHidden(document.hidden);
      joystick.current = { x: 0, z: 0 };
    };
    const initialization = requestAnimationFrame(() => {
      onMotion();
      onHash();
      try {
        const found = restoreDiscoveries(
          JSON.parse(localStorage.getItem(secretStorageKey) ?? "[]"),
        );
        discoveryRef.current = found;
        setDiscovered(found);
        const saved = JSON.parse(
          localStorage.getItem(settingsKey) ?? "null",
        ) as Partial<Settings> | null;
        if (saved) {
          setSound(restoreInterfaceSound(saved));
          setQuality(saved.quality === "low" ? "low" : "high");
          setNight(saved.night === true);
          setMotion(saved.motion === true);
          if (
            saved.position &&
            Number.isFinite(saved.position.x) &&
            Number.isFinite(saved.position.z) &&
            isWalkable(saved.position)
          ) {
            previousPosition.current = saved.position;
            setPosition(saved.position);
            setTravel({ position: saved.position, serial: 1 });
          }
        } else if (window.matchMedia("(pointer: coarse)").matches)
          setQuality("low");
      } catch {
        /* Private browsing or malformed preferences use defaults. */
      }
      setHydrated(true);
    });
    media.addEventListener("change", onMotion);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(initialization);
      media.removeEventListener("change", onMotion);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onHash);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const save = () => {
      try {
        localStorage.setItem(
          settingsKey,
          JSON.stringify({
            sound,
            soundPreferenceVersion,
            quality,
            night,
            motion,
            mode,
            position: previousPosition.current,
          }),
        );
      } catch {
        /* Preferences are optional. */
      }
    };
    save();
    window.addEventListener("pagehide", save);
    const interval = window.setInterval(save, 5000);
    return () => {
      window.removeEventListener("pagehide", save);
      clearInterval(interval);
    };
  }, [sound, quality, night, motion, mode, hydrated]);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      if (e.key === "Escape") {
        e.preventDefault();
        if (overlay) close();
        else open("menu");
      }
      if (
        e.target instanceof HTMLElement &&
        e.target.matches("input,textarea,select,[contenteditable=true]")
      )
        return;
      if (!overlay) {
        const now = performance.now();
        const previous =
          now - codeProgress.current.lastKey > 5000
            ? 0
            : codeProgress.current.index;
        const result = advanceSecretCode(previous, e.key);
        codeProgress.current = { index: result.index, lastKey: now };
        if (result.complete) discover("arcade-code");
      }
      if (mode === "explore" && !overlay && e.key.toLowerCase() === "m") {
        e.preventDefault();
        open("map");
      }
      if (overlay && e.key === "Tab") {
        const elements = Array.from(
          dialogRef.current
            ?.closest(".experience-ui")
            ?.querySelectorAll<HTMLElement>(
              'button:not(:disabled),a[href],input,select,iframe,[tabindex="0"]',
            ) ?? [],
        ).filter((element) => element.getClientRects().length > 0);
        if (!elements?.length) return;
        const first = elements[0],
          last = elements[elements.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === dialogRef.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [overlay, mode, open, close, discover]);

  useEffect(() => {
    if (overlay) {
      joystick.current = { x: 0, z: 0 };
      dialogRef.current?.focus();
    }
  }, [overlay]);
  useEffect(() => {
    if (mode !== "explore" || ready || failed) return;
    const timeout = window.setTimeout(failure, 20000);
    return () => clearTimeout(timeout);
  }, [mode, ready, failed, failure]);

  const currentLocation = destinations.reduce(
    (closest, d) =>
      Math.hypot(d.position.x - position.x, d.position.z - position.z) <
      Math.hypot(
        closest.position.x - position.x,
        closest.position.z - position.z,
      )
        ? d
        : closest,
    destinations[0],
  );
  const title =
    overlay === "menu"
      ? "Your next chapter."
      : overlay === "map"
        ? "Go somewhere."
        : overlay === "journal"
          ? "The untold stories."
          : overlay === "alchemy"
            ? "The hidden studio."
            : overlay === "settings"
              ? "Make it yours."
              : (destinations.find((d) => d.id === overlay)?.title ?? "");

  return (
    <main
      ref={mainRef}
      tabIndex={-1}
      className={`experience-shell ${mode === "explore" ? "is-exploring" : "is-entry"} ${overlay ? "has-overlay" : ""} ${reducedMotion ? "reduce-motion" : ""} ${night ? "is-night" : ""}`}
    >
      <div className="experience-background" inert={!!overlay}>
        {mode === "explore" && !failed ? (
          <div className="world-layer">
            <WorldBoundary key={`world-${worldKey}`} onFailure={failure}>
              <WorldCanvas
                paused={!!overlay || hidden}
                night={night}
                reducedMotion={reducedMotion}
                quality={quality}
                travel={travel}
                joystick={joystick}
                onReady={worldReady}
                onPosition={updatePosition}
                onTarget={updateTarget}
                onOpen={open}
                onFailure={failure}
                onPerformanceDrop={lowerQuality}
                onSecret={handleSecret}
                golden={hasGoldenJacket(discovered)}
              />
            </WorldBoundary>
            {travel.serial > 0 && (
              <div
                key={`travel-${travel.serial}`}
                className="travel-flash"
                aria-hidden="true"
              />
            )}
            {!ready && (
              <div className="world-loading">
                <span className="loading-orbit" />
                <p>FINDING YOUR BLUE HOUR</p>
                <small>Preparing the campus…</small>
                <button onClick={() => open("projects")}>
                  Browse while you wait ↗
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="entry-art" aria-hidden="true">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-water" />
            <div className="art-moon" />
            <span className="art-word">BLUE</span>
            <div className="portrait-outline">
              <Portrait />
            </div>
            <Portrait className="entry-portrait" />
            <div className="art-shards">
              <i />
              <i />
              <i />
              <i />
            </div>
            <span className="art-coordinate">
              43° N / AN OPEN WORLD OF IDEAS
            </span>
          </div>
        )}
        <div className="screen-vignette" aria-hidden="true" />
        <header className="game-header">
          <a
            className="identity"
            href="#home"
            onClick={(event) => {
              event.preventDefault();
              if (mode === "explore") open("profile");
              else close();
            }}
          >
            <span className="identity-mark">
              F<span>K</span>
            </span>
            <span>
              FAIZ KERAWALA<small>AI & SOFTWARE ENGINEER</small>
            </span>
          </a>
          <button className="menu-toggle" onClick={() => open("menu")}>
            <span>MENU</span>
            <i />
            <i />
          </button>
        </header>
        <Calendar onMoonTap={inspectMoon} />
        {mode === "entry" || failed ? (
          <section className="entry-copy">
            <p className="entry-kicker">
              <span /> WELCOME TO MY LITTLE CORNER OF THE WORLD
            </p>
            <h1>
              Life&apos;s short.
              <br />
              Build <em>something</em>
              <br />
              <span className="outlined-word">that matters.</span>
            </h1>
            <p className="entry-description">
              I&apos;m Faiz. I turn ideas into useful AI and software.
              <br />
              Come take a walk through what I&apos;m building.
            </p>
            <div className="entry-actions">
              <button className="primary-button" onClick={explore}>
                EXPLORE MY WORLD <span>↗</span>
              </button>
              <button
                className="browse-button"
                onClick={() => open("projects")}
              >
                Or, get straight to the work <span>→</span>
              </button>
            </div>
            {failed && (
              <p className="fallback-message" role="status">
                The 3D world couldn&apos;t start on this device. Every project
                is available in Browse mode.{" "}
                <button onClick={explore}>Retry 3D</button>
              </p>
            )}
            <nav className="entry-links" aria-label="Quick portfolio links">
              <ExperienceSwitch to="classic" />
              <button onClick={() => open("profile")}>ABOUT ME</button>
              <a href="/resume.md" download="Faiz-Kerawala-Resume.md">
                RESUME <span>↓</span>
              </a>
              <button onClick={() => open("contact")}>
                LET&apos;S TALK <span>↗</span>
              </button>
            </nav>
          </section>
        ) : (
          <>
            <div className="location-hud">
              <MiniMap position={position} onClick={() => open("map")} />
              <p>
                <span>PORTFOLIO ISLAND</span>
                {currentLocation.name}
              </p>
            </div>
            {target && ready && (
              <button
                className="interaction-prompt"
                onClick={() => {
                  if (target.secret) handleSecret(target.secret);
                  else if (target.section) open(target.section, target.project);
                }}
              >
                <kbd>E</kbd>
                <span>
                  {target.secret
                    ? target.label.toUpperCase()
                    : `VIEW ${target.label.toUpperCase()}`}
                </span>
                <b>↗</b>
              </button>
            )}
            <div className="world-instructions">
              <p>
                <kbd>W</kbd>
                <kbd>A</kbd>
                <kbd>S</kbd>
                <kbd>D</kbd> MOVE <span>·</span>
                <kbd>M</kbd> MAP <span>·</span>
                <kbd>ESC</kbd> MENU
              </p>
              <span>Take your time. There&apos;s a lot to discover.</span>
            </div>
            {ready && !overlay && <TouchStick onMove={updateJoystick} />}
          </>
        )}
        <footer className="game-footer">
          <span className="footer-chapter">
            01 <i />{" "}
            {mode === "entry"
              ? "THE BEGINNING OF SOMETHING"
              : "A WORLD OF POSSIBILITIES"}
          </span>
          <div>
            <button
              onClick={() => {
                setSound((value) => !value);
                playTone("select", !sound);
              }}
              aria-label={
                sound ? "Mute interface sounds" : "Enable interface sounds"
              }
            >
              SOUND {sound ? "ON" : "OFF"}
              <span>{sound ? "◖))" : "◖×"}</span>
            </button>
            <button
              onClick={() => open("settings")}
              aria-label="Open experience settings"
            >
              ⚙
            </button>
          </div>
        </footer>
      </div>

      <div
        className="experience-ui"
        role={overlay ? "dialog" : undefined}
        aria-modal={overlay ? true : undefined}
        aria-labelledby={overlay ? "panel-title" : undefined}
      >
        {overlay && (
          <div key={overlay} className={`overlay-layer overlay-${overlay}`}>
            <div className="overlay-water" aria-hidden="true" />
            <div className="overlay-diagonal" aria-hidden="true" />
            <span className="overlay-ghost" aria-hidden="true">
              {overlay === "stealth" ? "SIGNAL" : overlay.toUpperCase()}
            </span>
            <div
              ref={dialogRef}
              tabIndex={-1}
              className={`portfolio-dialog ${overlay === "menu" ? "main-menu-dialog" : ""}`}
            >
              <header className="panel-header">
                <div>
                  <p>FAIZ KERAWALA / THE PORTFOLIO</p>
                  <h2 id="panel-title">{title}</h2>
                </div>
                <button
                  className="close-button"
                  onClick={close}
                  aria-label="Close panel"
                >
                  <span>BACK</span> ×
                </button>
              </header>
              {overlay === "menu" ? (
                <div className="main-menu">
                  <div className="main-menu-list">
                    {destinations.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => open(d.id)}
                        onPointerEnter={() => playTone("select", sound)}
                      >
                        <span>{d.number}</span>
                        <strong>{d.title}</strong>
                        <i>↗</i>
                      </button>
                    ))}
                    <div className="menu-secondary">
                      <ExperienceSwitch to="classic" />
                      <button onClick={() => open("map")}>CAMPUS MAP ↗</button>
                      <button onClick={() => open("settings")}>
                        SETTINGS ↗
                      </button>
                      <button onClick={() => open("journal")}>
                        FIELD JOURNAL {discovered.length}/{secrets.length} ↗
                      </button>
                      {discovered.includes("alchemy-lab") && (
                        <button onClick={() => open("alchemy", "studio")}>
                          CONTENT ALCHEMY ↗
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="menu-portrait">
                    <span>
                      KEEP
                      <br />
                      CREATING.
                    </span>
                    <Portrait />
                  </div>
                </div>
              ) : (
                <div className="panel-body">
                  {overlay === "journal" ? (
                    <SecretJournal
                      discovered={discovered}
                      onReset={resetDiscoveries}
                      onOpenAlchemy={(tab) => {
                        discover("alchemy-lab");
                        open("alchemy", tab);
                      }}
                    />
                  ) : overlay === "alchemy" ? (
                    <CreatorStudio
                      tab={
                        (["studio", "signal", "offer"].includes(projectId || "")
                          ? projectId
                          : "studio") as AlchemyTab
                      }
                      discovered={discovered}
                      onDiscover={discover}
                      onTab={(tab) => open("alchemy", tab)}
                    />
                  ) : overlay === "settings" ? (
                    <div className="settings-view">
                      <p className="panel-eyebrow">YOUR WORLD, YOUR WAY</p>
                      <label>
                        <span>
                          <strong>Interface sound</strong>
                          <small>Original, gentle navigation tones.</small>
                        </span>
                        <input
                          type="checkbox"
                          checked={sound}
                          onChange={(e) => {
                            setSound(e.target.checked);
                            playTone("select", e.target.checked);
                          }}
                        />
                      </label>
                      <label>
                        <span>
                          <strong>Blue hour</strong>
                          <small>
                            Moonlit lighting for a different atmosphere.
                          </small>
                        </span>
                        <input
                          type="checkbox"
                          checked={night}
                          onChange={(e) => setNight(e.target.checked)}
                        />
                      </label>
                      <label>
                        <span>
                          <strong>Reduce motion</strong>
                          <small>
                            {systemReduced
                              ? "Your device already requests reduced motion."
                              : "Instant camera follow and quieter transitions."}
                          </small>
                        </span>
                        <input
                          type="checkbox"
                          checked={reducedMotion}
                          disabled={systemReduced}
                          onChange={(e) => setMotion(e.target.checked)}
                        />
                      </label>
                      <label>
                        <span>
                          <strong>Graphics quality</strong>
                          <small>
                            Low uses less GPU power and disables shadows.
                          </small>
                        </span>
                        <select
                          value={quality}
                          onChange={(e) =>
                            setQuality(e.target.value as "high" | "low")
                          }
                        >
                          <option value="high">High</option>
                          <option value="low">Low</option>
                        </select>
                      </label>
                      <div className="panel-actions">
                        <button
                          className="ink-button"
                          onClick={() => {
                            setMode("entry");
                            panelNavigation.current = rootNavigation();
                            close();
                          }}
                        >
                          Return to title <span>↗</span>
                        </button>
                        <button
                          className="text-button"
                          onClick={() => {
                            setSound(true);
                            setNight(false);
                            setMotion(false);
                            setQuality("high");
                            setTravel((t) => ({
                              position: { x: 0, z: 7 },
                              serial: t.serial + 1,
                            }));
                            previousPosition.current = { x: 0, z: 7 };
                            setPosition({ x: 0, z: 7 });
                          }}
                        >
                          Reset preferences
                        </button>
                      </div>
                    </div>
                  ) : (
                    <PortfolioPanel
                      section={overlay}
                      projectId={projectId}
                      onProject={(id) => open("projects", id)}
                      onOpen={open}
                      onTravel={fastTravel}
                    />
                  )}
                </div>
              )}
              <footer className="panel-footer">
                <span>BLUE HOUR / THE WORLD OF FAIZ</span>
                <button onClick={close}>
                  <kbd>ESC</kbd> RETURN
                </button>
              </footer>
            </div>
          </div>
        )}
        {secretToast && (
          <div className="secret-toast" role="status" aria-live="polite">
            <span className="secret-toast-symbol" aria-hidden="true">
              {secrets.find((secret) => secret.id === secretToast)!.symbol}
            </span>
            <div>
              <span>
                HIDDEN STORY / {discovered.length} OF {secrets.length}
              </span>
              <strong>
                {secrets.find((secret) => secret.id === secretToast)!.title}
              </strong>
              <p>
                {secrets.find((secret) => secret.id === secretToast)!.message}
              </p>
              <button
                onClick={() => {
                  setSecretToast(null);
                  open("journal");
                }}
              >
                Open field journal ↗
              </button>
            </div>
            <button
              onClick={() => setSecretToast(null)}
              aria-label="Dismiss discovery"
            >
              ×
            </button>
          </div>
        )}
        <PersonaRadio
          location={mode === "entry" ? "contact" : currentLocation.id}
          night={night}
        />
      </div>
      <noscript>
        <section className="no-script-portfolio">
          <h1>Faiz Kerawala</h1>
          <p>
            AI Engineer and Software Engineer. Ontario Tech University, Computer
            Science Honours Co-op.
          </p>
          <h2>Projects</h2>
          {projects.map((p) => (
            <article key={p.id}>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <p>{p.impact}</p>
              <a href={p.githubUrl}>View repository</a>
            </article>
          ))}
          <h2>Experience</h2>
          {experience.map((e) => (
            <article key={e.id}>
              <h3>
                {e.company} — {e.role}
              </h3>
              <p>{e.period}</p>
              {e.bullets.map((b) => (
                <p key={b}>{b}</p>
              ))}
            </article>
          ))}
          <p>
            <a href="https://contentspy.me">ContentSpy — launching soon</a>
          </p>
          <a href="mailto:faiz.kera@gmail.com">Email Faiz</a>
          <p>
            <a href="/resume.md">Resume (Markdown)</a>
          </p>
        </section>
      </noscript>
    </main>
  );
}
