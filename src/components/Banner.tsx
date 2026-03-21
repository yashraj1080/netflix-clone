import { useState } from "react";
import axios from "axios";
import movieTrailer from "movie-trailer";
import YouTube from "react-youtube";
import TheaterMode from "./TheaterMode";
import "./Banner.css";

interface BannerProps {
  movie: any;
  themeColor: [number, number, number];
  isInList: boolean;
  onToggleMyList: () => void;
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const base_url = "https://image.tmdb.org/t/p/original";

function Banner({ movie, themeColor, isInList, onToggleMyList }: BannerProps) {
  const [trailerUrl, setTrailerUrl] = useState<string>("");
  const [theaterOpen, setTheaterOpen] = useState(false);

  if (!movie) return null;

  const handlePlay = async () => {
    if (trailerUrl) {
      setTrailerUrl("");
      return;
    }
    const title = movie?.title || movie?.name || movie?.original_name;
    try {
      // First try TMDB videos API (most reliable when it works)
      const isTv = movie.media_type === "tv" || (!movie.release_date && movie.first_air_date);
      const mediaType = isTv ? "tv" : "movie";
      const response = await axios.get(
        `https://api.themoviedb.org/3/${mediaType}/${movie.id}/videos?api_key=${API_KEY}`
      );
      const videos: any[] = response.data.results.filter((v: any) => v.site === "YouTube");
      const pick =
        videos.find((v) => v.type === "Trailer") ||
        videos.find((v) => v.type === "Teaser") ||
        videos[0];
      if (pick) {
        setTrailerUrl(pick.key);
        return;
      }
    } catch (_) { /* fall through to movie-trailer */ }

    // Fallback: movie-trailer package searches by title
    try {
      const url = await movieTrailer(title || "");
      if (url) {
        // Extract YouTube video ID from the URL
        const urlParams = new URLSearchParams(new URL(url).search);
        const videoId = urlParams.get("v");
        if (videoId) { setTrailerUrl(videoId); return; }
      }
    } catch (_) { /* ignore */ }

    alert("Trailer not available for this title");
  };

  return (
    <>
      <header
        className="banner"
        style={{
          backgroundImage: `url(${base_url}${movie.backdrop_path || movie.poster_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >
        <div className="banner_contents">
          <h1 className="banner_title">
            {movie.title || movie.name || movie.original_name}
          </h1>

          <div className="banner_buttons">
            <button className="banner_button" onClick={handlePlay}>
              {trailerUrl ? "Close" : "▶ Play"}
            </button>
            <button className="banner_button" onClick={() => setTheaterOpen(true)}>
              🎭 Theater Mode
            </button>
            <button
              className={`banner_button ${isInList ? "banner_button_in_list" : ""}`}
              onClick={onToggleMyList}
            >
              {isInList ? "✓ In My List" : "＋ My List"}
            </button>
          </div>

          <h1 className="banner_description">{movie.overview}</h1>
        </div>

        <div className="banner_fadeBottom" />
      </header>

      {/* Trailer modal */}
      {trailerUrl && (
        <div className="trailer_modal" onClick={() => setTrailerUrl("")}>
          <div className="trailer_content" onClick={(e) => e.stopPropagation()}>
            <YouTube
              videoId={trailerUrl}
              opts={{
                height: "390",
                width: "100%",
                playerVars: { autoplay: 1 },
              }}
            />
          </div>
        </div>
      )}

      {/* Theater Mode */}
      {theaterOpen && (
        <TheaterMode
          movie={movie}
          themeColor={themeColor}
          onClose={() => setTheaterOpen(false)}
        />
      )}
    </>
  );
}

export default Banner;
