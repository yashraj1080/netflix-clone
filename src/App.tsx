import { useState } from "react";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import Row from "./components/Row";
import { requests } from "./api";
import "./App.css";

function App() {
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  return (
    <div className="app">
      <Navbar />
      <Banner movie={selectedMovie} />

      <Row
        title="Netflix Originals"
        fetchUrl={requests.fetchNetflixOriginals}
        isLargeRow
        onMovieSelect={setSelectedMovie}
      />

      <Row
        title="Trending Now"
        fetchUrl={requests.fetchTrending}
        onMovieSelect={setSelectedMovie}
      />

      <Row
        title="Top Rated"
        fetchUrl={requests.fetchTopRated}
        onMovieSelect={setSelectedMovie}
      />

      <Row
        title="Action Movies"
        fetchUrl={requests.fetchActionMovies}
        onMovieSelect={setSelectedMovie}
      />

      <Row
        title="Comedy Movies"
        fetchUrl={requests.fetchComedyMovies}
        onMovieSelect={setSelectedMovie}
      />

      <Row
        title="Horror Movies"
        fetchUrl={requests.fetchHorrorMovies}
        onMovieSelect={setSelectedMovie}
      />

      <Row
        title="Romance Movies"
        fetchUrl={requests.fetchRomanceMovies}
        onMovieSelect={setSelectedMovie}
      />
    </div>
  );
}

export default App;
