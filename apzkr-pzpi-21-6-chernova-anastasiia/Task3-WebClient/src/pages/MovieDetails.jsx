import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { fetchOneMovie, updateMovie } from "../http/movieAPI";
import { fetchSchedules } from "../http/scheduleAPI";
import { CINEMA_HALL_ROUTE } from "../utils/consts";
import { check } from "../http/userAPI";

const posterStyle = {
  maxHeight: "100%",
  objectFit: "cover",
};

const scheduleCardStyle = {
  marginBottom: "20px",
};

const MovieDetails = () => {
  const { id } = useParams(); // Отримання параметру з URL
  const [movie, setMovie] = useState(null); // Стейт для даних про фільм
  const [schedules, setSchedules] = useState([]); // Стейт для розкладу показів
  const [editing, setEditing] = useState(false); // Стан редагування
  const [editedMovie, setEditedMovie] = useState({}); // Стейт для змінених даних фільму
  const [userRole, setUserRole] = useState(""); // Стейт для ролі користувача

  // Функція для завантаження даних про фільм
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const movieData = await fetchOneMovie(id); // Запит на сервер за даними фільму
        setMovie(movieData); // Збереження даних у стейт
        setEditedMovie(movieData); // Встановлення даних для редагування
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    fetchMovieData();
  }, [id]); // Запуск ефекту при зміні ID фільму в URL

  // Функція для завантаження ролі користувача
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userData = await check(); // Запит на сервер за даними користувача
        setUserRole(userData.role); // Збереження ролі користувача
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  // Функція для завантаження розкладу показів фільму
  useEffect(() => {
    const fetchSchedulesData = async () => {
      try {
        const schedulesData = await fetchSchedules(); // Запит на сервер за розкладом показів
        const filteredSchedules = schedulesData.filter(
          (schedule) => schedule.MovieId === parseInt(id) // Фільтрація розкладу за ID фільму
        );
        setSchedules(filteredSchedules); // Збереження розкладу у стейт
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSchedulesData();
  }, [id]); // Запуск ефекту при зміні ID фільму в URL

  // Обробник для включення режиму редагування
  const handleEdit = () => {
    setEditing(true);
  };

  // Обробник для збереження змінених даних фільму
  const handleSave = async () => {
    try {
      await updateMovie(id, editedMovie); // Відправка змінених даних на сервер
      setMovie(editedMovie); // Оновлення даних про фільм
      setEditing(false); // Вимкнення режиму редагування
    } catch (error) {
      console.error(`Error updating movie with ID ${id}:`, error);
    }
  };

  // Обробник для зміни значень полів вводу
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMovie({ ...editedMovie, [name]: value }); // Оновлення стейту змінених даних
  };
  return (
    <Container className="mt-5">
      <Row className="gx-5">
        <Col md={4}>
          {movie && (
            <Card style={{ marginBottom: "20px", width: "100%" }}>
              <Card.Img
                variant="top"
                src={movie.posterURL || "/placeholder_image_url"}
                style={posterStyle}
              />
            </Card>
          )}
        </Col>
        <Col md={8}>
          {movie ? (
            <>
              <h1>
                {editing ? (
                  <Form.Control
                    type="text"
                    name="title"
                    value={editedMovie.title}
                    onChange={handleInputChange}
                  />
                ) : (
                  movie.title
                )}
              </h1>
              <Card>
                <Card.Body>
                  <Card.Text>
                    <strong>Description:</strong>{" "}
                    {editing ? (
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={editedMovie.description}
                        onChange={handleInputChange}
                      />
                    ) : (
                      movie.description
                    )}
                    <br />
                    <strong>Duration:</strong>{" "}
                    {editing ? (
                      <Form.Control
                        type="number"
                        name="duration"
                        value={editedMovie.duration}
                        onChange={handleInputChange}
                      />
                    ) : (
                      `${movie.duration} mins`
                    )}
                    <br />
                    <strong>Genre:</strong>{" "}
                    {editing ? (
                      <Form.Control
                        type="text"
                        name="genre"
                        value={editedMovie.genre}
                        onChange={handleInputChange}
                      />
                    ) : (
                      movie.genre
                    )}
                    <br />
                    <strong>Rating:</strong>{" "}
                    {editing ? (
                      <Form.Control
                        type="number"
                        name="rating"
                        value={editedMovie.rating}
                        onChange={handleInputChange}
                      />
                    ) : (
                      movie.rating
                    )}
                  </Card.Text>
                  {movie.trailerURL && (
                    <Button
                      variant="secondary"
                      href={movie.trailerURL}
                      target="_blank"
                      className="ml-2"
                    >
                      Watch Trailer
                    </Button>
                  )}
                  {userRole === "ADMIN" &&
                    (editing ? (
                      <Button variant="success" onClick={handleSave}>
                        Save
                      </Button>
                    ) : (
                      <Button variant="primary" onClick={handleEdit}>
                        Edit
                      </Button>
                    ))}
                </Card.Body>
              </Card>
              <h2 className="mt-5">Schedules</h2>
              <Row className="gx-5">
                {schedules.length ? (
                  schedules.map((schedule) => (
                    <Col key={schedule.id} md={6} className="mb-3">
                      <Card style={scheduleCardStyle}>
                        <Card.Body>
                          <Card.Text>
                            <strong>Date:</strong>{" "}
                            {new Date(schedule.date).toLocaleDateString()}
                            <br />
                            <strong>Start Time:</strong>{" "}
                            {schedule.startTime.slice(0, 5)}
                            <br />
                            <strong>Hall:</strong> {schedule.Hall.name}
                          </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                          <Button
                            variant="primary"
                            as={Link}
                            to={{
                              pathname: `${CINEMA_HALL_ROUTE}/${id}/${schedule.id}`,
                              state: { movie, schedule },
                            }}
                          >
                            Buy Ticket
                          </Button>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <p>No schedules available</p>
                )}
              </Row>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MovieDetails;
