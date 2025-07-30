import React from 'react';
import './GenresCard.scss';
import type { Movie } from '../../types/movie';

interface GenreCardProps {
  genre: string;
  movies: Movie[];
  onClick?: () => void;
}

const GenresCard: React.FC<GenreCardProps> = ({ genre, movies, onClick }) => {
  const movieForGenre = movies.find((movie) => movie.genres.includes(genre));
  const imageUrl = movieForGenre?.posterUrl || '/images/genres/default.jpg';

  return (
    <div className="genres-card" onClick={onClick}>
      <img src={imageUrl} alt={genre} className="genres-card__image" />
      <span className="genres-card__genre">{genre}</span>
    </div>
  );
};

export default GenresCard;
