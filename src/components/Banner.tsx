import "./Banner.css";

function Banner() {
  return (
    <header className="banner">
      <div className="banner_contents">
        <h1 className="banner_title">Stranger Things</h1>

        <div className="banner_buttons">
          <button className="banner_button">Play</button>
          <button className="banner_button">My List</button>
        </div>

        <p className="banner_description">
          When a young boy disappears, his mother, a police chief,
          and his friends confront terrifying supernatural forces
          in order to get him back.
        </p>
      </div>

      <div className="banner_fadeBottom" />
    </header>
  );
}

export default Banner;
