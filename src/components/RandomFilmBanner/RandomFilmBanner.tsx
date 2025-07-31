import React from "react";
import { useRandomMovie } from "../../hooks/useRandomMovie";
import { FilmBanner } from "../../ui/FilmBanner/FilmBanner";
import Loader from "../../ui/Loader/Loader";
import { useNavigate } from "react-router-dom";

export const RandomFilmBanner: React.FC = () => {
  const { movie, isLoading, error, refetchMovie } = useRandomMovie();
  const navigate = useNavigate();

  const handleMovieClick = () => {
    if (!movie) return;
    navigate(`/movie/${movie.id}`);
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Ошибка: {error}</div>;
  if (!movie) return <div>Фильм не найден</div>;

  return (
    <>
      <div className="container">
        <FilmBanner
          movie={movie}
          onRefreshRequest={refetchMovie}
          showRefresh={true}
          onDetailsClick={handleMovieClick}
        />
      </div>
    </>
  );
};
