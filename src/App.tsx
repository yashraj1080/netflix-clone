import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import Row from "./components/Row";
import MyListGrid from "./components/MyListGrid";
import { requests } from "./api";
import { useThemeColor } from "./hooks/useThemeColor";
import { useMyList } from "./hooks/useMyList";
import "./App.css";

type NavTab = "Home" | "Shows" | "Movies" | "Games" | "New & Popular" | "My List" | "Browse by Languages";

function App() {
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [activeNav, setActiveNav] = useState<NavTab>("Home");

  // ── Cinematic Glow ─────────────────────────────
  const [r, g, b] = useThemeColor(selectedMovie);
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--theme-r", String(r));
    root.style.setProperty("--theme-g", String(g));
    root.style.setProperty("--theme-b", String(b));
  }, [r, g, b]);

  // ── My List ────────────────────────────────────
  const { myList, toggle, isInList } = useMyList();

  const handleToggleMyList = () => {
    if (selectedMovie) toggle(selectedMovie);
  };

  // Pick a movie from My List as banner if nothing is selected
  const handleSelectFromList = (movie: any) => {
    setSelectedMovie(movie);
    setActiveNav("Home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderRows = () => {
    switch (activeNav) {
      case "Shows":
        return <Row title="Netflix Originals" fetchUrl={requests.fetchNetflixOriginals} isLargeRow onMovieSelect={setSelectedMovie} />;

      case "Movies":
        return (
          <>
            <Row title="Top Rated" fetchUrl={requests.fetchTopRated} onMovieSelect={setSelectedMovie} />
            <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} onMovieSelect={setSelectedMovie} />
            <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} onMovieSelect={setSelectedMovie} />
            <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} onMovieSelect={setSelectedMovie} />
            <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} onMovieSelect={setSelectedMovie} />
          </>
        );

      case "New & Popular":
        return <Row title="Trending Now" fetchUrl={requests.fetchTrending} onMovieSelect={setSelectedMovie} />;

      case "My List":
        return (
          <MyListGrid
            movies={myList}
            onMovieSelect={handleSelectFromList}
            onRemove={toggle}
          />
        );

      case "Games":
      case "Browse by Languages":
        return (
          <div className="coming_soon">
            <div className="coming_soon_inner">
              <span className="coming_soon_icon">🎬</span>
              <h2>Coming Soon</h2>
              <p>This section is under construction. Check back later!</p>
            </div>
          </div>
        );

      default:
        return (
          <>
            <Row title="Netflix Originals" fetchUrl={requests.fetchNetflixOriginals} isLargeRow onMovieSelect={setSelectedMovie} />
            <Row title="Trending Now" fetchUrl={requests.fetchTrending} onMovieSelect={setSelectedMovie} />
            <Row title="Top Rated" fetchUrl={requests.fetchTopRated} onMovieSelect={setSelectedMovie} />
            <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} onMovieSelect={setSelectedMovie} />
            <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} onMovieSelect={setSelectedMovie} />
            <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} onMovieSelect={setSelectedMovie} />
            <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} onMovieSelect={setSelectedMovie} />
          </>
        );
    }
  };

  return (
    <div className="app">
      <Navbar
        onMovieSelect={setSelectedMovie}
        activeNav={activeNav}
        onNavSelect={(tab) => setActiveNav(tab as NavTab)}
      />
      <Banner
        movie={selectedMovie}
        themeColor={[r, g, b]}
        isInList={isInList(selectedMovie?.id ?? -1)}
        onToggleMyList={handleToggleMyList}
      />
      {renderRows()}
    </div>
  );
}

export default App;
