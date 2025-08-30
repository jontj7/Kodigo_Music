import { Play, Clock, Music2 } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  cover: string;
  startIndex?: number; // por si conectas al player
  badge?: string;      // “Top”, “Nuevo”, emoji, etc.
  tracks?: number;
  minutes?: number;
  onPlay?: () => void;
};

export function PlaylistCard({
  title,
  subtitle,
  cover,
  startIndex,
  badge,
  tracks,
  minutes,
  onPlay,
}: Props) {
  return (
    <article className="card relative overflow-hidden group">
      {/* Cover */}
      <div className="relative h-44">
        <img
          src={cover}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
        {/* Badge */}
        {badge && (
          <span className="absolute left-3 top-3 text-xs font-semibold px-2 py-1 rounded-md bg-white/90 text-black">
            {badge}
          </span>
        )}
        {/* Play hover */}
        <button
          className="
            absolute right-3 bottom-3 p-3 rounded-xl
            bg-white text-black shadow
            opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
            transition
          "
          title="Reproducir"
          onClick={onPlay ?? (() => console.log("play", startIndex))}
        >
          <Play size={16} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h4 className="font-semibold leading-tight">{title}</h4>
        {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}

        {(tracks || minutes) && (
          <div className="mt-3 flex items-center gap-4 text-xs text-white/60">
            {typeof tracks === "number" && (
              <span className="inline-flex items-center gap-1">
                <Music2 size={14} /> {tracks} temas
              </span>
            )}
            {typeof minutes === "number" && (
              <span className="inline-flex items-center gap-1">
                <Clock size={14} /> ~{minutes} min
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
