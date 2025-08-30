import { useMemo, useState } from "react";
import { Shuffle, Play, Flame, ListMusic, Sparkles } from "lucide-react";
import { PlaylistCard } from "../components/PlaylistCard";
import { usePlayer } from "../context/PlayerContext";

// mocks de pistas con URL reales (cámbialas por tus previews)
const TOP_HITS_TRACKS = [
  {
    id: "th-1",
    title: "Ocean Drive",
    artist: "SoundHelix",
    cover:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "th-2",
    title: "City Lights",
    artist: "SoundHelix",
    cover:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "th-3",
    title: "Night Ride",
    artist: "SoundHelix",
    cover:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

const CHILL_TRACKS = [
  {
    id: "ch-1",
    title: "Lo-fi Beat 1",
    artist: "Lo-Fier",
    cover:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
  },
  {
    id: "ch-2",
    title: "Lo-fi Beat 2",
    artist: "Lo-Fier",
    cover:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
  },
  {
    id: "ch-3",
    title: "Lo-fi Beat 3",
    artist: "Lo-Fier",
    cover:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
  },
];

const WORKOUT_TRACKS = [
  {
    id: "wk-1",
    title: "Pump 1",
    artist: "DJ Fit",
    cover:
      "https://images.unsplash.com/photo-1520975954732-35dd222996f0?q=80&w=800&auto=format&fit=crop",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
  {
    id: "wk-2",
    title: "Pump 2",
    artist: "DJ Fit",
    cover:
      "https://images.unsplash.com/photo-1520975954732-35dd222996f0?q=80&w=800&auto=format&fit=crop",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
  },
  {
    id: "wk-3",
    title: "Pump 3",
    artist: "DJ Fit",
    cover:
      "https://images.unsplash.com/photo-1520975954732-35dd222996f0?q=80&w=800&auto=format&fit=crop",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
  },
];

type P = {
  title: string;
  subtitle: string;
  cover: string;
  startIndex: number;
  tags: string[];
  tracks?: number;
  minutes?: number;
  badge?: string;
  // ahora sí: lista real de pistas para reproducir
  list: {
    id: string;
    title: string;
    artist: string;
    cover: string;
    url: string;
  }[];
};

const ALL: P[] = [
  {
    title: "Top Hits El Salvador",
    subtitle: "Lo más escuchado esta semana",
    cover:
      "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=1200&auto=format&fit=crop",
    startIndex: 0,
    tags: ["tendencias", "latino", "hits"],
    tracks: 48,
    minutes: 160,
    badge: "Top",
    list: TOP_HITS_TRACKS,
  },
  {
    title: "Chill & Focus",
    subtitle: "Lo-fi para estudiar",
    cover:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop",
    startIndex: 1,
    tags: ["chill", "focus", "lofi"],
    tracks: 42,
    minutes: 140,
    badge: "Nuevo",
    list: CHILL_TRACKS,
  },
  {
    title: "Workout Mix",
    subtitle: "Energía para el gym",
    cover:
      "https://images.unsplash.com/photo-1520975954732-35dd222996f0?q=80&w=1200&auto=format&fit=crop",
    startIndex: 2,
    tags: ["workout", "electro", "energia"],
    tracks: 36,
    minutes: 120,
    list: WORKOUT_TRACKS,
  },
];

const MOODS = [
  { key: "all", label: "Todos", icon: <ListMusic size={14} /> },
  { key: "tendencias", label: "Tendencias", icon: <Flame size={14} /> },
  { key: "lofi", label: "Lo-fi", icon: <Sparkles size={14} /> },
  { key: "workout", label: "Workout", icon: <Sparkles size={14} /> },
  { key: "latino", label: "Latino", icon: <Sparkles size={14} /> },
] as const;

export function Home() {
  const [mood, setMood] = useState<(typeof MOODS)[number]["key"]>("all");
  const { dispatch } = usePlayer();

  const featured = ALL[0];
  const filtered = useMemo(() => {
    if (mood === "all") return ALL.slice(0, 3);
    return ALL.filter((p) => p.tags.includes(mood)).slice(0, 3);
  }, [mood]);
  const trending = useMemo(
    () => ALL.filter((p) => p.tags.includes("tendencias")).slice(0, 4),
    []
  );

  const playAll = () => {
    // reproduce la primera lista filtrada completa
    const first = filtered[0];
    if (first) {
      dispatch({ type: "SET_QUEUE", payload: first.list, index: 0 });
    }
  };

  const shuffleAll = () => {
    const first = filtered[0];
    if (first) {
      const arr = [...first.list];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      dispatch({ type: "SET_QUEUE", payload: arr, index: 0 });
    }
  };

  return (
    <section className="space-y-8">
      {/* …tu hero y filtros iguales… */}

      {/* LISTAS PRINCIPALES */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <PlaylistCard
            key={p.title}
            title={p.title}
            subtitle={p.subtitle}
            cover={p.cover}
            badge={p.badge}
            tracks={p.tracks}
            minutes={p.minutes}
            startIndex={p.startIndex}
            onPlay={() => dispatch({ type: "SET_QUEUE", payload: p.list, index: 0 })}
          />
        ))}
      </div>

      {/* TENDENCIAS */}
      <div className="space-y-3 pt-2">
        <h3 className="text-lg font-semibold text-gradient">Tendencias ahora</h3>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((p) => (
            <PlaylistCard
              key={`t-${p.title}`}
              title={p.title}
              subtitle={p.subtitle}
              cover={p.cover}
              badge="🔥"
              tracks={p.tracks}
              minutes={p.minutes}
              startIndex={p.startIndex}
              onPlay={() => dispatch({ type: "SET_QUEUE", payload: p.list, index: 0 })}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
