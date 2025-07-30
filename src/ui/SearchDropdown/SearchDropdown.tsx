/* Important Imports */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* API & Types */
import { apiService } from '../../services/api';
import type { Movie } from '../../types/movie';

/* UI */
import DropdownCard from '../DropdownCard/DropdownCard';

/* Styles */
import './SearchDropdown.scss';

/* Hooks */
import useMediaQuery from '../../hooks/useMediaQuery';

/* Slider */
import Slider from '../Slider/Slider';
import { SwiperSlide } from 'swiper/react';

interface SearchDropdownProps {
  query: string;
  onClose: () => void;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({ query, onClose }) => {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery('(max-width: 500px)');
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      setIsLoading(true);
      const searchMovies = async () => {
        try {
          // Используем параметр title для поиска через API
          const movies = await apiService.searchMovies(query);
          // Ограничиваем результаты до 5 фильмов
          setSearchResults(movies.slice(0, 5));
        } catch (err) {
          console.error('Ошибка поиска фильмов:', err);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      };

      searchMovies();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (id: number) => {
    navigate(`/movie/${id}`);
    onClose();
  };

  if (!query) return null;

  if (isMobile) {
    return (
      <div className="search-dropdown search-dropdown--mobile">
        {isLoading ? (
          <div className="search-dropdown__loading">Загрузка...</div>
        ) : searchResults.length === 0 ? (
          <div className="search-dropdown__loading">Ничего не найдено</div>
        ) : (
          <Slider gap={16} className="search-dropdown__slider">
            {searchResults.map((movie) => (
              <SwiperSlide key={movie.id}>
                <div onClick={() => handleSelect(movie.id)}>
                  <DropdownCard movie={movie} />
                </div>
              </SwiperSlide>
            ))}
          </Slider>
        )}
      </div>
    );
  }

  return (
    <ul className="search-dropdown">
      {isLoading ? (
        <li className="search-dropdown__loading">Загрузка...</li>
      ) : searchResults.length === 0 ? (
        <li className="search-dropdown__loading">Ничего не найдено</li>
      ) : (
        searchResults.map((movie) => (
          <li
            key={movie.id}
            className="search-dropdown__item"
            onClick={() => handleSelect(movie.id)}
          >
            <DropdownCard movie={movie} />
          </li>
        ))
      )}
    </ul>
  );
};