import { useState } from "react";
import { searchSongs } from "../services/itunes";
import { usePlayer } from "../context/PlayerContext";
import { Search as SearchIcon, Play } from "lucide-react";

function fmt(sec?: number) {
  if (!sec && sec !== 0) return "—";
  const m = Math.floor(sec / 60);
  const s = String(Math.floor(sec % 60)).padStart(2, "0");
  return `${m}:${s}`;
}

export function Search() {
  const { dispatch } = usePlayer();
  const [term, setTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ReturnType<typeof Array> & any>([]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (term.trim().length < 2) {
      setError("Escribe al menos 2 caracteres.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const tracks = await searchSongs(term.trim(), 30);
      setResults(tracks);
      if (tracks.length === 0) setError("Sin resultados. Prueba otro término.");
    } catch (err: any) {
      setError(err?.message ?? "Error de búsqueda");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Buscar</h1>
        <p className="text-white/70">Usa la API pública de iTunes para encontrar canciones y reproducir previews.</p>
      </header>

      <form onSubmit={onSubmit} className="card p-4 flex items-center gap-3 max-w-2xl">
        <SearchIcon size={18}/>
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Ej: bad bunny, karol g, eminem…"
          className="flex-1 bg-transparent outline-none"
        />
        <button disabled={loading} className="btn btn-primary">
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {error && <div className="text-red-400">{error}</div>}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((t: any, i: number) => (
          <div key={t.id} className="card p-4">
            <img src={t.cover} alt={t.title} className="h-44 w-full object-cover rounded-xl" />
            <div className="mt-3">
              <h3 className="font-semibold truncate">{t.title}</h3>
              <p className="text-sm text-white/60 truncate">{t.artist}</p>
              <p className="text-xs text-white/50 mt-1">Preview • {fmt(t.duration)}</p>
            </div>
            <button
              className="btn btn-primary mt-3 w-full"
              onClick={() => dispatch({ type: "SET_QUEUE", payload: results, index: i })}
            >
              <Play size={18}/> Reproducir desde aquí
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
