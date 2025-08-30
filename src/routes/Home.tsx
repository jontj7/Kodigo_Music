import { PlaylistCard } from "../components/PlaylistCard";

export function Home() {
  const lists = [
    {
      title: "Top Hits El Salvador",
      subtitle: "Lo más escuchado esta semana",
      cover: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=1200&auto=format&fit=crop",
      startIndex: 0,
    },
    {
      title: "Chill & Focus",
      subtitle: "Lo-fi para estudiar",
      cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop",
      startIndex: 1,
    },
    {
      title: "Workout Mix",
      subtitle: "Energía para el gym",
      cover: "https://images.unsplash.com/photo-1520975954732-35dd222996f0?q=80&w=1200&auto=format&fit=crop",
      startIndex: 2,
    },
  ];

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Descubre</h1>
        <p className="text-white/70">Explora playlists y comienza a escuchar.</p>
      </header>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {lists.map((p) => (
          <PlaylistCard key={p.title} {...p} />
        ))}
      </div>
    </section>
  );
}