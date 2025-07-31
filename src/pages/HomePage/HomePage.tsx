import React from "react";
import { useNavigate } from "react-router-dom";
import { RandomFilmBanner } from "../../components/RandomFilmBanner/RandomFilmBanner";
import { TopMovies } from "../../components/TopMovies/TopMovies";
import "./HomePage.scss";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <>
      <section className="home-page__random-section">
        <RandomFilmBanner />
      </section>

      <section className="home-page__top-section">
        <TopMovies onMovieClick={handleMovieClick} />
      </section>
    </>
  );
};

export default HomePage;
