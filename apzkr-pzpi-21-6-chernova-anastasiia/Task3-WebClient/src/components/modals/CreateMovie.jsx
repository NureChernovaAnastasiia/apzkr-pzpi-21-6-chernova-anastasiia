import React, { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Context } from "../../main";
import { createMovie } from "../../http/movieAPI";

// Компонент для створення нового фільму
const CreateMovie = ({ show, onHide }) => {
  // Отримуємо контекст movie
  const { movie } = useContext(Context);

  // Створюємо стейти для зберігання значень з форми
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [posterURL, setPosterURL] = useState("");
  const [trailerURL, setTrailerURL] = useState("");

  // Функція для додавання нового фільму
  const addMovie = async () => {
    try {
      // Створюємо об'єкт з даними фільму
      const newMovie = {
        title,
        description,
        duration,
        genre,
        rating,
        posterURL,
        trailerURL,
      };

      // Викликаємо API для створення нового фільму
      const response = await createMovie(newMovie);

      // Оновлюємо список фільмів у контексті
      movie.setMovies([...movie.movies, response]);

      // Закриваємо модальне вікно після успішного додавання
      onHide();
    } catch (error) {
      // Лог помилки у разі невдачі
      console.error("Error adding movie:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Movie
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter movie title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter movie description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formDuration">
            <Form.Label>Duration (minutes)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formGenre">
            <Form.Label>Genre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formRating">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              placeholder="Enter rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPosterURL">
            <Form.Label>Poster URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter poster URL"
              value={posterURL}
              onChange={(e) => setPosterURL(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formTrailerURL">
            <Form.Label>Trailer URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter trailer URL"
              value={trailerURL}
              onChange={(e) => setTrailerURL(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" className="mt-2" onClick={onHide}>
          Close
        </Button>
        <Button variant="outline-success" className="mt-2" onClick={addMovie}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateMovie;
