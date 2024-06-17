import React, { useState, useEffect } from "react";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]); // Стейт для рекомендацій

  // Функція для отримання рекомендацій з сервера
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/recomendation"); // Запит на сервер за рекомендаціями
        const data = await response.json(); // Конвертація відповіді у формат JSON
        setRecommendations(data); // Збереження рекомендацій у стейт
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations(); // Виклик функції отримання рекомендацій
  }, []);

  return (
    <div className="container">
      <h1 className="text-center mt-4 mb-5">Movie Recommendations For You</h1>
      <div className="row justify-content-center">
        {recommendations.map((movie) => (
          <div key={movie.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img
                src={movie.posterURL}
                className="card-img-top"
                alt={movie.title}
                style={{ objectFit: "cover", height: "600px" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text flex-grow-1">{movie.description}</p>
                <div className="mt-auto">
                  <p className="card-text mb-0">Rating: {movie.rating}</p>
                  <a
                    href={movie.trailerURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary mt-2"
                  >
                    Watch Trailer
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
