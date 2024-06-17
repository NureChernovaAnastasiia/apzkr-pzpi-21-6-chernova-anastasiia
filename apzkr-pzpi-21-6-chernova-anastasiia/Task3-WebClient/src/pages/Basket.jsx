import React, { useEffect, useState } from "react";
import { fetchBasketTickets } from "../http/basketAPI";
import { getTicketById } from "../http/ticketAPI";
import { fetchScheduleById } from "../http/scheduleAPI";
import { fetchMovies } from "../http/movieAPI";
import { fetchHallById } from "../http/hallAPI";
import { fetchSeatById } from "../http/seatsAPI";
import {
  Button,
  Card,
  Container,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";

const Basket = () => {
  const [basketTickets, setBasketTickets] = useState([]); // Стан для зберігання квитків у кошику з додатковими даними
  const [movies, setMovies] = useState({}); // Стан для зберігання даних про фільми

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Отримання квитків з кошика
        const basketTicketData = await fetchBasketTickets();

        // Збагачення даних квитків додатковою інформацією
        const ticketsWithData = await Promise.all(
          basketTicketData.map(async (ticket) => {
            // Отримання деталей квитка
            const ticketData = await getTicketById(ticket.ticketId);

            // Отримання даних розкладу
            const scheduleData = await fetchScheduleById(ticketData.scheduleId);

            // Отримання даних про фільми
            const movieData = await fetchMovies();

            // Знаходження фільму з відповідним ID
            const movie = movieData.find(
              (movie) => movie.id === scheduleData.movieId
            );

            // Отримання даних про зал
            const hallData = await fetchHallById(scheduleData.hallId);

            // Отримання даних про місце
            const seatData = await fetchSeatById(ticketData.seatId);

            // Повернення об'єднаного квитка з додатковою інформацією
            return {
              ...ticket,
              ...ticketData,
              scheduleData,
              movie,
              hall: hallData,
              seat: seatData,
            };
          })
        );
        setBasketTickets(ticketsWithData);
      } catch (error) {
        console.error("Помилка під час отримання даних квитків:", error);
      }
    };

    fetchData();
  }, []);

  // Функція для форматування дати
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h1" className="text-center">
          Basket Tickets
        </Card.Header>
        <Card.Body>
          <ListGroup>
            {basketTickets.map((basketTicket) => (
              <ListGroupItem
                key={basketTicket.id}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <div>
                    <strong>Your Ticket {basketTicket.id}</strong>
                  </div>
                  {/* ticket details*/}
                  {basketTicket.scheduleData && (
                    <>
                      <div>Movie Title: {basketTicket.movie.title}</div>
                      <div>Hall Name: {basketTicket.hall.name}</div>
                      <div>
                        Start Time: {basketTicket.scheduleData.startTime}
                      </div>
                      <div>
                        Date: {formatDate(basketTicket.scheduleData.date)}
                      </div>
                      <div>Row Number: {basketTicket.seat.rowNumber}</div>{" "}
                      {/* row number */}
                      <div>
                        Seat Number: {basketTicket.seat.seatNumber}
                      </div>{" "}
                      {/*seat number */}
                    </>
                  )}
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Basket;
