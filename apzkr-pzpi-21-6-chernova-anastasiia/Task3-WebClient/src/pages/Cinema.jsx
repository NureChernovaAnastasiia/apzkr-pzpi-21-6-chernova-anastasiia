import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchMovies, deleteMovie } from "../http/movieAPI";
import banner from "../img/banner.png";
import { check } from "../http/userAPI";

const CinemaHome = () => {
  // Стан для зберігання списку фільмів
  const [movies, setMovies] = useState([]);
  // Стан для зберігання ролі користувача
  const [userRole, setUserRole] = useState("");
  // Стан для вибору мови інтерфейсу
  const [language, setLanguage] = useState("en");
  // Стан для фільтрації за жанром
  const [filterGenre, setFilterGenre] = useState("");
  // Стан для вибору опції сортування
  const [sortOption, setSortOption] = useState("");
  // Стан для управління пошуковим запитом
  const [searchQuery, setSearchQuery] = useState("");

  // Завантаження фільмів при монтуванні компоненту
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const moviesData = await fetchMovies();
        setMovies(moviesData);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovieData();
  }, []);

  // Завантаження ролі користувача при монтуванні компоненту
  useEffect(() => {
    const fetchUserRole = async () => {
      const userData = await fetchUserRoleFromBackend();
      setUserRole(userData.role);
    };

    fetchUserRole();
  }, []);

  const fetchUserRoleFromBackend = async () => {
    try {
      const userData = await check();
      return userData;
    } catch (error) {
      console.error("Error fetching user role:", error);
      return { role: "" };
    }
  };

  // Обробник видалення фільму
  const handleDelete = async (id) => {
    try {
      await deleteMovie(id);
      setMovies(movies.filter((movie) => movie.id !== id));
      alert("Фільм успішно видалено!");
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Помилка під час видалення фільму. Спробуйте ще раз.");
    }
  };

  // Обробники зміни станів фільтрації та сортування
  const handleFilterChange = (e) => {
    setFilterGenre(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Фільтрація та сортування фільмів на основі заданих параметрів
  const filteredMovies = movies
    .filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortOption === "releaseDate") {
        return new Date(a.releaseDate) - new Date(b.releaseDate);
      } else {
        return 0;
      }
    });

  return (
    <Container fluid className="p-0">
      <header className="home-banner" style={homeBannerStyle}>
        <div className="banner-content" style={bannerContentStyle}></div>
      </header>
      <Container>
        <section className="movie-section" style={sectionStyle}>
          <h2>{language === "en" ? "Now Showing" : "Сейчас показывают"}</h2>
          <Form className="d-flex justify-content-between align-items-center mb-4">
            <Form.Group
              controlId="sortOption"
              className="mr-2"
              style={formGroupStyle}
            >
              <Form.Label>
                {language === "en" ? "Sort by" : "Сортувати по"}
              </Form.Label>
              <Form.Control
                as="select"
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="">
                  {language === "en" ? "None" : "Нічого"}
                </option>
                <option value="title">
                  {language === "en" ? "Title" : "Назва"}
                </option>
                <option value="releaseDate">
                  {language === "en" ? "Release Date" : "Дата виходу"}
                </option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="searchQuery" style={formGroupStyle}>
              <Form.Label>{language === "en" ? "Search" : "Пошук"}</Form.Label>
              <Form.Control
                type="text"
                placeholder={
                  language === "en" ? "Search by title" : "Пошук по назві"
                }
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Form.Group>
          </Form>
          <div className="movie-cards">
            <Row>
              {filteredMovies.map((movie) => (
                <Col key={movie.id} sm={6} md={4} lg={3} className="mb-3">
                  <Card style={cardStyle}>
                    <Card.Img
                      variant="top"
                      src={movie.posterURL}
                      style={cardImageStyle}
                    />
                    <Card.Body style={cardBodyStyle}>
                      <Card.Title>{movie.title}</Card.Title>
                      <Card.Text>{movie.description}</Card.Text>
                      <Link to={`/movie/${movie.id}`}>
                        <Button variant="primary">
                          {language === "en" ? "Details" : "Деталі"}
                        </Button>
                      </Link>
                      {userRole === "ADMIN" && (
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(movie.id)}
                        >
                          {language === "en" ? "Delete" : "Видалити"}
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>
      </Container>
    </Container>
  );
};

// Define the styles
const homeBannerStyle = {
  backgroundImage: `url(${banner})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "white",
  textAlign: "center",
  padding: "100px 0",
  marginBottom: "30px",
};

const bannerContentStyle = {
  padding: "20px",
  display: "inline-block",
  position: "relative",
};

const sectionStyle = {
  margin: "50px 0",
  textAlign: "center",
};

const formGroupStyle = {
  flexGrow: 1,
};

const cardStyle = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

const cardImageStyle = {
  height: "400px",
  objectFit: "contain",
  width: "100%",
};

const cardBodyStyle = {
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

export default CinemaHome;
