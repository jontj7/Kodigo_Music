import { useMemo, useState, useEffect, useRef } from "react";
import { usePlayer } from "../context/PlayerContext";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, ListMusic
} from "lucide-react";

export function PlayerBar() {
  const { state, dispatch } = usePlayer();
  const track = state.queue[state.currentIndex];

  const cover = useMemo(() => track?.cover ?? "/logo.svg", [track]);

  // Mute “soft”: recordamos el volumen previo y alternamos a 0/prev
  const [prevVol, setPrevVol] = useState( state.volume || 0.8 );
  const isMuted = state.volume === 0;

  const toggleMute = () => {
    if (isMuted) {
      dispatch({ type: "SET_VOLUME", payload: prevVol || 0.8 });
    } else {
      setPrevVol(state.volume || 0.8);
      dispatch({ type: "SET_VOLUME", payload: 0 });
    }
  };

  // Atajos de teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Evita conflictos cuando se escribe en inputs/sliders
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      if (e.code === "Space") {
        e.preventDefault();
        dispatch({ type: "PLAY_PAUSE" });
      } else if (e.key === "ArrowLeft") {
        dispatch({ type: "PREV" });
      } else if (e.key === "ArrowRight") {
        dispatch({ type: "NEXT" });
      } else if (e.key.toLowerCase() === "m") {
        toggleMute();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isMuted, state.volume, prevVol]);

  // Marquee simple (CSS scroll cuando overflow)
  const titleRef = useRef<HTMLDivElement>(null);
  const artistRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="
        container-p py-3
        flex items-center gap-4
        rounded-2xl
        bg-white/5 backdrop-blur
        border border-white/10
        shadow-[0_8px_30px_rgb(0,0,0,0.12)]
        px-4
      "
      role="region"
      aria-label="Barra de reproducción"
    >
      {/* Cover + Ring */}
      <div className="relative">
        <div
          className={`
            absolute inset-0 rounded-2xl
            ${state.isPlaying ? "animate-pulse" : ""}
            bg-gradient-to-br from-white/10 to-transparent
            pointer-events-none
          `}
          aria-hidden
        />
        <div
          className={`
            relative h-14 w-14 rounded-2xl overflow-hidden
            ring-2 ring-white/15
            transition-transform duration-300
            ${state.isPlaying ? "rotate-[0deg]" : ""}
          `}
        >
          <img
            src={cover}
            alt={track?.title || "Cover"}
            className={`
              h-full w-full object-cover
              ${state.isPlaying ? "animate-[spin_12s_linear_infinite]" : ""}
            `}
            style={{ animationPlayState: state.isPlaying ? "running" : "paused" }}
          />
          {/* “vinyl” center dot */}
          <span className="absolute inset-0 rounded-2xl pointer-events-none">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-white/70 shadow" />
          </span>
        </div>
      </div>

      {/* Titles */}
      <div className="min-w-0 flex-1">
        <div
          ref={titleRef}
          className="text-sm font-semibold text-white/90 whitespace-nowrap overflow-hidden"
          title={track?.title}
        >
          <span className="inline-block will-change-transform animate-[marquee_10s_linear_infinite] hover:[animation-play-state:paused]">
            {track?.title ?? "Sin título"}
          </span>
        </div>
        <div
          ref={artistRef}
          className="text-xs text-white/60 whitespace-nowrap overflow-hidden"
          title={track?.artist}
        >
          <span className="inline-block will-change-transform animate-[marquee_14s_linear_infinite] hover:[animation-play-state:paused]">
            {track?.artist ?? "Desconocido"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 mx-auto">
        <IconButton
          label="Anterior"
          onClick={() => dispatch({ type: "PREV" })}
          className="hover:bg-white/10"
        >
          <SkipBack size={18} />
        </IconButton>

        <IconButton
          label={state.isPlaying ? "Pausar" : "Reproducir"}
          onClick={() => dispatch({ type: "PLAY_PAUSE" })}
          className={`
            px-4 py-2 rounded-xl
            bg-gradient-to-b from-white to-white/80 text-black
            hover:from-white hover:to-white
            active:scale-95
            shadow-[0_6px_20px_rgba(255,255,255,0.25)]
          `}
        >
          {state.isPlaying ? <Pause size={18}/> : <Play size={18}/>}
        </IconButton>

        <IconButton
          label="Siguiente"
          onClick={() => dispatch({ type: "NEXT" })}
          className="hover:bg-white/10"
        >
          <SkipForward size={18} />
        </IconButton>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 w-56 max-w-[40vw]">
        <IconButton
          label={isMuted ? "Activar sonido" : "Silenciar"}
          onClick={toggleMute}
          className="hover:bg-white/10"
        >
          {isMuted ? <VolumeX size={18}/> : <Volume2 size={18}/>}
        </IconButton>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={state.volume}
          onChange={(e) => dispatch({ type: "SET_VOLUME", payload: Number(e.target.value) })}
          aria-label="Volumen"
          className="
            w-full h-2
            appearance-none rounded-full
            bg-white/10
            accent-white
          "
        />
      </div>

      {/* Extras (local UI state, no cambios en tu store) */}
      <div className="hidden md:flex items-center gap-2">
        <ToggleHeart />
        <IconButton label="Cola" onClick={() => { /* aquí abre modal/cola si la tienes */ }} className="hover:bg-white/10">
          <ListMusic size={18} />
        </IconButton>
      </div>

      {/* Equalizer simple cuando está sonando */}
      <div className="hidden sm:flex items-end gap-1 h-6 ml-2" aria-hidden>
        {[0,1,2,3,4].map((i) => (
          <span
            key={i}
            className={`
              w-1 rounded
              ${state.isPlaying ? "bg-white/70 animate-eq" : "bg-white/20"}
            `}
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>

      {/* Animations (Tailwind + scoped) */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes eq {
          0% { height: 20%; }
          50% { height: 90%; }
          100% { height: 20%; }
        }
        .animate-eq {
          animation: eq 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

/** Botón icónico reutilizable */
function IconButton({
  children,
  label,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`
        btn relative
        inline-flex items-center justify-center
        h-10 min-w-10
        rounded-xl px-3
        text-white
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40
        active:scale-95
        ${className}
      `}
    >
      {/* glow */}
      <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      {children}
    </button>
  );
}

/** Corazón local (no toca tu store) */
function ToggleHeart() {
  const [liked, setLiked] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={liked ? "Quitar de favoritos" : "Añadir a favoritos"}
      onClick={() => setLiked(v => !v)}
      className={`
        h-10 min-w-10 rounded-xl px-3
        transition-all duration-200
        ${liked ? "bg-pink-500/20 text-pink-300" : "text-white hover:bg-white/10"}
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40
        active:scale-95
      `}
      title={liked ? "Quitar de favoritos" : "Añadir a favoritos"}
    >
      <Heart size={18} className={liked ? "fill-pink-400" : ""} />
    </button>
  );
}
