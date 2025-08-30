export function Library() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Tu Biblioteca</h1>
        <p className="text-white/70">Tus canciones y playlists favoritas aparecerán aquí.</p>
      </header>

      <div className="card p-6">
        <ul className="list-disc pl-5 space-y-2">
          <li>Playlists guardadas (mock)</li>
          <li>Artistas seguidos (mock)</li>
          <li>Último escuchado (mock)</li>
        </ul>
      </div>
    </section>
  );
}