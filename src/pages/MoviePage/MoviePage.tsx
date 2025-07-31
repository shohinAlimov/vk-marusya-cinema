import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiService } from "../../services/api";
import type { Movie } from "../../types/movie";
import "./MoviePage.scss";
import Loader from "../../ui/Loader/Loader";
import { FilmBanner } from "../../ui/FilmBanner/FilmBanner";

const MoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        if (!id) {
          throw new Error("ID фильма не указан");
        }
        const data = await apiService.getMovieById(Number(id));
        setMovie(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (isLoading) return <Loader />;
  if (error) return <div>Ошибка: {error}</div>;
  if (!movie) return <div>Фильм не найден</div>;

  return (
    <section className="movie-page">
      <div className="container">
        <div className="movie-page__wrapper">
          <FilmBanner
            movie={movie}
            showDetails={false}
            showRefresh={false}
            row={true}
          />

          <div className="movie-page__details">
            <h2 className="movie-page__title">О фильме</h2>
            <div className="movie-page__info">
              <div className="movie-page__info-item">
                <div className="movie-page__info-inner">
                  <span className="movie-page__info-text">Язык оригинала</span>
                  <div className="movie-page__info-line"></div>
                </div>
                <span className="movie-page__info-value">
                  {movie.language || "Неизвестно"}
                </span>
              </div>

              <div className="movie-page__info-item">
                <div className="movie-page__info-inner">
                  <span className="movie-page__info-text">Бюджет</span>
                  <div className="movie-page__info-line"></div>
                </div>
                <span className="movie-page__info-value">
                  {movie.budget || "Неизвестно"}
                </span>
              </div>

              <div className="movie-page__info-item">
                <div className="movie-page__info-inner">
                  <span className="movie-page__info-text">Выручка</span>
                  <div className="movie-page__info-line"></div>
                </div>
                <span className="movie-page__info-value">
                  {movie.revenue || "Неизвестно"}
                </span>
              </div>

              <div className="movie-page__info-item">
                <div className="movie-page__info-inner">
                  <span className="movie-page__info-text">Режиссёр</span>
                  <div className="movie-page__info-line"></div>
                </div>
                <span className="movie-page__info-value">
                  {movie.director || "Неизвестно"}
                </span>
              </div>

              <div className="movie-page__info-item">
                <div className="movie-page__info-inner">
                  <span className="movie-page__info-text">Продакшен</span>
                  <div className="movie-page__info-line"></div>
                </div>
                <span className="movie-page__info-value">
                  {movie.production || "Неизвестно"}
                </span>
              </div>

              <div className="movie-page__info-item">
                <div className="movie-page__info-inner">
                  <span className="movie-page__info-text">Награды</span>
                  <div className="movie-page__info-line"></div>
                </div>
                <span className="movie-page__info-value">
                  {movie.awardsSummary || "Неизвестно"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoviePage;
