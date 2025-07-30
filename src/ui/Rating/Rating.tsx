import type { Movie } from "../../types/movie";
import StarIcon from "../../assets/images/icon-star.svg?react";
import React from "react";
import './Rating.scss';

interface RatingProps {
  movie: Movie;
  small?: boolean;
}

const Rating: React.FC<RatingProps> = ({ small = false, movie }) => {
  const rating = parseFloat(movie.tmdbRating.toFixed(1));


  let ratingClass = '';
  if (rating < 7) {
    ratingClass = 'rating--low';
  } else if (rating >= 7 && rating < 8) {
    ratingClass = 'rating--medium';
  } else {
    ratingClass = 'rating--high';
  }

  return (
    <div className={`rating ${small ? 'rating--small' : ''} ${ratingClass}`}>
      <StarIcon className='rating__icon' width={16} height={16} aria-hidden={true} />
      <span className="rating__value">{rating}</span>
    </div>
  );
}

export default Rating;