import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import Row from "./components/Row";
import { requests } from "./api";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Banner />
      <Row title="Trending Now" fetchUrl={requests.fetchTrending} />
    </div>
  );
}

export default App;
