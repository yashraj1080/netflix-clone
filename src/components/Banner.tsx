import "./Banner.css";

interface BannerProps {
  movie: any;
}

const base_url = "https://image.tmdb.org/t/p/original";

function Banner({ movie }: BannerProps) {
  if (!movie) return null;

  return (
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
          <button className="banner_button">Play</button>
          <button className="banner_button">My List</button>
        </div>

        <h1 className="banner_description">
          {movie.overview}
        </h1>
      </div>

      <div className="banner_fadeBottom" />
    </header>
  );
}

export default Banner;
