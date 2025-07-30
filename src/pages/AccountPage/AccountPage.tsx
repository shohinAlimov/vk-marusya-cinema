import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoriteContext';
import { Navigate, useNavigate } from 'react-router-dom';
import Loader from '../../ui/Loader/Loader';
import './AccountPage.scss';
import FilmCard from '../../ui/FilmCard/FilmCard';


import IconFavorite from "../../assets/images/icon-favorite-settings.svg?react";
import IconUser from "../../assets/images/icon-user.svg?react";
import IconEmail from "../../assets/images/icon-email.svg?react";
import useMediaQuery from '../../hooks/useMediaQuery';
import Slider from '../../ui/Slider/Slider';
import { SwiperSlide } from 'swiper/react';

const AccountPage: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const { favorites, isLoading: favoritesLoading, toggleFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<'favorites' | 'settings'>('favorites');
  const navigate = useNavigate();

  const isMobile = useMediaQuery('(max-width: 767px)')

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  const handleRemoveFromFavorites = async (movieId: number) => {
    try {
      await toggleFavorite(movieId);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-page__content">
          <h1 className="account-page__title">Мой аккаунт</h1>

          <div className="account-page__tabs">
            <button
              className={`account-page__tab-btn ${activeTab === 'favorites' ? 'account-page__tab-btn--active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              <IconFavorite className='account-page__favorite-icon' width={24} height={24} aria-hidden={true} />
              {isMobile ? (
                <span>Избранное</span>
              ) : (
                <span>Избранные фильмы</span>
              )}
            </button>
            <button
              className={`account-page__tab-btn ${activeTab === 'settings' ? 'account-page__tab-btn--active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <IconUser className='account-page__user-icon' width={24} height={24} aria-hidden={true} />
              {isMobile ? (
                <span>Настройки</span>
              ) : (
                <span>Настройка аккаунта</span>
              )}
            </button>
          </div>

          <div className="account-page__tab-content">
            {activeTab === 'favorites' && (
              <div className="account-page__favorites">
                {favoritesLoading ? (
                  <Loader />
                ) : favorites.length > 0 ? (
                  <div className="account-page__favorites-grid">
                    {favorites.map((movie) => (
                      <FilmCard
                        key={movie.id}
                        movie={movie}
                        showRank={false}
                        showDeleteButton={true}
                        onDelete={() => handleRemoveFromFavorites(movie.id)}
                        onClick={() => handleMovieClick(movie.id)} />
                    ))}
                  </div>

                ) : (
                  <div className="account-page__empty-favorites">
                    <p className='account-page__note'>У вас пока нет избранных фильмов</p>
                    <button
                      className="btn btn--primary "
                      onClick={() => navigate('/')}
                    >
                      Найти фильмы
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="account-page__settings">
                <div className="account-page__info">
                  <div className="account-page__field">
                    <div className='account-page__field-logo'>
                      {user.name.charAt(0)}
                      {user.surname.charAt(0)}
                    </div>
                    <div className='account-page__field-info'>
                      <span className="account-page__field-label">Имя Фамилия</span>
                      <span className="account-page__field-value">{user.name} {user.surname}</span>
                    </div>
                  </div>
                  <div className="account-page__field">
                    <div className='account-page__field-logo'>
                      <IconEmail width={24} height={24} aria-hidden={true} />
                    </div>
                    <div className='account-page__field-info'>
                      <span className="account-page__field-label">Электронная почта</span>
                      <span className="account-page__field-value">{user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="account-page__actions">
                  <button
                    className="btn btn--primary account-page__logout"
                    onClick={handleLogout}
                  >
                    Выйти из аккаунта
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {favorites.length > 0 && (
        <Slider autoPlay={false}>
          {favorites.map((movie) => (
            <SwiperSlide key={movie.id} className='top-movies__slide'>
              <FilmCard
                movie={movie}
                showRank={false}
                showDeleteButton={true}
                onDelete={() => handleRemoveFromFavorites(movie.id)}
                onClick={() => handleMovieClick(movie.id)} />
            </SwiperSlide>
          ))}
        </Slider>
      )}
    </div >
  );
};

export default AccountPage;