import { useState } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import "./Banner.css";

interface BannerProps {
  movie: any;
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const base_url = "https://image.tmdb.org/t/p/original";

function Banner({ movie }: BannerProps) {
  const [trailerUrl, setTrailerUrl] = useState<string>("");

  if (!movie) return null;

  const handlePlay = async () => {
    if (trailerUrl) {
      setTrailerUrl("");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`
      );

      const trailers = response.data.results;

      const officialTrailer = trailers.find(
        (video: any) =>
          video.type === "Trailer" && video.site === "YouTube"
      );

      if (officialTrailer) {
        setTrailerUrl(officialTrailer.key);
      } else {
        alert("Trailer not available");
      }
    } catch (error) {
      console.log("Error fetching trailer:", error);
    }
  };

  return (
    <>
      <header
        className="banner"
        style={{
          backgroundImage: `url(${base_url}${
            movie.backdrop_path || movie.poster_path
          })`,
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
              {trailerUrl ? "Close" : "Play"}
            </button>
            <button className="banner_button">My List</button>
          </div>

          <h1 className="banner_description">{movie.overview}</h1>
        </div>

        <div className="banner_fadeBottom" />
      </header>

      {trailerUrl && (
        <div className="trailer_modal" onClick={() => setTrailerUrl("")}>
          <div
            className="trailer_content"
            onClick={(e) => e.stopPropagation()}
          >
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
    </>
  );
}

export default Banner;
