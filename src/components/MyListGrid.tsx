import "./MyListGrid.css";

interface MyListGridProps {
  movies: any[];
  onMovieSelect: (movie: any) => void;
  onRemove: (movie: any) => void;
}

const IMG_BASE = "https://image.tmdb.org/t/p/w300";

export default function MyListGrid({ movies, onMovieSelect, onRemove }: MyListGridProps) {
  if (movies.length === 0) {
    return (
      <div className="mylist_empty">
        <div className="mylist_empty_inner">
          <span className="mylist_empty_icon">📋</span>
          <h2>Your list is empty</h2>
          <p>Browse movies and hit <strong>＋ My List</strong> to save them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mylist_section">
      <h2 className="mylist_heading">
        My List <span className="mylist_count">{movies.length}</span>
      </h2>
      <div className="mylist_grid">
        {movies.map((movie) => (
          <div key={movie.id} className="mylist_card" onClick={() => onMovieSelect(movie)}>
            <img
              className="mylist_poster"
              src={`${IMG_BASE}${movie.poster_path || movie.backdrop_path}`}
              alt={movie.title || movie.name}
            />
            <div className="mylist_card_overlay">
              <span className="mylist_card_title">{movie.title || movie.name}</span>
              <div className="mylist_card_actions">
                <button
                  className="mylist_card_play"
                  onClick={(e) => { e.stopPropagation(); onMovieSelect(movie); }}
                >
                  ▶
                </button>
                <button
                  className="mylist_card_remove"
                  title="Remove from My List"
                  onClick={(e) => { e.stopPropagation(); onRemove(movie); }}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
