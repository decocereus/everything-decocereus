"use client";

import Image from "next/image";
import Link from "next/link";
import type { ChangeEvent, CSSProperties, MouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PORTFOLIO_MUSIC } from "@/lib/constants.ts";
import styles from "./interest-popover.module.css";

const PLAYER_STATES = {
  ended: 0,
  playing: 1,
} as const;

interface PlayerEvent {
  data: number;
  target: YouTubePlayer;
}

interface YouTubePlayer {
  cueVideoById: (videoId: string) => void;
  destroy: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getIframe: () => HTMLIFrameElement;
  loadVideoById: (videoId: string) => void;
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
}

interface YouTubeNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      events: {
        onError: (event: PlayerEvent) => void;
        onReady: (event: PlayerEvent) => void;
        onStateChange: (event: PlayerEvent) => void;
      };
      height: number;
      host: "https://www.youtube-nocookie.com";
      playerVars: {
        controls: 0;
        origin: string;
        playsinline: 1;
        rel: 0;
      };
      videoId: string;
      width: number;
    }
  ) => YouTubePlayer;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: YouTubeNamespace;
  }
}

let youtubeApiPromise: Promise<YouTubeNamespace> | undefined;

function loadYouTubeApi() {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      if (window.YT) {
        resolve(window.YT);
      }
    };

    if (
      !document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      )
    ) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.append(script);
    }
  });

  return youtubeApiPromise;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function queueState(isActive: boolean, isPlaying: boolean) {
  if (!isActive) {
    return "";
  }

  return isPlaying ? "•••" : "•";
}

function PreviousIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="M5.5 4.5v11M15 5.3 8.2 10l6.8 4.7V5.3Z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="M14.5 4.5v11M5 5.3l6.8 4.7L5 14.7V5.3Z" />
    </svg>
  );
}

function PlayIcon({ playing }: { playing: boolean }) {
  if (playing) {
    return (
      <svg aria-hidden="true" viewBox="0 0 20 20">
        <path d="M6.5 5.2h2.2v9.6H6.5zM11.3 5.2h2.2v9.6h-2.2z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="m7.2 5 7.3 5-7.3 5V5Z" />
    </svg>
  );
}

export function MusicPlayer() {
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasRequestedPlayback, setHasRequestedPlayback] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [playerError, setPlayerError] = useState<number | null>(null);
  const activeTrack = PORTFOLIO_MUSIC[activeIndex];

  const syncTime = useCallback(() => {
    const player = playerRef.current as YouTubePlayer;

    setCurrentTime(player.getCurrentTime());
    setDuration(player.getDuration());
  }, []);

  const selectTrack = useCallback(
    (nextIndex: number, shouldPlay = isPlaying) => {
      const normalizedIndex =
        (nextIndex + PORTFOLIO_MUSIC.length) % PORTFOLIO_MUSIC.length;
      const nextTrack = PORTFOLIO_MUSIC[normalizedIndex];
      activeIndexRef.current = normalizedIndex;
      setActiveIndex(normalizedIndex);
      setCurrentTime(0);
      setDuration(0);
      setPlayerError(null);

      if (!isReady) {
        return;
      }

      const player = playerRef.current as YouTubePlayer;

      if (shouldPlay) {
        setHasRequestedPlayback(true);
        player.loadVideoById(nextTrack.videoId);
      } else {
        player.cueVideoById(nextTrack.videoId);
      }
    },
    [isPlaying, isReady]
  );

  useEffect(() => {
    const host = playerHostRef.current as HTMLDivElement;

    let cancelled = false;

    loadYouTubeApi().then((youtube) => {
      if (cancelled) {
        return;
      }

      playerRef.current = new youtube.Player(host, {
        events: {
          onError: ({ data }) => {
            setPlayerError(data);
            setIsPlaying(false);
          },
          onReady: ({ target }) => {
            const iframe = target.getIframe();
            iframe.setAttribute("aria-hidden", "true");
            iframe.tabIndex = -1;
            setIsReady(true);
          },
          onStateChange: ({ data }) => {
            setIsPlaying(data === PLAYER_STATES.playing);
            syncTime();

            if (data === PLAYER_STATES.ended) {
              const nextIndex =
                (activeIndexRef.current + 1) % PORTFOLIO_MUSIC.length;
              activeIndexRef.current = nextIndex;
              setActiveIndex(nextIndex);
              setCurrentTime(0);
              playerRef.current?.loadVideoById(
                PORTFOLIO_MUSIC[nextIndex].videoId
              );
            }
          },
        },
        height: 200,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          controls: 0,
          origin: window.location.origin,
          playsinline: 1,
          rel: 0,
        },
        videoId: PORTFOLIO_MUSIC[0].videoId,
        width: 200,
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [syncTime]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = window.setInterval(syncTime, 500);
    return () => window.clearInterval(timer);
  }, [isPlaying, syncTime]);

  const handleSeek = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const nextTime = Number(event.currentTarget.value);
    setCurrentTime(nextTime);
    (playerRef.current as YouTubePlayer).seekTo(nextTime, true);
  }, []);

  const togglePlayback = useCallback(() => {
    setHasRequestedPlayback(true);

    if (!isReady || playerError !== null) {
      return;
    }

    const player = playerRef.current as YouTubePlayer;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [isPlaying, isReady, playerError]);

  const playPrevious = useCallback(() => {
    selectTrack(activeIndex - 1);
  }, [activeIndex, selectTrack]);

  const playNext = useCallback(() => {
    selectTrack(activeIndex + 1);
  }, [activeIndex, selectTrack]);

  const playQueuedTrack = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      selectTrack(Number(event.currentTarget.dataset.trackIndex), true);
    },
    [selectTrack]
  );

  return (
    <div className={styles.musicExperience}>
      <div className={styles.hiddenPlayer} ref={playerHostRef} />
      <section
        aria-label={`Now playing ${activeTrack.title} by ${activeTrack.artist}`}
        className={styles.musicPlayer}
        data-playing={isPlaying ? "true" : "false"}
      >
        <div className={styles.record}>
          <Image
            alt=""
            aria-hidden="true"
            className={styles.recordArtwork}
            height={120}
            sizes="72px"
            src={`https://i.ytimg.com/vi/${activeTrack.videoId}/hqdefault.jpg`}
            unoptimized
            width={120}
          />
          <span aria-hidden="true" className={styles.recordLabel} />
        </div>

        <div className={styles.playerBody}>
          <div className={styles.nowPlayingCopy}>
            <strong title={activeTrack.title}>{activeTrack.title}</strong>
            <span>{activeTrack.artist}</span>
          </div>

          <label className={styles.progressControl}>
            <span className={styles.srOnly}>
              Seek through {activeTrack.title}
            </span>
            <input
              aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
              disabled={!isReady || duration === 0}
              max={duration || 1}
              min="0"
              onChange={handleSeek}
              step="0.1"
              style={
                {
                  "--player-progress": `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                } as CSSProperties
              }
              type="range"
              value={Math.min(currentTime, duration || 1)}
            />
          </label>
          <div className={styles.timeRow}>
            <span>{formatTime(currentTime)}</span>
            <span>{duration > 0 ? formatTime(duration) : "–:––"}</span>
          </div>
        </div>

        <div className={styles.playerControls}>
          <button
            aria-label="Previous track"
            className={styles.skipButton}
            disabled={!isReady}
            onClick={playPrevious}
            type="button"
          >
            <PreviousIcon />
          </button>
          <button
            aria-label={isPlaying ? "Pause" : `Play ${activeTrack.title}`}
            className={styles.playButton}
            disabled={!isReady}
            onClick={togglePlayback}
            type="button"
          >
            <PlayIcon playing={isPlaying} />
          </button>
          <button
            aria-label="Next track"
            className={styles.skipButton}
            disabled={!isReady}
            onClick={playNext}
            type="button"
          >
            <NextIcon />
          </button>
        </div>
      </section>

      {playerError === null || !hasRequestedPlayback ? null : (
        <p className={styles.playerError} role="status">
          YouTube would not play this one here.{" "}
          <Link href={activeTrack.href} rel="noreferrer" target="_blank">
            Open it in YouTube Music ↗
          </Link>
        </p>
      )}

      <ol aria-label="Music queue" className={styles.musicQueue}>
        {PORTFOLIO_MUSIC.map((track, index) => (
          <li key={track.videoId}>
            <button
              aria-current={index === activeIndex ? "true" : undefined}
              data-track-index={index}
              disabled={!isReady}
              onClick={playQueuedTrack}
              type="button"
            >
              <span aria-hidden="true" className={styles.trackNumber}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={styles.trackCopy}>
                <strong>{track.title}</strong>
                <span className={styles.trackArtist}>{track.artist}</span>
              </span>
              <span aria-hidden="true" className={styles.queueState}>
                {queueState(index === activeIndex, isPlaying)}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
