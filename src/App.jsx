import { useState, useEffect } from "react";
import Search from "./components/search";
import Spinner from "./components/spinner";
import MoviesCards from "./components/MoviesCards";
import { useDebounce } from "./useDebounce";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);

  const BASE_URL = "https://api.themoviedb.org/3";
  const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;
  const API_OPTION = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      accept: "application/json",
    },
  };

  // ✅ Only one debounced variable
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      const endpoint = query
        ? `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const res = await fetch(endpoint, API_OPTION);
      if (!res.ok) throw new Error(`Failed to fetch movies: ${res.status}`);

      const data = await res.json();
      if (data.Response === "False") {
        setErrorMsg(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0])
      }

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMsg("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadsTrendingMovies = async () => {
    try{
      const movies = await getTrendingMovies()

      setTrendingMovies(movies)
    }catch (error){
      console.error(`Error fetching trending movies ${error}`)
    }
  }

  // ✅ Debounce effect
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadsTrendingMovies()
  }, [])

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <div className="header flex justify-center items-center flex-col text-center min-h-[100vh]">
            <img src="./hero.png" alt="Hero Banner" className="max-w-[100%] h-auto" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>

          {console.log("Trending Movies", trendingMovies)}

          {trendingMovies?.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>

              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="all-movies text-white">
            <h2>All movies</h2>
            {isLoading ? (
              <Spinner />
            ) : errorMsg ? (
              <p className="text-red-500">{errorMsg}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MoviesCards key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
