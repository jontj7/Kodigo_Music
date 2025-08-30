import { Routes, Route, NavLink } from "react-router-dom";
import { Home } from "./routes/Home";
import { Library } from "./routes/Library";
import { Login } from "./routes/Login";
import { Search } from "./routes/Search";
import { PlayerProvider } from "./context/PlayerContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Search as SearchIcon, Library as LibraryIcon, Home as HomeIcon, LogIn } from "lucide-react";
import FloatingPlayer from "./components/FloatingPlayer"; // ⬅️ nuevo

function TopNav() {
  const { user, logout } = useAuth();
  return (
    <nav className="container-p flex items-center gap-4 py-3">
      <img src="/logo1.png" alt="Kodigo Music" className="h-8 w-8 rounded" />
      <span className="font-semibold">Kodigo Music</span>
      <div className="ml-auto flex items-center gap-2">
        <NavLink to="/" className={({isActive}) => `btn ${isActive ? "bg-white/10" : ""}`}>
          <HomeIcon size={18}/> Inicio
        </NavLink>
        <NavLink to="/search" className={({isActive}) => `btn ${isActive ? "bg-white/10" : ""}`}>
          <SearchIcon size={18}/> Buscar
        </NavLink>
        <NavLink to="/library" className={({isActive}) => `btn ${isActive ? "bg-white/10" : ""}`}>
          <LibraryIcon size={18}/> Biblioteca
        </NavLink>
        {!user ? (
          <NavLink to="/login" className={({isActive}) => `btn ${isActive ? "bg-white/10" : ""}`}>
            <LogIn size={18}/> Ingresar
          </NavLink>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/80">Hola, {user.email}</span>
            <button className="btn bg-white/10" onClick={logout}>Salir</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <div className="min-h-screen grid grid-rows-[auto,1fr]">
          <header className="sticky top-0 z-40 bg-black/40 backdrop-blur border-b border-white/5">
            <TopNav />
          </header>

          {/* padding-bottom para no tapar contenido con el player flotante */}
          <main className="container-p my-6 pb-28">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/library" element={<Library />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>

          {/* Player flotante */}
          <FloatingPlayer />
        </div>
      </PlayerProvider>
    </AuthProvider>
  );
}
