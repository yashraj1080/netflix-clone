import { useEffect, useState } from "react";
import axios from "axios";
import "./Row.css";

interface RowProps {
  title: string;
  fetchUrl: string;
  isLargeRow?: boolean;
  onMovieSelect?: (movie: any) => void;
}

const base_url = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchUrl, isLargeRow, onMovieSelect }: RowProps) {
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const request = await axios.get(
        `https://api.themoviedb.org/3${fetchUrl}`
      );
      setMovies(request.data.results);
    };

    fetchData();
  }, [fetchUrl]);

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row_posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            className={`row_poster ${isLargeRow ? "row_posterLarge" : ""}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.title || movie.name}
            onClick={() => onMovieSelect && onMovieSelect(movie)}
          />
        ))}
      </div>
    </div>
  );
}

export default Row;
