import { Play, Image as ImageIcon } from "lucide-react";

export function Library() {
  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gradient">Tu Biblioteca</h1>
        <p className="text-white/70">Explora tus canciones y playlists por género.</p>
      </header>

      {/* GRID de 3 secciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ROCK */}
        <GenreCard
          title="Rock"
          icon="🎸"
          banner="/covers/rock-banner.jpg"
          tracks={[
            { title: "Bohemian Rhapsody", artist: "Queen", cover: "/covers/rock1.jpg" },
            { title: "Thunderstruck", artist: "AC/DC", cover: "/covers/rock2.jpg" },
            { title: "Smells Like Teen Spirit", artist: "Nirvana", cover: "/covers/rock3.jpg" },
          ]}
        />

        {/* METAL */}
        <GenreCard
          title="Metal"
          icon="🤘"
          banner="/covers/metal-banner.jpg"
          tracks={[
            { title: "Enter Sandman", artist: "Metallica", cover: "/covers/metal1.jpg" },
            { title: "Fear of the Dark", artist: "Iron Maiden", cover: "/covers/metal2.jpg" },
            { title: "Duality", artist: "Slipknot", cover: "/covers/metal3.jpg" },
          ]}
        />

        {/* POP */}
        <GenreCard
          title="Pop"
          icon="🎤"
          banner="/covers/pop-banner.jpg"
          tracks={[
            { title: "Levitating", artist: "Dua Lipa", cover: "/covers/pop1.jpg" },
            { title: "Tití Me Preguntó", artist: "Bad Bunny", cover: "/covers/pop2.jpg" },
            { title: "Anti-Hero", artist: "Taylor Swift", cover: "/covers/pop3.jpg" },
          ]}
        />
      </div>
    </section>
  );
}

type Track = {
  title: string;
  artist: string;
  cover?: string;
};

function GenreCard({
  title,
  icon,
  banner,
  tracks,
}: {
  title: string;
  icon: string;
  banner?: string;
  tracks: Track[];
}) {
  return (
    <article className="card overflow-hidden card-hover">
      {/* Banner del género con fallback */}
      <div className="relative h-28">
        {banner ? (
          <img
            src={banner}
            alt={`${title} banner`}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
            loading="lazy"
          />
        ) : null}

        {/* Fallback visual si no hay/rompe el banner */}
        <div className="absolute inset-0 bg-brand-gradient opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute left-4 bottom-3">
          <h2 className="text-lg font-semibold">
            <span className="mr-2">{icon}</span>
            <span className="text-gradient">{title}</span>
          </h2>
        </div>
      </div>

      {/* Lista de canciones */}
      <div className="p-5 grid grid-cols-1 gap-4">
        {tracks.map((t, idx) => (
          <TrackRow key={idx} track={t} />
        ))}

        <div className="pt-2">
          <button type="button" className="btn btn-outline w-full">
            Ver todo {title}
          </button>
        </div>
      </div>
    </article>
  );
}

function TrackRow({ track }: { track: Track }) {
  const src = track.cover || ""; // puede venir vacío → mostramos placeholder

  return (
    <div className="group flex items-center gap-3">
      {/* Carátula con fallback sólido */}
      <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden ring-1 ring-white/10">
        {src ? (
          <img
            src={src}
            alt={track.title}
            className="h-full w-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
            loading="lazy"
          />
        ) : null}

        {/* Placeholder (si no hay imagen o falló) */}
        <div className="absolute inset-0 grid place-items-center bg-white/5">
          <div className="h-8 w-8 rounded-lg bg-brand-gradient opacity-80 grid place-items-center">
            <ImageIcon size={16} className="text-black/80" />
          </div>
        </div>

        {/* Overlay Play */}
        <button
          type="button"
          className="
            absolute inset-0 grid place-items-center
            bg-black/0 group-hover:bg-black/35
            opacity-0 group-hover:opacity-100 transition
          "
          title="Reproducir"
          // TODO: integra con tu PlayerContext:
          // onClick={() => dispatch({ type: 'PLAY_FROM_LIBRARY', payload: track })}
        >
          <span className="p-2 rounded-full bg-white text-black">
            <Play size={16} />
          </span>
        </button>
      </div>

      {/* Texto */}
      <div className="min-w-0">
        <div className="text-sm font-medium truncate">{track.title}</div>
        <div className="text-xs text-white/70 truncate">{track.artist}</div>
      </div>
    </div>
  );
}
