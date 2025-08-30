import type { Track } from "../context/PlayerContext";

type ItunesSong = {
  trackId: number;
  trackName: string;
  artistName: string;
  previewUrl: string;
  artworkUrl100: string;
  trackTimeMillis?: number;
};

function upscaleCover(url: string) {
  return url.replace("100x100bb", "512x512bb");
}

function mapToTrack(r: ItunesSong): Track {
  return {
    id: String(r.trackId),
    title: r.trackName,
    artist: r.artistName,
    cover: upscaleCover(r.artworkUrl100),
    url: r.previewUrl,
    duration: r.trackTimeMillis ? Math.round(r.trackTimeMillis / 1000) : undefined,
  };
}

export async function searchSongs(term: string, limit = 25): Promise<Track[]> {
  const q = new URLSearchParams({
    term,
    media: "music",
    entity: "song",
    limit: String(limit),
    country: "US",
  }).toString();

  // Pega al proxy (dev: Vite, prod: Vercel)
  const res = await fetch(`/api/itunes/search?${q}`);
  if (!res.ok) throw new Error("Error consultando iTunes");
  const json = await res.json();
  return (json.results as ItunesSong[])
    .filter(r => !!r.previewUrl)
    .map(mapToTrack);
}
