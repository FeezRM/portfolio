"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  audioExtension,
  defaultMusicVolume,
  formatMusicTime,
  identifyTrack,
  musicForLocation,
  musicPreferenceKey,
  nextAvailableTrack,
  personaTracks,
  restoreBundledSources,
  restoreMusicPreferences,
  tracksForStation,
  type Station,
  type TrackId,
  type TrackSources,
} from "@/lib/game/music";
import {
  readPersonalTracks,
  writePersonalTracks,
  type PersonalTrack,
} from "@/lib/game/music-library";

type Status = "idle" | "loading" | "playing" | "paused" | "blocked" | "error";

export function PersonaRadio({
  location,
  night,
}: {
  location: string;
  night: boolean;
}) {
  const [trackId, setTrackId] = useState<TrackId>(() =>
    musicForLocation(location, night),
  );
  const [station, setStation] = useState<Station>("mix");
  const [sources, setSources] = useState<TrackSources>({});
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState(defaultMusicVolume);
  const [muted, setMuted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [notice, setNotice] = useState("");
  const [personalCount, setPersonalCount] = useState(0);
  const audio = useRef<HTMLAudioElement>(null);
  const files = useRef<HTMLInputElement>(null);
  const wanted = useRef(false);
  const bundled = useRef<TrackSources>({});
  const personalUrls = useRef<TrackSources>({});
  const track = personaTracks.find((item) => item.id === trackId)!;
  const source = sources[trackId];
  const available = useMemo(
    () =>
      personaTracks.filter((item) => sources[item.id]).map((item) => item.id),
    [sources],
  );
  const queue = tracksForStation(station);

  const attemptPlay = useCallback(() => {
    const element = audio.current;
    if (!element?.getAttribute("src")) return;
    if (!element.paused) {
      setStatus("playing");
      return;
    }
    const currentSource = element.src;
    setStatus("loading");
    void element.play().catch((error: DOMException) => {
      if (error.name === "AbortError" || element.src !== currentSource) return;
      setStatus(error.name === "NotAllowedError" ? "blocked" : "error");
    });
  }, []);

  const installPersonal = useCallback((records: PersonalTrack[]) => {
    for (const record of records) {
      const previous = personalUrls.current[record.id];
      if (previous) URL.revokeObjectURL(previous);
      personalUrls.current[record.id] = URL.createObjectURL(record.file);
    }
    const updated = { ...bundled.current, ...personalUrls.current };
    setSources(updated);
    setPersonalCount(Object.keys(personalUrls.current).length);
    setTrackId((current) =>
      updated[current]
        ? current
        : (personaTracks.find((item) => updated[item.id])?.id ?? current),
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const preferenceFrame = requestAnimationFrame(() => {
      try {
        const saved = restoreMusicPreferences(
          JSON.parse(localStorage.getItem(musicPreferenceKey) ?? "null"),
        );
        if (!cancelled) {
          setVolume(saved.volume);
          setMuted(saved.muted);
        }
      } catch {
        /* Quiet defaults work when storage is disabled. */
      }
    });
    void Promise.all([
      fetch("/music/library.json", { signal: controller.signal })
        .then((response) => (response.ok ? response.json() : null))
        .catch(() => null),
      readPersonalTracks().catch(() => []),
    ]).then(([manifest, records]) => {
      if (cancelled) return;
      bundled.current = restoreBundledSources(manifest);
      installPersonal(records);
    });
    return () => {
      cancelled = true;
      controller.abort();
      cancelAnimationFrame(preferenceFrame);
      Object.values(personalUrls.current).forEach((url) =>
        URL.revokeObjectURL(url),
      );
      personalUrls.current = {};
    };
  }, [installPersonal]);

  useEffect(() => {
    const element = audio.current;
    if (!element) return;
    element.volume = volume / 100;
    element.muted = muted;
  }, [volume, muted]);

  useEffect(() => {
    const element = audio.current;
    if (!element) return;
    // One audio element survives location changes, menus, and collapsed controls.
    element.load();
    if (source && wanted.current) attemptPlay();
    return () => element.pause();
  }, [source, attemptPlay]);

  useEffect(() => {
    const start = (event: Event) => {
      if (
        event instanceof KeyboardEvent &&
        (event.repeat ||
          event.ctrlKey ||
          event.metaKey ||
          event.altKey ||
          !["Enter", " "].includes(event.key))
      )
        return;
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      if (
        event.target instanceof HTMLElement &&
        event.target.closest(".soundtrack-widget")
      )
        return;
      wanted.current = true;
      attemptPlay();
    };
    window.addEventListener("pointerdown", start);
    window.addEventListener("keydown", start);
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
  }, [attemptPlay]);

  useEffect(() => {
    if (status !== "loading") return;
    const timeout = window.setTimeout(() => setStatus("error"), 20000);
    return () => clearTimeout(timeout);
  }, [status, source]);

  const chooseTrack = useCallback(
    (id: TrackId) => {
      wanted.current = true;
      setNotice("");
      if (id === trackId) {
        if (audio.current) audio.current.currentTime = 0;
        attemptPlay();
      } else {
        setTrackId(id);
        setStatus("loading");
      }
    },
    [trackId, attemptPlay],
  );

  const advance = useCallback(
    (direction = 1) => {
      const next = nextAvailableTrack(trackId, station, available, direction);
      if (next) chooseTrack(next);
    },
    [trackId, station, available, chooseTrack],
  );

  useEffect(() => {
    if (
      !("mediaSession" in navigator) ||
      typeof MediaMetadata === "undefined" ||
      !source
    )
      return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.name,
      artist: track.artist,
      album: track.edition,
    });
    const actions = {
      play: () => {
        wanted.current = true;
        attemptPlay();
      },
      pause: () => {
        wanted.current = false;
        audio.current?.pause();
      },
      previoustrack: () => advance(-1),
      nexttrack: () => advance(),
    };
    for (const [action, handler] of Object.entries(actions)) {
      try {
        navigator.mediaSession.setActionHandler(
          action as MediaSessionAction,
          handler,
        );
      } catch {
        /* Optional browser support. */
      }
    }
    return () => {
      navigator.mediaSession.metadata = null;
      for (const action of Object.keys(actions)) {
        try {
          navigator.mediaSession.setActionHandler(
            action as MediaSessionAction,
            null,
          );
        } catch {
          /* Optional browser support. */
        }
      }
    };
  }, [source, track.name, track.artist, track.edition, advance, attemptPlay]);

  const savePreferences = (nextVolume: number, nextMuted: boolean) => {
    try {
      localStorage.setItem(
        musicPreferenceKey,
        JSON.stringify({ volume: nextVolume, muted: nextMuted }),
      );
    } catch {
      /* Optional preference. */
    }
  };
  const toggleMute = () => {
    setMuted(!muted);
    savePreferences(volume, !muted);
  };
  const togglePlayback = () => {
    if (status === "playing" || status === "loading") {
      wanted.current = false;
      audio.current?.pause();
    } else {
      wanted.current = true;
      attemptPlay();
    }
  };
  const importFiles = async (selected: FileList | null) => {
    if (!selected?.length) return;
    const records: PersonalTrack[] = [];
    let unmatched = 0;
    for (const file of Array.from(selected)) {
      if (!audioExtension.test(file.name)) {
        unmatched++;
        continue;
      }
      const id =
        identifyTrack(file.name) ?? (selected.length === 1 ? trackId : null);
      if (id) records.push({ id, file, name: file.name });
      else unmatched++;
    }
    if (!records.length) {
      setNotice(
        "Choose one song and add its file, or use filenames containing the song titles.",
      );
      return;
    }
    wanted.current = true;
    installPersonal(records);
    setNotice(
      `${records.length} ${records.length === 1 ? "song added" : "songs added"}.${unmatched ? ` ${unmatched} unmatched; add those one at a time.` : ""}`,
    );
    try {
      await writePersonalTracks(records);
    } catch {
      setNotice(
        "Songs are ready for this visit. This browser couldn't save the files for next time.",
      );
    }
    if (files.current) files.current.value = "";
  };
  const clearPersonal = async () => {
    wanted.current = false;
    audio.current?.pause();
    Object.values(personalUrls.current).forEach((url) =>
      URL.revokeObjectURL(url),
    );
    personalUrls.current = {};
    setPersonalCount(0);
    setSources({ ...bundled.current });
    setTrackId((current) =>
      bundled.current[current]
        ? current
        : (personaTracks.find((item) => bundled.current[item.id])?.id ??
          current),
    );
    setNotice("Personal songs removed from this device.");
    try {
      await writePersonalTracks(null);
    } catch {
      setNotice(
        "Songs cleared for this visit. Browser storage couldn't be cleared.",
      );
    }
  };
  const label = !available.length
    ? "MUSIC OFF"
    : muted || volume === 0
      ? "MUSIC MUTED"
      : status === "playing"
        ? "MUSIC ON"
        : "MUSIC PAUSED";

  return (
    <div
      className={`soundtrack-widget ${status === "playing" && !muted && volume > 0 ? "is-playing" : ""}`}
    >
      <audio
        ref={audio}
        src={source}
        preload="metadata"
        aria-hidden="true"
        onPlaying={() => setStatus("playing")}
        onPause={() => setStatus("paused")}
        onWaiting={() => setStatus("loading")}
        onError={() => setStatus("error")}
        onEnded={() => advance()}
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration);
          setElapsed(0);
        }}
        onEmptied={() => {
          setElapsed(0);
          setDuration(0);
        }}
        onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)}
      />
      <div className="radio-mini">
        <button
          className="radio-toggle"
          onClick={() => {
            setExpanded((value) => !value);
            if (source && status === "idle") {
              wanted.current = true;
              attemptPlay();
            }
          }}
          aria-expanded={expanded}
          aria-controls="persona-radio"
        >
          {label} <span>♫</span>
        </button>
        {!!available.length && (
          <button
            className="radio-quick-mute"
            onClick={toggleMute}
            aria-label={
              muted ? "Quick unmute soundtrack" : "Quick mute soundtrack"
            }
          >
            {muted ? "◖×" : "◖))"}
          </button>
        )}
      </div>
      <input
        ref={files}
        type="file"
        className="sr-only"
        accept=".mp3,.ogg,.m4a,.aac,.wav,.flac"
        multiple
        aria-label="Choose your soundtrack audio files"
        onChange={(event) => void importFiles(event.target.files)}
      />
      {expanded && (
        <aside
          id="persona-radio"
          className={`persona-radio station-${track.game}`}
          aria-label="Persona soundtrack radio"
        >
          <header>
            <span>FM 03 / THE PERSONA MIX</span>
            <button
              onClick={() => setExpanded(false)}
              aria-label="Hide soundtrack controls"
            >
              −
            </button>
          </header>
          <div className="radio-now-playing">
            <div className="radio-disc" aria-hidden="true">
              <i />
            </div>
            <div>
              <span className="radio-game">{track.edition}</span>
              <h3>{track.name}</h3>
              <p>{track.artist}</p>
            </div>
            <div className="radio-bars" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="radio-seek">
            <input
              type="range"
              min="0"
              max={Number.isFinite(duration) ? duration : 0}
              step="0.1"
              value={Math.min(
                elapsed,
                Number.isFinite(duration) ? duration : 0,
              )}
              disabled={!duration || !source}
              aria-label="Soundtrack position"
              onChange={(event) => {
                const time = Number(event.target.value);
                if (audio.current) audio.current.currentTime = time;
                setElapsed(time);
              }}
            />
            <div>
              <time>{formatMusicTime(elapsed)}</time>
              <span>
                {available.length
                  ? `${available.length} TRACKS / FULL LENGTH`
                  : "YOUR SOUNDTRACK"}
              </span>
              <time>{formatMusicTime(duration)}</time>
            </div>
          </div>
          <div className="radio-transport">
            <button
              disabled={!available.length}
              onClick={() => advance(-1)}
              aria-label="Previous soundtrack track"
            >
              ↤
            </button>
            <button
              className="radio-play"
              disabled={!source}
              onClick={togglePlayback}
              aria-label={
                status === "playing" || status === "loading"
                  ? "Pause soundtrack"
                  : "Play soundtrack"
              }
            >
              {status === "playing" || status === "loading"
                ? "Ⅱ PAUSE"
                : "▶ PLAY"}
            </button>
            <button
              disabled={!available.length}
              onClick={() => advance()}
              aria-label="Next soundtrack track"
            >
              ↦
            </button>
            <button
              className="radio-mute"
              onClick={toggleMute}
              aria-label={muted ? "Unmute soundtrack" : "Mute soundtrack"}
              aria-pressed={muted}
            >
              {muted ? "UNMUTE" : "MUTE"}
            </button>
          </div>
          <label className="radio-volume">
            VOLUME{" "}
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={volume}
              onChange={(event) => {
                const value = Number(event.target.value);
                setVolume(value);
                setMuted(false);
                savePreferences(value, false);
              }}
              aria-label="Soundtrack volume"
            />
            <output>{volume}%</output>
          </label>
          <div
            className="radio-stations"
            role="group"
            aria-label="Choose a soundtrack collection"
          >
            {(["mix", "3", "4", "5"] as const).map((item) => (
              <button
                key={item}
                aria-pressed={station === item}
                onClick={() => {
                  setStation(item);
                  if (
                    !tracksForStation(item).some(
                      (song) => song.id === trackId && sources[song.id],
                    )
                  ) {
                    const first = nextAvailableTrack(trackId, item, available);
                    if (first) chooseTrack(first);
                    else {
                      audio.current?.pause();
                      wanted.current = false;
                      setTrackId(tracksForStation(item)[0].id);
                      setStatus("idle");
                    }
                  }
                }}
              >
                {item === "mix" ? "ALL" : `P${item}`}
              </button>
            ))}
          </div>
          <label className="sr-only" htmlFor="persona-track">
            Choose a Persona soundtrack track
          </label>
          <select
            id="persona-track"
            value={trackId}
            onChange={(event) => {
              const id = event.target.value as TrackId;
              if (sources[id]) chooseTrack(id);
              else {
                audio.current?.pause();
                wanted.current = false;
                setTrackId(id);
              }
            }}
          >
            {queue.map((item) => (
              <option key={item.id} value={item.id}>
                P{item.game} / {item.name}
                {!sources[item.id] ? " · add audio" : ""}
              </option>
            ))}
          </select>
          <p className="radio-status" aria-live="polite">
            {notice ||
              (!source
                ? "Add your audio files to make this mix your own."
                : status === "error"
                  ? "This file couldn't play. Try another track or replace it."
                  : status === "blocked"
                    ? "Press Play to start your soundtrack."
                    : status === "loading"
                      ? "Tuning in…"
                      : status === "playing"
                        ? "Keep exploring. The music stays with you."
                        : "Ready whenever you are.")}
          </p>
          <div className="radio-files">
            <button onClick={() => files.current?.click()}>＋ ADD AUDIO</button>
            {personalCount > 0 && (
              <button onClick={() => void clearPersonal()}>
                CLEAR PERSONAL FILES
              </button>
            )}
          </div>
          <p className="radio-privacy">Your added files stay on this device.</p>
        </aside>
      )}
    </div>
  );
}
