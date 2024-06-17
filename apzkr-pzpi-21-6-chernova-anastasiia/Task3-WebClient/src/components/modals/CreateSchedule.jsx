import React, { useState, useEffect } from "react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import { createSchedule } from "../../http/scheduleAPI";
import { fetchMovies } from "../../http/movieAPI";
import { fetchAllHalls } from "../../http/hallAPI";

// Компонент для створення нового розкладу
const CreateSchedule = ({ show, onHide }) => {
  // Створюємо стейти для зберігання списків фільмів та залів, а також значень форми
  const [movies, setMovies] = useState([]);
  const [halls, setHalls] = useState([]);
  const [movieId, setMovieId] = useState("");
  const [hallId, setHallId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState("");

  // useEffect для завантаження даних фільмів та залів при завантаженні компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesData = await fetchMovies();
        const hallsData = await fetchAllHalls();
        setMovies(moviesData);
        setHalls(hallsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Функція для додавання нового розкладу
  const addSchedule = async () => {
    // Створюємо об'єкт з даними розкладу
    const newSchedule = { movieId, hallId, startTime, endTime, date };
    console.log("New Schedule:", newSchedule);

    try {
      // Викликаємо API для створення нового розкладу
      await createSchedule(newSchedule);
      onHide();
    } catch (error) {
      // Лог помилки у разі невдачі
      console.error("Error creating schedule:", error);
    }
  };
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Schedule
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formMovie">
            <Form.Label>Movie</Form.Label>
            <Dropdown>
              <Dropdown.Toggle>
                {movieId
                  ? movies.find((movie) => movie.id === movieId)?.title
                  : "Select a Movie"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {movies.map((movie) => (
                  <Dropdown.Item
                    key={movie.id}
                    onClick={() => setMovieId(movie.id)}
                  >
                    {movie.title}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
          <Form.Group controlId="formHall">
            <Form.Label>Hall</Form.Label>
            <Dropdown>
              <Dropdown.Toggle>
                {hallId
                  ? halls.find((hall) => hall.id === hallId)?.name
                  : "Select a Hall"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {halls.map((hall) => (
                  <Dropdown.Item
                    key={hall.id}
                    onClick={() => setHallId(hall.id)}
                  >
                    {hall.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
          <Form.Group controlId="formDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formStartTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEndTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Close
        </Button>
        <Button variant="outline-success" onClick={addSchedule}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateSchedule;
