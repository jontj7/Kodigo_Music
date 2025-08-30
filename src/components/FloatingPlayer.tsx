import { usePlayer } from "../context/PlayerContext";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";

export default function FloatingPlayer() {
  const { state, dispatch } = usePlayer();
  const track = state.queue[state.currentIndex];
  const pct = state.duration ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <div
      className="
        fixed left-1/2 bottom-4 -translate-x-1/2 z-50
        w-[min(92vw,900px)]
        bg-white/5 backdrop-blur border border-white/10 rounded-2xl
        shadow-[0_10px_40px_rgba(0,0,0,0.35)]
      "
    >
      {/* progress */}
      <div className="h-1.5 bg-white/10 rounded-t-2xl overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-accent-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="px-4 py-3 flex items-center gap-4">
        <img
          src={track?.cover || "/logo.png"}
          alt={track?.title}
          className="h-10 w-10 rounded-lg object-cover"
        />
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">{track?.title ?? "Sin título"}</div>
          <div className="text-xs text-white/70 truncate">{track?.artist ?? "Desconocido"}</div>
        </div>

        <div className="flex items-center gap-2 mx-auto">
          <button className="btn btn-ghost" onClick={() => dispatch({ type: "PREV" })}>
            <SkipBack size={16} />
          </button>
          <button
            className="btn btn-primary"
            onClick={() => dispatch({ type: "PLAY_PAUSE" })}
            aria-label={state.isPlaying ? "Pausar" : "Reproducir"}
          >
            {state.isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button className="btn btn-ghost" onClick={() => dispatch({ type: "NEXT" })}>
            <SkipForward size={16} />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 w-44">
          <button
            className="btn btn-ghost"
            onClick={() => dispatch({ type: "TOGGLE_MUTE" })}
            title={state.muted ? "Activar sonido" : "Silenciar"}
          >
            {state.muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={state.muted ? 0 : state.volume}
            onChange={(e) => dispatch({ type: "SET_VOLUME", payload: Number(e.target.value) })}
            className="range"
          />
        </div>
      </div>

      {/* seek */}
      <div className="px-4 pb-3">
        <input
          type="range"
          min={0}
          max={state.duration || 0}
          step={1}
          value={state.currentTime}
          onChange={(e) => dispatch({ type: "SEEK", payload: Number(e.target.value) })}
          className="range"
          aria-label="Progreso"
        />
      </div>
    </div>
  );
}
