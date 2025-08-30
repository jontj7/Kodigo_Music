import { usePlayer } from "../context/PlayerContext";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useMemo } from "react";

export function PlayerBar() {
  const { state, dispatch } = usePlayer();
  const track = state.queue[state.currentIndex];

  const cover = useMemo(() => track?.cover ?? "/logo.svg", [track]);

  return (
    <div className="container-p py-3 flex items-center gap-4">
      <img src={cover} alt={track?.title} className="h-12 w-12 object-cover rounded-xl" />
      <div className="min-w-0">
        <div className="text-sm font-semibold truncate">{track?.title}</div>
        <div className="text-xs text-white/60 truncate">{track?.artist}</div>
      </div>

      <div className="flex items-center gap-3 mx-auto">
        <button className="btn bg-white/10" onClick={() => dispatch({ type: "PREV" })}><SkipBack size={18}/></button>
        <button
          className="btn btn-primary"
          onClick={() => dispatch({ type: "PLAY_PAUSE" })}
          aria-label={state.isPlaying ? "Pausar" : "Reproducir"}
        >
          {state.isPlaying ? <Pause size={18}/> : <Play size={18}/>}
        </button>
        <button className="btn bg-white/10" onClick={() => dispatch({ type: "NEXT" })}><SkipForward size={18}/></button>
      </div>

      <div className="flex items-center gap-2 w-52">
        <Volume2 size={18}/>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={state.volume}
          onChange={(e) => dispatch({ type: "SET_VOLUME", payload: Number(e.target.value) })}
          className="w-full accent-brand-500"
        />
      </div>
    </div>
  );
}