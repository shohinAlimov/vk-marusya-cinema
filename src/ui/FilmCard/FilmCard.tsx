import React from 'react';
import type { Movie } from '../../types/movie';
import './FilmCard.scss';

import IconDelete from "../../assets/images/icon-delete.svg?react";

interface FilmCardProps {
  movie: Movie;
  onClick?: (movieId: number) => void;
  index?: number;
  showRank?: boolean;
  showDeleteButton?: boolean;
  onDelete?: (movieId: number) => void;
}

const FilmCard: React.FC<FilmCardProps> = ({
  movie,
  onClick,
  index = 0,
  showRank = true,
  showDeleteButton = false,
  onDelete
}) => {

  const handleClick = () => {
    if (onClick) {
      onClick(movie.id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(movie.id);
    }
  };

  return (
    <div
      className="film-card"
      onClick={handleClick}
    >
      {showRank && (
        <div className="film-card__rank">{index + 1}</div>
      )}

      {showDeleteButton && (
        <button
          className="film-card__delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <IconDelete />
        </button>
      )}
      <img
        className="film-card__poster"
        src={movie.posterUrl}
        alt={`Постер фильма "${movie.title}"`}
      />

    </div >
  );
};

export default FilmCard;