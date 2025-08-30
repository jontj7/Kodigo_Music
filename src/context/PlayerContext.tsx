import React, { createContext, useContext, useMemo, useReducer, useRef, useEffect } from "react";

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
  volume: number;
};

type Action =
  | { type: "SET_QUEUE"; payload: Track[]; index?: number }
  | { type: "PLAY_PAUSE" }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "SET_INDEX"; payload: number }
  | { type: "SET_VOLUME"; payload: number };

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
};

const PlayerContext = createContext<{
  state: PlayerState;
  dispatch: React.Dispatch<Action>;
  audioRef: React.RefObject<HTMLAudioElement>;
} | null>(null);

function reducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case "SET_QUEUE":
      return {
        ...state,
        queue: action.payload,
        currentIndex: action.index ?? 0,
        isPlaying: true,
      };
    case "PLAY_PAUSE":
      return { ...state, isPlaying: !state.isPlaying };
    case "NEXT":
      return { ...state, currentIndex: (state.currentIndex + 1) % state.queue.length, isPlaying: true };
    case "PREV":
      return { ...state, currentIndex: (state.currentIndex - 1 + state.queue.length) % state.queue.length, isPlaying: true };
    case "SET_INDEX":
      return { ...state, currentIndex: action.payload, isPlaying: true };
    case "SET_VOLUME":
      return { ...state, volume: Math.min(1, Math.max(0, action.payload)) };
    default:
      return state;
  }
}

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync play/pause & volume
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = state.volume;
    if (state.isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [state.isPlaying, state.volume, state.currentIndex]);

  const value = useMemo(() => ({ state, dispatch, audioRef }), [state]);

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