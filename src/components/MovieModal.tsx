import "./MovieModal.css";

interface MovieModalProps {
  movie: any;
  onClose: () => void;
}

const base_url = "https://image.tmdb.org/t/p/original";

function MovieModal({ movie, onClose }: MovieModalProps) {
  if (!movie) return null;

  return (
    <div className="modal_overlay" onClick={onClose}>
      <div
        className="modal_content"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          className="modal_image"
          src={`${base_url}${movie.backdrop_path || movie.poster_path}`}
          alt={movie.title}
        />

        <div className="modal_info">
          <h2>{movie.title || movie.name}</h2>
          <p><strong>Rating:</strong> ⭐ {movie.vote_average}</p>
          <p><strong>Release:</strong> {movie.release_date || movie.first_air_date}</p>
          <p className="modal_overview">{movie.overview}</p>

          <button className="modal_close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
