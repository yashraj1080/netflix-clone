import { useEffect, useState, useRef } from "react";
import "./TheaterMode.css";

interface TheaterModeProps {
  movie: any;
  themeColor: [number, number, number];
  onClose: () => void;
}

const IMG_BASE = "https://image.tmdb.org/t/p/original";
const PARTICLE_COUNT = 55;

interface Particle {
  id: number;
  x: number;         // % from left
  size: number;      // px
  duration: number;  // animation seconds
  delay: number;     // animation delay seconds
  opacity: number;
  shape: "circle" | "star" | "diamond";
}

function makeParticles(): Particle[] {
  const shapes: Particle["shape"][] = ["circle", "star", "diamond"];
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 4 + Math.random() * 8,
    duration: 5 + Math.random() * 8,
    delay: Math.random() * 6,
    opacity: 0.3 + Math.random() * 0.5,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
  }));
}

const PARTICLES = makeParticles();

export default function TheaterMode({ movie, themeColor, onClose }: TheaterModeProps) {
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [r, g, b] = themeColor;

  // Sequence: mount → short pause → open curtains → show content
  useEffect(() => {
    const t1 = setTimeout(() => setCurtainsOpen(true), 100);
    const t2 = setTimeout(() => setShowContent(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const backdropUrl = movie
    ? `${IMG_BASE}${movie.backdrop_path || movie.poster_path}`
    : "";


  return (
    <div className="theater_overlay" ref={overlayRef}>

      {/* ── Curtains ── */}
      <div className={`theater_curtain theater_curtain_left ${curtainsOpen ? "open" : ""}`} />
      <div className={`theater_curtain theater_curtain_right ${curtainsOpen ? "open" : ""}`} />

      {/* ── Backdrop with Ken Burns ── */}
      {backdropUrl && (
        <div
          className="theater_backdrop"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
      )}

      {/* ── Dark vignette overlay ── */}
      <div
        className="theater_vignette"
        style={{
          background: `radial-gradient(ellipse at center,
            rgba(0,0,0,0.1) 0%,
            rgba(0,0,0,0.55) 60%,
            rgba(0,0,0,0.88) 100%
          )`,
        }}
      />

      {/* ── Floating Particles ── */}
      <div className="theater_particles">
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className={`theater_particle theater_particle_${p.shape}`}
            style={{
              left: `${p.x}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              opacity: p.opacity,
              background:
                p.shape === "circle"
                  ? `rgba(${r}, ${g}, ${b}, ${p.opacity})`
                  : "none",
              borderColor: `rgba(${r}, ${g}, ${b}, ${p.opacity})`,
              boxShadow: `0 0 ${p.size * 2}px rgba(${r}, ${g}, ${b}, 0.6)`,
              color: `rgba(${r}, ${g}, ${b}, ${p.opacity})`,
            }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className={`theater_content ${showContent ? "visible" : ""}`}>
        {/* Genre tag */}
        {movie?.genre_ids?.length > 0 && (
          <div
            className="theater_genre_pill"
            style={{ borderColor: `rgba(${r},${g},${b},0.8)`, color: `rgba(${r},${g},${b},1)` }}
          >
            🎬 NOW PLAYING
          </div>
        )}

        {/* Title */}
        <h1
          className="theater_title"
          style={{
            textShadow: `0 0 60px rgba(${r},${g},${b},0.9), 0 0 120px rgba(${r},${g},${b},0.4)`,
          }}
        >
          {movie?.title || movie?.name || ""}
        </h1>

        {/* Overview */}
        <p className="theater_overview">{movie?.overview}</p>

        {/* Rating */}
        {movie?.vote_average && (
          <div className="theater_meta">
            <span className="theater_rating">
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
            <span className="theater_year">
              {(movie.release_date || movie.first_air_date || "").slice(0, 4)}
            </span>
          </div>
        )}
      </div>

      {/* ── Exit Button ── */}
      <button
        className="theater_exit"
        onClick={onClose}
        style={{ borderColor: `rgba(${r},${g},${b},0.5)` }}
      >
        ✕ Exit Theater
      </button>

      {/* ── ESC hint ── */}
      <p className="theater_esc_hint">Press ESC to exit</p>
    </div>
  );
}
