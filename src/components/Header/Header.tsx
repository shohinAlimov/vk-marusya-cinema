/* Main Imports */
import type React from "react"
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthModal } from "../AuthModal/AuthModal";
import { useAuth } from "../../contexts/AuthContext";

/* Styles & UI */
import "./Header.scss";
import { SearchDropdown } from '../../ui/SearchDropdown/SearchDropdown';

/* Images & Icons */
import VkMarusyaLogo from '../../assets/images/vk-marusya-logo.svg?react';
import SearchIcon from '../../assets/images/icon-search.svg?react';
import GenresIcon from '../../assets/images/icon-genres.svg?react';
import UserIcon from '../../assets/images/icon-user.svg?react';
import CloseIcon from '../../assets/images/icon-delete.svg?react';
import useMediaQuery from "../../hooks/useMediaQuery";

const Header: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, isLoading } = useAuth();

  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 500px)');
  const isLoggedIn = !isLoading && user;

  useEffect(() => {
    if (user && isAuthOpen) {
      setIsAuthOpen(false);
    }
  }, [user, isAuthOpen]);

  // Блокировка скролла при открытом полноэкранном поиске
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  const handleSearchFocus = () => {
    if (isTablet) {
      setIsSearchOpen(true);
    }
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleMobileSearchClick = () => {
    setIsSearchOpen(true);
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <Link className="header__logo-link" to="/">
              <VkMarusyaLogo className="header__logo-icon" width={143} height={32} aria-hidden="true" />
            </Link>

            <div className="header__center">
              <nav className="header__nav">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
                  }
                >
                  Главная
                </NavLink>
                <NavLink
                  to="/genres"
                  className={({ isActive }) =>
                    `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
                  }
                >
                  Жанры
                </NavLink>
              </nav>

              {!isMobile && (
                <div className="header__search-wrapper">
                  <div className="header__search">
                    <SearchIcon className="header__search-icon" width={24} height={24} aria-hidden="true" />
                    <input
                      type="text"
                      placeholder="Поиск"
                      className="header__search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={handleSearchFocus}
                    />
                  </div>

                  {!isSearchOpen && (
                    <SearchDropdown
                      query={searchQuery}
                      onClose={() => setSearchQuery('')}
                    />
                  )}
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <NavLink
                className={({ isActive }) =>
                  `header__user-link ${isActive ? 'header__user-link--active' : ''}`
                }
                to="/account"
              >
                {user.surname}
              </NavLink>
            ) : (
              <button
                className="header__login-btn"
                onClick={() => setIsAuthOpen(true)}
                aria-label="Войти в аккаунт"
                title="Войти"
              >
                Войти
              </button>
            )}

            {isAuthOpen && (
              <AuthModal isOpen onClose={() => setIsAuthOpen(false)} />
            )}

            <div className="header__actions">
              <Link className="header__actions-link" to="/genres">
                <GenresIcon className="header__actions-icon" width={24} height={24} aria-hidden="true" />
              </Link>

              <button
                className="header__btn header__btn-search"
                onClick={handleMobileSearchClick}
                aria-label="Открыть поисковую строку"
                title="Поиск"
              >
                <SearchIcon className="header__actions-icon" width={24} height={24} aria-hidden="true" />
              </button>

              {isLoggedIn ? (
                <Link className="header__btn header__btn-user" to="/account">
                  <UserIcon className="header__actions-icon" width={24} height={24} aria-hidden="true" />
                </Link>
              ) : (
                <button
                  className="header__btn header__btn-user"
                  onClick={() => setIsAuthOpen(true)}
                  aria-label="Открыть аккаунт"
                  title="Аккаунт"
                >
                  <UserIcon className="header__actions-icon" width={24} height={24} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Полноэкранный поиск */}
      {isTablet && isSearchOpen && (
        <div className="fullscreen-search">
          <div className="fullscreen-search__overlay" onClick={handleSearchClose} />
          <div className="fullscreen-search__header">
            <div className="fullscreen-search__input-wrapper">
              <SearchIcon className="fullscreen-search__icon" width={24} height={24} aria-hidden="true" />
              <input
                type="text"
                placeholder="Поиск"
                className="fullscreen-search__input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                className="fullscreen-search__close"
                onClick={handleSearchClose}
                aria-label="Закрыть поиск"
              >
                <CloseIcon width={24} height={24} aria-hidden={true} />
              </button>
            </div>

          </div>

          <div className="fullscreen-search__results">
            <SearchDropdown
              query={searchQuery}
              onClose={handleSearchClose}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;