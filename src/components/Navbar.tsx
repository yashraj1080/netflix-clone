import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_URL, requests } from "../api";
import "./Navbar.css";

interface NavbarProps {
  onMovieSelect: (movie: any) => void;
  activeNav: string;
  onNavSelect: (tab: string) => void;
}

const IMG_BASE = "https://image.tmdb.org/t/p/w92";

const NAV_LINKS = [
  "Home",
  "Shows",
  "Movies",
  "Games",
  "New & Popular",
  "My List",
  "Browse by Languages",
];

function Navbar({ onMovieSelect, activeNav, onNavSelect }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  /* ── Focus input on open ── */
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  /* ── Close on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Debounced fetch ── */
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await axios.get(`${BASE_URL}${requests.fetchSearch(query)}`);
        const filtered = res.data.results.filter(
          (item: any) =>
            (item.media_type === "movie" || item.media_type === "tv") &&
            (item.poster_path || item.backdrop_path)
        );
        setResults(filtered.slice(0, 8));
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
  };

  const handleSelect = (movie: any) => {
    onMovieSelect(movie);
    closeSearch();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="navbar">
      {/* ── Left: logo + nav links ── */}
      <div className="navbar_left">
        <span className="navbar_logo">NETFLIX</span>
        <ul className="navbar_links">
          {NAV_LINKS.map((link) => (
            <li
              key={link}
              className={`navbar_link ${activeNav === link ? "active" : ""}`}
              onClick={() => onNavSelect(link)}
            >
              {link}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Right: search + icons ── */}
      <div className="navbar_right">

        {/* Search */}
        <div className="navbar_search" ref={searchRef}>
          <div className={`navbar_search_box ${searchOpen ? "open" : ""}`}>
            {searchOpen && (
              <input
                ref={inputRef}
                className="navbar_search_input"
                type="text"
                placeholder="Titles, people, genres"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && closeSearch()}
              />
            )}
            <button
              className="navbar_icon_btn"
              onClick={() => (searchOpen && !query ? closeSearch() : setSearchOpen(true))}
              aria-label="Search"
            >
              {/* Magnifier SVG */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="navbar_svg">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>

          {/* Dropdown results */}
          {searchOpen && query && (
            <div className="navbar_search_dropdown">
              {loading && (
                <div className="navbar_search_loading">
                  <div className="navbar_spinner" />
                </div>
              )}
              {!loading && results.length === 0 && (
                <p className="navbar_no_results">No results for "{query}"</p>
              )}
              {!loading && results.map((item) => (
                <div
                  key={item.id}
                  className="navbar_result"
                  onClick={() => handleSelect(item)}
                >
                  <img
                    className="navbar_result_img"
                    src={`${IMG_BASE}${item.poster_path || item.backdrop_path}`}
                    alt={item.title || item.name}
                  />
                  <div className="navbar_result_info">
                    <span className="navbar_result_title">
                      {item.title || item.name}
                    </span>
                    <span className="navbar_result_meta">
                      <span className={`navbar_badge ${item.media_type}`}>
                        {item.media_type === "movie" ? "Movie" : "TV"}
                      </span>
                      {(item.release_date || item.first_air_date || "").slice(0, 4)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Children label */}
        <span className="navbar_children">Children</span>

        {/* Bell icon */}
        <button className="navbar_icon_btn" aria-label="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="navbar_svg">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        {/* Avatar + caret */}
        <div className="navbar_avatar_wrap">
          <img
            className="navbar_avatar"
            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
            alt="avatar"
          />
          {/* Down caret */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="navbar_caret">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
