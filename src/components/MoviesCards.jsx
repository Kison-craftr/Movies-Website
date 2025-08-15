function MoviesCards({movie : {title, vote_average, poster_path, original_language, release_date}}) {
  return(
    <div className="movie-card cursor-pointer">
        <img src={poster_path ? `https://images.tmdb.org/t/p/w500/${poster_path}` : `no-movie.png`} alt="Movie Poster" />

        <div className="mt-4">
            <h3>{title}</h3>
            <div className="content">
                <div className="rating">
                    <img src="star.svg" alt="Rating" />
                    <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                </div>
                <span>.</span>
                <p className="lang">{original_language}</p>

                <span>.</span>
                <p className="years">{release_date ? release_date.split('-')[0] : "N/A"}</p>
            </div>
        </div>
    </div>
  )
}

export default MoviesCards
