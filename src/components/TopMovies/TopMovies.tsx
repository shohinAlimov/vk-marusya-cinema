
import React, { useState, useEffect } from 'react';
import type { Movie } from '../../types/movie';
import { apiService } from '../../services/api';
import './TopMovies.scss';
import Loader from '../../ui/Loader/Loader';
import FilmCard from '../../ui/FilmCard/FilmCard';

import { SwiperSlide } from 'swiper/react';
import Slider from '../../ui/Slider/Slider';

interface TopMoviesProps {
  onMovieClick?: (movieId: number) => void;
}

export const TopMovies: React.FC<TopMoviesProps> = ({ onMovieClick }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopMovies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const topMovies = await apiService.getTopMovies(10);
      setMovies(topMovies);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopMovies();
  }, []);

  const handleMovieClick = (movieId: number) => {
    if (onMovieClick) {
      onMovieClick(movieId);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Ошибка: {error}</div>;
  if (!movies) return <div>Фильмы не найдены</div>;

  return (
    <div className="top-movies">
      <div className="container">
        <h2 className="top-movies__title">Топ 10 фильмов</h2>
        <div className="top-movies__grid">
          {movies.map((movie, index) => (
            <FilmCard key={movie.id} movie={movie} index={index} onClick={handleMovieClick} />
          ))}
        </div>
      </div>

      <Slider>
        {movies.map((movie, index) => (
          <SwiperSlide key={movie.id} className='top-movies__slide'>
            <FilmCard
              movie={movie}
              index={index}
              onClick={handleMovieClick} />
          </SwiperSlide>
        ))}
      </Slider>
    </div >
  );
};