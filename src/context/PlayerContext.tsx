import React, {
  createContext, useContext, useMemo, useReducer, useRef, useEffect,
} from "react";

export type Track = {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
  duration?: number;
};

type PlayerState = {
  queue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;        // 0..1
  muted: boolean;
  currentTime: number;   // segundos
  duration: number;      // segundos
};

type Action =
  | { type: "SET_QUEUE"; payload: Track[]; index?: number }
  | { type: "PLAY_PAUSE" }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "SET_INDEX"; payload: number }
  | { type: "SET_VOLUME"; payload: number }
  | { type: "SET_MUTED"; payload: boolean }
  | { type: "TOGGLE_MUTE" }
  | { type: "SEEK"; payload: number }           // segundos
  | { type: "SET_PROGRESS"; time: number; dur: number };

const initialState: PlayerState = {
  queue: [
    {
      id: "1",
      title: "Ocean Drive",
      artist: "SoundHelix",
      cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      id: "2",
      title: "City Lights",
      artist: "SoundHelix",
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
      id: "3",
      title: "Night Ride",
      artist: "SoundHelix",
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
  ],
  currentIndex: 0,
  isPlaying: false,
  volume: 0.9,
  muted: false,
  currentTime: 0,
  duration: 0,
};

const PlayerContext = createContext<{
  state: PlayerState;
  dispatch: React.Dispatch<Action>;
  audioRef: React.RefObject<HTMLAudioElement>;
  // helpers prácticos
  playCollection: (tracks: Track[], startIndex?: number) => void;
  playAt: (index: number) => void;
} | null>(null);

function reducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case "SET_QUEUE":
      return {
        ...state,
        queue: action.payload,
        currentIndex: action.index ?? 0,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
      };
    case "PLAY_PAUSE":
      return { ...state, isPlaying: !state.isPlaying };
    case "NEXT":
      return {
        ...state,
        currentIndex: (state.currentIndex + 1) % state.queue.length,
        isPlaying: true,
        currentTime: 0,
      };
    case "PREV":
      return {
        ...state,
        currentIndex:
          (state.currentIndex - 1 + state.queue.length) % state.queue.length,
        isPlaying: true,
        currentTime: 0,
      };
    case "SET_INDEX":
      return { ...state, currentIndex: action.payload, isPlaying: true, currentTime: 0 };
    case "SET_VOLUME":
      return { ...state, volume: Math.min(1, Math.max(0, action.payload)) };
    case "SET_MUTED":
      return { ...state, muted: action.payload };
    case "TOGGLE_MUTE":
      return { ...state, muted: !state.muted };
    case "SEEK":
      return { ...state, currentTime: Math.max(0, action.payload) };
    case "SET_PROGRESS":
      return { ...state, currentTime: action.time, duration: action.dur };
    default:
      return state;
  }
}

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sincroniza play/pause, volumen y mute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = state.muted;
    audio.volume = state.volume;

    // si cambia la pista o play/pause
    if (state.isPlaying) {
      audio.play().catch(() => {/* ignore */});
    } else {
      audio.pause();
    }
  }, [state.isPlaying, state.volume, state.muted, state.currentIndex]);

  // timeupdate + metadata
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () =>
      dispatch({
        type: "SET_PROGRESS",
        time: audio.currentTime || 0,
        dur: audio.duration || 0,
      });

    const onLoaded = () =>
      dispatch({
        type: "SET_PROGRESS",
        time: audio.currentTime || 0,
        dur: audio.duration || 0,
      });

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
    };
  }, []);

  // aplicar SEEK desde el estado
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // si el currentTime del estado difiere mucho, actualiza
    if (Math.abs((audio.currentTime || 0) - state.currentTime) > 0.25) {
      audio.currentTime = state.currentTime;
    }
  }, [state.currentTime]);

  const playCollection = (tracks: Track[], startIndex = 0) => {
    dispatch({ type: "SET_QUEUE", payload: tracks, index: startIndex });
  };

  const playAt = (index: number) => dispatch({ type: "SET_INDEX", payload: index });

  const value = useMemo(
    () => ({ state, dispatch, audioRef, playCollection, playAt }),
    [state]
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {/* Single global audio element */}
      <audio
        ref={audioRef}
        src={state.queue[state.currentIndex]?.url}
        onEnded={() => dispatch({ type: "NEXT" })}
      />
    </PlayerContext.Provider>
  );
};

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
