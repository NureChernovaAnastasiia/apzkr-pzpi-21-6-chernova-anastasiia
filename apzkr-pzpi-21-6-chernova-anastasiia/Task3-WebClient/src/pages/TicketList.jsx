import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { fetchTickets } from '../http/ticketAPI';
import { fetchScheduleById } from '../http/scheduleAPI';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchOneMovie } from '../http/movieAPI';
import { fetchHallById } from '../http/hallAPI';
import { fetchSeatById } from '../http/seatsAPI';
import axios from 'axios';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [ticketElements, setTicketElements] = useState([]);
  const [currencyRate, setCurrencyRate] = useState(null);
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const getTickets = async () => {
      try {
        const data = await fetchTickets();
        setTickets(data.tickets);
        setTotalPrice(data.total_price);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    getTickets();
  }, []);

  useEffect(() => {
    const renderTickets = async () => {
      const elements = await Promise.all(tickets.map(async (ticket) => {
        const scheduleData = await fetchScheduleById(ticket.scheduleId);
        const movieData = await fetchOneMovie(scheduleData.movieId);
        const hallData = await fetchHallById(scheduleData.hallId);
        const seatData = await fetchSeatById(ticket.seatId);

        return (
          <Col key={ticket.id} md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Ticket ID: {ticket.id}</Card.Title>
                <Card.Text>
                  <strong>Schedule</strong><br />
                  Date: {scheduleData ? format(new Date(scheduleData.date), 'dd.MM.yyyy') : 'N/A'}<br />
                  StartTime: {scheduleData ? scheduleData.startTime : 'N/A'}<br />
                  Title: {movieData ? movieData.title : 'N/A'}<br />
                  Hall Name: {hallData ? hallData.name : 'N/A'}<br />
                  Seat: {seatData ? `Row ${seatData.rowNumber}, Seat ${seatData.seatNumber}` : 'N/A'}<br />
                </Card.Text>
                <Card.Text>
                  <strong>Price</strong><br />
                  {convertCurrency(ticket.price)} {currency}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        );
      }));

      setTicketElements(elements);
    };

    renderTickets();
  }, [tickets, currency, currencyRate]);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get(`https://open.er-api.com/v6/latest/${currency}`);
        setCurrencyRate(response.data.rates.USD);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        setCurrencyRate(currency === 'USD' ? 1 : null); // Set a default rate for USD
      }
    };

    fetchExchangeRate();
  }, [currency]);

  const convertCurrency = (price) => {
    if (currencyRate) {
      const numericPrice = parseFloat(price);
      if (!isNaN(numericPrice)) {
        if (currency === 'USD') {
          return numericPrice.toFixed(2);
        } else {
          return (numericPrice / currencyRate).toFixed(2);
        }
      }
    }
    return price;
  };
  

  const handleCurrencyChange = () => {
    setCurrency(currency === 'USD' ? 'UAH' : 'USD');
  };

  return (
    <Container>
      <Row className="d-flex justify-content-between">
        <Col>
          <h1>TicketList</h1>
          <h3>Total Price: {convertCurrency(totalPrice)} {currency}</h3>
        </Col>
        <Col xs="auto" className="text-right">
          <Button onClick={handleCurrencyChange}>Convert to {currency === 'USD' ? 'UAH' : 'USD'}</Button>
        </Col>
      </Row>
      <Row>
        {ticketElements}
      </Row>
    </Container>
  );
};

export default TicketList;
