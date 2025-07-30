/* Important Imports */
import React, { useState } from 'react';

/* For Context */
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoriteContext';

/* Types */
import type { Movie } from '../../types/movie';

/* Style & UI */
import './FilmBanner.scss';
import Modal from '../Modal/Modal';
import Rating from '../Rating/Rating';
import { TrailerModal } from '../TrailerModal/TrailerModal';


/* Images & Icons */
import FavouriteIcon from "../../assets/images/icon-favorite.svg?react";
import RepeatIcon from "../../assets/images/icon-repeat.svg?react";

interface FilmBannerProps {
  movie: Movie;
  onDetailsClick?: () => void;
  onRefreshRequest?: () => void;
  showRefresh?: boolean;
  showDetails?: boolean;
  className?: string;
  row?: boolean
}

export const FilmBanner: React.FC<FilmBannerProps> = ({
  movie,
  onDetailsClick,
  onRefreshRequest,
  showRefresh = false,
  showDetails = true,
  className = '',
  row = false
}) => {
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const isMovieFavorite = isFavorite(movie.id);

  const handleTrailerClick = () => {
    setIsTrailerOpen(true);
  };

  // Обработчик для кнопки "Избранное"
  const handleFavoriteToggle = async () => {
    if (!user) {
      setFavoriteError('Необходимо войти в систему для добавления в избранное');
      setIsModalOpen(true);
      return;
    }

    try {
      await toggleFavorite(movie.id);
    } catch (error) {
      setFavoriteError(error instanceof Error ? error.message : 'Ошибка при работе с избранным');
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  return (
    <div className={`film-banner ${className}`}>
      <div className="film-banner__wrapper">
        <div className='film-banner__inner'>
          <div className="film-banner__info">
            <div className="film-banner__overlay">
              <Rating movie={movie} />
              <span className="film-banner__notes">
                {movie.releaseYear}
              </span>
              <span className="film-banner__notes">
                {movie.genres.join(', ')}
              </span>
              <span className="film-banner__notes">
                {movie.runtime} мин
              </span>
            </div>
            <h2 className="film-banner__title">{movie.title}</h2>
            <p className="film-banner__plot">{movie.plot}</p>
          </div>
          <div className={`film-banner__actions ${row && ("film-banner__actions--row")}`}>
            <button
              className="btn btn--primary film-banner__btn-trailer"
              onClick={handleTrailerClick}
              aria-label="Открыть трейлер"
            >
              Трейлер
            </button>
            <TrailerModal
              isOpen={isTrailerOpen}
              onClose={() => setIsTrailerOpen(false)}
              youtubeUrl={movie.trailerUrl}
              title={movie.title}
            />

            {showDetails && onDetailsClick && (
              <button
                className="btn btn--secondary film-banner__btn-about"
                onClick={onDetailsClick}
                aria-label="Подробнее о фильме"
              >
                О фильме
              </button>
            )}

            <button
              className={`film-banner__btn ${isMovieFavorite ? 'film-banner__btn--active' : ''}`}
              onClick={handleFavoriteToggle}
              disabled={isFavoriteLoading}
              aria-label={isMovieFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
            >
              <FavouriteIcon className='film-banner__favorite-icon' width={24} height={24} />
            </button>
            {favoriteError && isModalOpen && (
              <Modal
                showLogo={false}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} >
                <h2 className='film-banner__error-title'>Войдите в систему</h2>
                <p className='film-banner__error-value'>{favoriteError}</p>
              </Modal>
            )}

            {showRefresh && onRefreshRequest && (
              <button
                className="btn btn--secondary btn--secondary-S film-banner__btn-random"
                onClick={onRefreshRequest}
                aria-label="Обновить"
              >
                <RepeatIcon width={24} height={24} />
              </button>
            )}
          </div>
        </div>
        <img
          className="film-banner__poster"
          src={movie.posterUrl}
          alt={`Постер фильма "${movie.title}"`}
        />
      </div>
    </div >
  );
};