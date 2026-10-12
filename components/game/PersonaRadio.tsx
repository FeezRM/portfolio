"use client";

import { useEffect, useRef, useState } from "react";
import {
  musicForLocation,
  personaTracks,
  type TrackId,
} from "@/lib/game/music";

type Playback = {
  data: { isPaused: boolean; isBuffering: boolean; playingURI: string };
};
type EmbedController = {
  loadEntity: (uri: string) => void;
  play: () => void;
  pause: () => void;
  destroy: () => void;
  addListener: (name: string, callback: (event: Playback) => void) => void;
};
type IFrameApi = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width: string; height: number },
    callback: (controller: EmbedController) => void,
  ) => void;
};
let apiPromise: Promise<IFrameApi> | null = null;

function loadSpotifyApi() {
  if (!apiPromise)
    apiPromise = new Promise<IFrameApi>((resolve, reject) => {
      const spotifyWindow = window as Window & {
        onSpotifyIframeApiReady?: (api: IFrameApi) => void;
      };
      const timeout = window.setTimeout(() => {
        apiPromise = null;
        reject(new Error("Radio unavailable"));
      }, 12000);
      spotifyWindow.onSpotifyIframeApiReady = (api) => {
        clearTimeout(timeout);
        resolve(api);
      };
      const script = document.createElement("script");
      script.src = "https://open.spotify.com/embed/iframe-api/v1";
      script.async = true;
      script.onerror = () => {
        clearTimeout(timeout);
        apiPromise = null;
        script.remove();
        reject(new Error("Radio unavailable"));
      };
      document.body.appendChild(script);
    });
  return apiPromise;
}

function RadioPlayer({ trackId }: { trackId: TrackId }) {
  const host = useRef<HTMLDivElement>(null),
    controller = useRef<EmbedController | null>(null),
    playing = useRef(false),
    initialTrack = useRef(trackId);
  const [status, setStatus] = useState<
    "loading" | "ready" | "playing" | "unavailable"
  >("loading");
  useEffect(() => {
    let cancelled = false;
    const element = document.createElement("div");
    host.current?.appendChild(element);
    void loadSpotifyApi()
      .then((api) => {
        if (cancelled) return;
        const track = personaTracks.find((t) => t.id === initialTrack.current)!;
        api.createController(
          element,
          {
            uri: `spotify:track:${track.spotifyId}`,
            width: "100%",
            height: 80,
          },
          (embed) => {
            if (cancelled) {
              embed.destroy();
              return;
            }
            controller.current = embed;
            if (initialTrack.current !== track.id) {
              const latest = personaTracks.find(
                (t) => t.id === initialTrack.current,
              )!;
              embed.loadEntity(`spotify:track:${latest.spotifyId}`);
            }
            embed.addListener("ready", () => {
              if (!cancelled) setStatus("ready");
            });
            embed.addListener("playback_update", (event) => {
              if (cancelled) return;
              playing.current = event.data.isPaused === false;
              setStatus(playing.current ? "playing" : "ready");
            });
          },
        );
      })
      .catch(() => {
        if (!cancelled) setStatus("unavailable");
      });
    const hide = () => {
      if (document.hidden) controller.current?.pause();
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", hide);
      controller.current?.destroy();
      controller.current = null;
      element.remove();
    };
  }, []);
  useEffect(() => {
    initialTrack.current = trackId;
    if (!controller.current) return;
    const track = personaTracks.find((t) => t.id === trackId)!;
    const continuePlaying = playing.current;
    controller.current.loadEntity(`spotify:track:${track.spotifyId}`);
    if (!continuePlaying) return;
    const timer = window.setTimeout(() => controller.current?.play(), 650);
    return () => clearTimeout(timer);
  }, [trackId]);
  const track = personaTracks.find((t) => t.id === trackId)!;
  return (
    <>
      <div className="spotify-host" ref={host} />
      <p className="radio-status" aria-live="polite">
        {status === "loading"
          ? "Tuning in…"
          : status === "unavailable"
            ? "Player unavailable. Open the track on Spotify below."
            : status === "playing"
              ? "PERSONA 3 RELOAD / OFFICIAL SOUNDTRACK"
              : "Press play in the player. Spotify may offer a preview."}
      </p>
      <a
        className="radio-external"
        href={`https://open.spotify.com/track/${track.spotifyId}`}
        target="_blank"
        rel="noreferrer"
      >
        Open on Spotify ↗
      </a>
    </>
  );
}

export function PersonaRadio({
  location,
  night,
}: {
  location: string;
  night: boolean;
}) {
  const [enabled, setEnabled] = useState(false),
    [followWorld, setFollowWorld] = useState(true),
    [selection, setSelection] = useState<TrackId>("night");
  const trackId = followWorld ? musicForLocation(location, night) : selection;
  return (
    <>
      <button
        className="radio-toggle"
        onClick={() => setEnabled((value) => !value)}
        aria-expanded={enabled}
        aria-controls="persona-radio"
      >
        MUSIC {enabled ? "ON" : "OFF"} <span>♫</span>
      </button>
      {enabled && (
        <aside
          id="persona-radio"
          className="persona-radio"
          aria-label="Persona soundtrack radio"
        >
          <header>
            <div>
              <span>FM 03 / PERSONA RADIO</span>
              <strong>
                {personaTracks.find((t) => t.id === trackId)!.mood}
              </strong>
            </div>
            <button
              onClick={() => setEnabled(false)}
              aria-label="Turn off Persona radio"
            >
              ×
            </button>
          </header>
          <label className="radio-follow">
            <input
              type="checkbox"
              checked={followWorld}
              onChange={(event) => setFollowWorld(event.target.checked)}
            />
            Follow the world
          </label>
          <label className="sr-only" htmlFor="persona-track">
            Choose a Persona soundtrack track
          </label>
          <select
            id="persona-track"
            value={trackId}
            onChange={(event) => {
              setSelection(event.target.value as TrackId);
              setFollowWorld(false);
            }}
          >
            {personaTracks.map((track) => (
              <option key={track.id} value={track.id}>
                {track.name}
              </option>
            ))}
          </select>
          <RadioPlayer trackId={trackId} />
        </aside>
      )}
    </>
  );
}
