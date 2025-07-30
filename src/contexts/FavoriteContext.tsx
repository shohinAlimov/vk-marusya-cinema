import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiService } from '../services/api';
import type { Movie } from '../types/movie';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: Movie[];
  isLoading: boolean;
  isFavorite: (movieId: number) => boolean;
  addToFavorites: (movieId: number) => Promise<void>;
  removeFromFavorites: (movieId: number) => Promise<void>;
  toggleFavorite: (movieId: number) => Promise<void>;
  loadFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Загрузка избранных фильмов
  const loadFavorites = async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    setIsLoading(true);
    try {
      const favoritesData = await apiService.getFavorites();
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Ошибка при загрузке избранных:', error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Проверка, является ли фильм избранным
  const isFavorite = (movieId: number): boolean => {
    return favorites.some(movie => movie.id === movieId);
  };

  // Добавление фильма в избранное
  const addToFavorites = async (movieId: number) => {
    if (!user) {
      throw new Error('Необходимо войти в систему');
    }

    try {
      await apiService.addToFavorites(movieId);
      // Перезагружаем список избранных
      await loadFavorites();
    } catch (error) {
      throw error;
    }
  };

  // Удаление фильма из избранного
  const removeFromFavorites = async (movieId: number) => {
    if (!user) {
      throw new Error('Необходимо войти в систему');
    }

    try {
      await apiService.removeFromFavorites(movieId);
      // Перезагружаем список избранных
      await loadFavorites();
    } catch (error) {
      throw error;
    }
  };

  // Переключение состояния избранного
  const toggleFavorite = async (movieId: number) => {
    if (!user) {
      throw new Error('Необходимо войти в систему');
    }

    try {
      if (isFavorite(movieId)) {
        await removeFromFavorites(movieId);
      } else {
        await addToFavorites(movieId);
      }
    } catch (error) {
      throw error;
    }
  };

  // Загружаем избранные при авторизации пользователя
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const value: FavoritesContextType = {
    favorites,
    isLoading,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    loadFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};