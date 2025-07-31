import React, { useEffect, useState } from "react";
import "./GenresPage.scss";
import { apiService } from "../../services/api";
import GenresCard from "../../ui/GenresCard/GenresCard";
import FilmCard from "../../ui/FilmCard/FilmCard";
import type { Movie } from "../../types/movie";
import IconChevron from "../../assets/icons/icon-chevron.svg?react";
import { useNavigate } from "react-router-dom";
import Loader from "../../ui/Loader/Loader";
import { motion } from "motion/react";

const MOVIES_PER_PAGE = 10;

const GenresPage: React.FC = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setIsLoading(true);
        const genresData = await apiService.getGenres();
        const moviesData = await apiService.getMovies();
        setGenres(genresData);
        setMovies(moviesData);
      } catch (error) {
        console.error("Ошибка при загрузке жанров:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const fetchMoviesByGenre = async (genre: string, page: number = 1) => {
    try {
      const moviesData = await apiService.getMoviesByGenre(
        genre,
        page,
        MOVIES_PER_PAGE
      );
      return moviesData;
    } catch (error) {
      console.error("Ошибка при загрузке фильмов по жанру:", error);
      return [];
    }
  };

  const handleGenreClick = async (genre: string) => {
    setSelectedGenre(genre);
    setIsLoading(true);
    setCurrentPage(1);
    setDisplayedMovies([]);
    setHasMoreMovies(true);

    try {
      const moviesData = await fetchMoviesByGenre(genre, 1);
      setDisplayedMovies(moviesData);

      // Если получили меньше фильмов чем MOVIES_PER_PAGE, значит это последняя страница
      if (moviesData.length < MOVIES_PER_PAGE) {
        setHasMoreMovies(false);
      }
    } catch (error) {
      console.error("Ошибка при загрузке фильмов:", error);
      setDisplayedMovies([]);
      setHasMoreMovies(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!selectedGenre || isLoadingMore) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const newMovies = await fetchMoviesByGenre(selectedGenre, nextPage);

      if (newMovies.length > 0) {
        setDisplayedMovies((prev) => [...prev, ...newMovies]);
        setCurrentPage(nextPage);

        // Если получили меньше фильмов чем MOVIES_PER_PAGE, значит это последняя страница
        if (newMovies.length < MOVIES_PER_PAGE) {
          setHasMoreMovies(false);
        }
      } else {
        setHasMoreMovies(false);
      }
    } catch (error) {
      console.error("Ошибка при загрузке дополнительных фильмов:", error);
      setHasMoreMovies(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  const handleBackToGenres = () => {
    setSelectedGenre(null);
    setDisplayedMovies([]);
    setCurrentPage(1);
    setHasMoreMovies(true);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 200 }}
      transition={{ duration: 0.5 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="genres-page"
    >
      <div className="container">
        {!selectedGenre && (
          <>
            <h1 className="genres-page__title">Жанры фильмов</h1>
            <div className="genres-page__grid-genres">
              {genres.map((genre) => (
                <GenresCard
                  key={genre}
                  genre={genre}
                  movies={movies}
                  onClick={() => handleGenreClick(genre)}
                />
              ))}
            </div>
          </>
        )}

        {selectedGenre && (
          <>
            <h1 className="genres-page__back-link" onClick={handleBackToGenres}>
              <IconChevron
                className="genres-page__back-icon"
                width={40}
                height={40}
                aria-hidden={true}
              />
              {selectedGenre}
            </h1>

            {displayedMovies.length === 0 ? (
              <p>Фильмы не найдены</p>
            ) : (
              <>
                <div className="genres-page__grid">
                  {displayedMovies.map((movie) => (
                    <FilmCard
                      key={movie.id}
                      movie={movie}
                      showRank={false}
                      onClick={() => handleMovieClick(movie.id)}
                    />
                  ))}
                </div>

                {hasMoreMovies && (
                  <div className="genres-page__load-more">
                    <button
                      className="btn btn--primary genres-page__load-more-btn"
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                    >
                      {isLoadingMore ? "Загрузка..." : "Показать ещё"}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default GenresPage;
