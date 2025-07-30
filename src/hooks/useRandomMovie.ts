import { useState, useEffect, useCallback, useRef } from 'react';
import type { Movie } from '../types/movie';
import { apiService } from '../services/api';

interface UseRandomMovieReturn {
  movie: Movie | null;
  isLoading: boolean;
  error: string | null;
  refetchMovie: () => void;
}

export const useRandomMovie = (): UseRandomMovieReturn => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchRandomMovie = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const randomMovie = await apiService.getRandomMovie();
      setMovie(randomMovie);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
      setError(errorMessage);
      console.error('Ошибка при получении случайного фильма:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetchMovie = useCallback(() => {
    fetchRandomMovie();
  }, [fetchRandomMovie]);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchRandomMovie();
      hasFetched.current = true;
    }
  }, [fetchRandomMovie]);

  return {
    movie,
    isLoading,
    error,
    refetchMovie,
  };
};