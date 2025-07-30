import type { Movie } from "../../types/movie";
import Rating from "../Rating/Rating";
import "./DropdownCard.scss"

interface DropdownCardProps {
  movie: Movie;
}

const DropdownCard = ({ movie }: DropdownCardProps) => {
  return (
    <div className='dropdown-card'>
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="dropdown-card__poster"
      />
      <div className="dropdown-card__info">
        <div className='dropdown-card__top'>
          <Rating movie={movie} small={true} />
          <span className="dropdown-card__notes">{movie.releaseYear}</span>
          <span className="dropdown-card__notes dropdown-card__genres">
            {movie.genres.join(', ')}
          </span>
          <span className="dropdown-card__notes">{movie.runtime} мин</span>
        </div>
        <h3 className="dropdown-card__title">{movie.title}</h3>
      </div>
    </div>
  )
}

export default DropdownCard;