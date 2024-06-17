import React, { useState, useEffect } from "react";
import { createReview } from "../http/feedbackAPI";
import { fetchMovies } from "../http/movieAPI";
import { useTranslation } from "react-i18next";
import i18n from "../components/i18n";

const FeedbackForm = () => {
  const { t } = useTranslation();
  const [userId] = useState("1");
  const [movieId, setMovieId] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [movies, setMovies] = useState([]);

  // Завантаження списку фільмів
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const movieData = await fetchMovies();
        setMovies(movieData);
      } catch (error) {
        console.error("Error fetching movies:", error); // Виведення помилки у консоль
      }
    };

    fetchMovieData();
  }, []);

  // Обробка надсилання форми
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReview({ userId, movieId, rating, comment });
      alert("Review created successfully!"); // Сповіщення про успішне створення відгуку
    } catch (error) {
      console.error("Error creating review:", error);
      alert("Error creating review"); // Сповіщення про помилку створення відгуку
    }
  };

  // Зміна мови
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-secondary me-2"
          onClick={() => changeLanguage("en")}
        >
          EN
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => changeLanguage("ua")}
        >
          UA
        </button>
      </div>
      <h1 className="text-center mt-4 mb-5">{t("Feedback Form")}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="movieId" className="form-label">
            {t("Movie")}
          </label>
          <select
            className="form-control"
            id="movieId"
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
            required
          >
            <option value="">{t("Select a movie")}</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="rating" className="form-label">
            {t("Rating")}
          </label>
          <input
            type="number"
            className="form-control"
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="10"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="comment" className="form-label">
            {t("Comment")}
          </label>
          <textarea
            className="form-control"
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {t("Submit Review")}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
