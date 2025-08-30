import { Play } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

type Props = {
  title: string;
  subtitle: string;
  cover: string;
  startIndex?: number;
};

export function PlaylistCard({ title, subtitle, cover, startIndex = 0 }: Props) {
  const { dispatch } = usePlayer();

  return (
    <div className="card p-4 group">
      <div className="relative">
        <img src={cover} alt={title} className="h-44 w-full object-cover rounded-xl" />
        <button
          className="btn btn-primary absolute bottom-3 right-3 opacity-0 group-hover:opacity-100"
          onClick={() => dispatch({ type: "SET_INDEX", payload: startIndex })}
          aria-label="Reproducir"
        >
          <Play size={18} /> Reproducir
        </button>
      </div>
      <div className="mt-3">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-white/60">{subtitle}</p>
      </div>
    </div>
  );
}