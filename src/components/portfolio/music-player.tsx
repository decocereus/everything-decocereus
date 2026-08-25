"use client";

import Image from "next/image";
import Link from "next/link";
import type { ChangeEvent, CSSProperties, ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PORTFOLIO_MUSIC } from "@/lib/constants.ts";
import styles from "./music-player.module.css";

const PLAYER_STATES = {
  cued: 5,
  playing: 1,
} as const;

const PLAYLIST_VIDEO_IDS = PORTFOLIO_MUSIC.map((track) => track.videoId);

interface PlayerEvent {
  data: number;
  target: YouTubePlayer;
}

interface YouTubePlayer {
  cuePlaylist: (
    playlist: string[],
    index?: number,
    startSeconds?: number
  ) => void;
  destroy: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getIframe: () => HTMLIFrameElement;
  getPlaylistIndex: () => number;
  pauseVideo: () => void;
  playVideo: () => void;
  playVideoAt: (index: number) => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setLoop: (loopPlaylists: boolean) => void;
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

interface MusicPlayerContextValue {
  activeIndex: number;
  currentTime: number;
  duration: number;
  hasRequestedPlayback: boolean;
  isPlaying: boolean;
  isReady: boolean;
  playerError: number | null;
  playNext: () => void;
  playPrevious: () => void;
  seek: (seconds: number) => void;
  togglePlayback: () => void;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: YouTubeNamespace;
  }
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);
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

function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error(
      "Music controls must be rendered inside MusicPlayerProvider"
    );
  }
  return context;
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

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(
    PORTFOLIO_MUSIC[0].durationSeconds
  );
  const [hasRequestedPlayback, setHasRequestedPlayback] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [playerError, setPlayerError] = useState<number | null>(null);

  const syncTime = useCallback(() => {
    const player = playerRef.current as YouTubePlayer | null;
    if (!player) {
      return;
    }

    const nextCurrentTime = player.getCurrentTime();
    const nextDuration = player.getDuration();

    if (Number.isFinite(nextCurrentTime) && nextCurrentTime >= 0) {
      setCurrentTime(nextCurrentTime);
    }

    setDuration(
      Number.isFinite(nextDuration) && nextDuration > 0
        ? nextDuration
        : PORTFOLIO_MUSIC[activeIndexRef.current].durationSeconds
    );
  }, []);

  const selectTrack = useCallback(
    (nextIndex: number, shouldPlay: boolean) => {
      const normalizedIndex =
        (nextIndex + PORTFOLIO_MUSIC.length) % PORTFOLIO_MUSIC.length;
      const nextTrack = PORTFOLIO_MUSIC[normalizedIndex];
      activeIndexRef.current = normalizedIndex;
      setActiveIndex(normalizedIndex);
      setCurrentTime(0);
      setDuration(nextTrack.durationSeconds);
      setPlayerError(null);

      if (!isReady) {
        return;
      }

      const player = playerRef.current as YouTubePlayer;

      if (shouldPlay) {
        setHasRequestedPlayback(true);
        player.playVideoAt(normalizedIndex);
      } else {
        player.cuePlaylist(PLAYLIST_VIDEO_IDS, normalizedIndex, 0);
      }
    },
    [isReady]
  );

  useEffect(() => {
    const host = playerHostRef.current as HTMLDivElement | null;
    if (!host) {
      return;
    }

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
            target.setLoop(true);
            target.cuePlaylist(PLAYLIST_VIDEO_IDS, 0, 0);
          },
          onStateChange: ({ data, target }) => {
            const playlistIndex = target.getPlaylistIndex();
            if (
              playlistIndex >= 0 &&
              playlistIndex < PORTFOLIO_MUSIC.length &&
              playlistIndex !== activeIndexRef.current
            ) {
              const playlistTrack = PORTFOLIO_MUSIC[playlistIndex];
              activeIndexRef.current = playlistIndex;
              setActiveIndex(playlistIndex);
              setCurrentTime(0);
              setDuration(playlistTrack.durationSeconds);
            }

            if (data === PLAYER_STATES.cued) {
              setIsReady(true);
            }

            const playing = data === PLAYER_STATES.playing;
            setIsPlaying(playing);
            if (playing) {
              setPlayerError(null);
            }
            syncTime();
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

  const togglePlayback = useCallback(() => {
    setHasRequestedPlayback(true);

    if (!isReady || playerError !== null || !playerRef.current) {
      return;
    }

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, [isPlaying, isReady, playerError]);

  const playPrevious = useCallback(() => {
    selectTrack(activeIndex - 1, isPlaying);
  }, [activeIndex, isPlaying, selectTrack]);

  const playNext = useCallback(() => {
    selectTrack(activeIndex + 1, isPlaying);
  }, [activeIndex, isPlaying, selectTrack]);

  const seek = useCallback((seconds: number) => {
    setCurrentTime(seconds);
    playerRef.current?.seekTo(seconds, true);
  }, []);

  const value = useMemo(
    () => ({
      activeIndex,
      currentTime,
      duration,
      hasRequestedPlayback,
      isPlaying,
      isReady,
      playerError,
      playNext,
      playPrevious,
      seek,
      togglePlayback,
    }),
    [
      activeIndex,
      currentTime,
      duration,
      hasRequestedPlayback,
      isPlaying,
      isReady,
      playNext,
      playPrevious,
      playerError,
      seek,
      togglePlayback,
    ]
  );

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
      <div className={styles.hiddenPlayer} ref={playerHostRef} />
    </MusicPlayerContext.Provider>
  );
}

function RecordArtwork({ size }: { size: number }) {
  const { activeIndex, isPlaying } = useMusicPlayer();
  const track = PORTFOLIO_MUSIC[activeIndex];

  return (
    <span
      aria-hidden="true"
      className={styles.record}
      data-playing={isPlaying ? "true" : "false"}
      style={{ "--record-size": `${size}px` } as CSSProperties}
    >
      <Image
        alt=""
        className={styles.recordArtwork}
        height={120}
        sizes={`${size}px`}
        src={`https://i.ytimg.com/vi/${track.videoId}/hqdefault.jpg`}
        unoptimized
        width={120}
      />
      <span className={styles.recordLabel} />
    </span>
  );
}

function TransportControls({ compact = false }: { compact?: boolean }) {
  const {
    activeIndex,
    isPlaying,
    isReady,
    playNext,
    playPrevious,
    togglePlayback,
  } = useMusicPlayer();
  const track = PORTFOLIO_MUSIC[activeIndex];

  return (
    <div className={styles.transport} data-compact={compact ? "true" : "false"}>
      <button
        aria-label="Previous track"
        disabled={!isReady}
        onClick={playPrevious}
        type="button"
      >
        <PreviousIcon />
      </button>
      <button
        aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
        className={styles.playButton}
        disabled={!isReady}
        onClick={togglePlayback}
        type="button"
      >
        <PlayIcon playing={isPlaying} />
      </button>
      <button
        aria-label="Next track"
        disabled={!isReady}
        onClick={playNext}
        type="button"
      >
        <NextIcon />
      </button>
    </div>
  );
}

function Progress({ compact = false }: { compact?: boolean }) {
  const { activeIndex, currentTime, duration, isReady, seek } =
    useMusicPlayer();
  const track = PORTFOLIO_MUSIC[activeIndex];

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      seek(Number(event.currentTarget.value));
    },
    [seek]
  );

  return (
    <div className={styles.progress} data-compact={compact ? "true" : "false"}>
      <label>
        <span className={styles.srOnly}>Seek through {track.title}</span>
        <input
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          disabled={!isReady}
          max={duration || track.durationSeconds}
          min="0"
          onChange={handleChange}
          step="0.1"
          style={
            {
              "--music-progress": `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
            } as CSSProperties
          }
          type="range"
          value={Math.min(currentTime, duration || track.durationSeconds)}
        />
      </label>
      <div className={styles.timeRow}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration || track.durationSeconds)}</span>
      </div>
    </div>
  );
}

function PlayerError() {
  const { activeIndex, hasRequestedPlayback, playerError } = useMusicPlayer();
  const track = PORTFOLIO_MUSIC[activeIndex];

  if (playerError === null || !hasRequestedPlayback) {
    return null;
  }

  return (
    <p className={styles.playerError} role="status">
      YouTube would not play this one here.{" "}
      <Link href={track.href} rel="noreferrer" target="_blank">
        Open it in YouTube Music ↗
      </Link>
    </p>
  );
}

export function MusicPopoverPlayer() {
  const { activeIndex, isPlaying } = useMusicPlayer();
  const track = PORTFOLIO_MUSIC[activeIndex];

  return (
    <div
      className={styles.popoverPlayer}
      data-playing={isPlaying ? "true" : "false"}
    >
      <div className={styles.popoverMain}>
        <RecordArtwork size={64} />
        <div className={styles.popoverBody}>
          <div className={styles.trackCopy}>
            <strong title={track.title}>{track.title}</strong>
            <span>{track.artist}</span>
          </div>
          <Progress compact />
        </div>
        <TransportControls compact />
      </div>
      <PlayerError />
    </div>
  );
}
