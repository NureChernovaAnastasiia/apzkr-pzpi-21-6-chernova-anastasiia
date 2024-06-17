import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Badge, Modal } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { fetchHallById, fetchSeatsByHallId } from "../http/hallAPI";
import { fetchSchedules } from "../http/scheduleAPI";
import { createSeat } from "../http/seatsAPI";
import { createTicket } from "../http/ticketAPI";
import "../style/App.css";

const CinemaHall = () => {
  const { id: hallId } = useParams();
  const navigate = useNavigate();

  const [selectedHall, setSelectedHall] = useState({});
  const [schedules, setSchedules] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!hallId) {
        setError("No hallId provided");
        return;
      }

      try {
        const hallData = await fetchHallById(hallId);
        const seatsData = await fetchSeatsByHallId(hallId);
        const layout = generateHallLayout(hallData.totalSeats, 10, seatsData);

        const schedulesData = await fetchSchedules();
        const hallSchedules = schedulesData.filter(
          (schedule) => schedule.hallId === parseInt(hallId)
        );

        setSelectedHall({
          ...hallData,
          layout,
          schedules: hallSchedules,
        });

        setSchedules(hallSchedules);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      }
    };

    fetchData();
  }, [hallId]);

  const generateHallLayout = (totalSeats, seatsInRow, seatsData) => {
    const layout = [];
    const occupiedSeats = seatsData.map((seat) => seat.seatNumber);

    for (let i = 0; i < totalSeats; i += seatsInRow) {
      const rowSeats = [];
      for (let j = 0; j < seatsInRow; j++) {
        const seatNumber = i + j + 1;
        rowSeats.push({
          seatNumber,
          occupied: occupiedSeats.includes(seatNumber),
        });
      }
      layout.push(rowSeats);
    }

    return layout;
  };

  const handleClose = () => navigate(-1);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleConfirmPurchase = async () => {
    try {
      const ticketData = {
        scheduleId: selectedHall.schedules[0].id,
        basketId: 1,
        seatId: null,
        price: 10.5,
      };

      const createdTickets = [];
      for (const seat of selectedSeats) {
        const seatData = {
          rowNumber: Math.floor((seat.seatNumber - 1) / 10) + 1,
          seatNumber: seat.seatNumber,
          hallId,
        };

        let createdSeat;
        if (!seat.occupied) {
          try {
            createdSeat = await createSeat(seatData);
          } catch (error) {
            console.error("Error creating seat:", error);

            return;
          }
        } else {
          createdSeat = seat;
        }

        if (!createdSeat || !createdSeat.id) {
          throw new Error("Seat creation failed");
        }

        ticketData.seatId = createdSeat.id;

        const createdTicket = await createTicket(ticketData);
        createdTickets.push(createdTicket);
      }
      alert("Seats purchased successfully!");
      setSelectedSeats([]);
      handleCloseModal();
    } catch (error) {
      console.error("Error purchasing seats:", error);
      setError("Error purchasing seats");
    }
  };

  const handleCancelSelection = (rowIndex, seatNumber) => {
    setSelectedSeats(
      selectedSeats.filter(
        (seat) =>
          !(seat.rowIndex === rowIndex && seat.seatNumber === seatNumber)
      )
    );
  };

  if (error) {
    return (
      <Container>
        <Row>
          <Col>
            <p>{error}</p>
            <Button onClick={handleClose}>Go Back</Button>
          </Col>
        </Row>
      </Container>
    );
  }

  const renderHallLayout = () => {
    if (!selectedHall.layout) return null;

    return (
      <>
        <div className="screen-label">
          <div className="screen">Screen</div>
        </div>
        {selectedHall.layout.map((row, rowIndex) => (
          <div key={rowIndex} className="mb-3 row-seats">
            <h4>Row {rowIndex + 1}</h4>
            <div className="d-flex justify-content-center">
              {row.map((seat) => (
                <Button
                  key={seat.seatNumber}
                  variant={
                    seat.occupied
                      ? "danger"
                      : selectedSeats.some(
                          (s) =>
                            s.seatNumber === seat.seatNumber &&
                            s.rowIndex === rowIndex
                        )
                      ? "success"
                      : "outline-secondary"
                  }
                  className="me-2 mb-2"
                  onClick={() => {
                    if (seat.occupied) return;
                    const isSelected = selectedSeats.some(
                      (s) =>
                        s.seatNumber === seat.seatNumber &&
                        s.rowIndex === rowIndex
                    );
                    if (isSelected) {
                      handleCancelSelection(rowIndex, seat.seatNumber);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats,
                        { rowIndex, seatNumber: seat.seatNumber },
                      ]);
                    }
                  }}
                  disabled={seat.occupied}
                >
                  {seat.seatNumber}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <Container className="cinema-hall">
      <Row>
        <Col>
          <h1>{selectedHall.name || "Multiplex"}</h1>
          <p>
            <strong>Total Seats:</strong> {selectedHall.totalSeats || ""}
          </p>
          <h2>Schedules:</h2>
          {schedules.length > 0 ? (
            schedules.map((schedule) => (
              <div key={schedule.id}>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(schedule.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Start Time:</strong> {schedule.startTime}
                </p>
                <p>
                  <strong>Movie Name:</strong>{" "}
                  {schedule?.Movie?.title || "Unknown"}
                </p>
              </div>
            ))
          ) : (
            <p>No schedules available for this hall</p>
          )}
          <h2>Hall Layout:</h2>
          {renderHallLayout()}
        </Col>
      </Row>
      <Button variant="info" className="mt-3" onClick={handleClose}>
        Return
      </Button>
      <Button
        variant="primary"
        className="mt-3"
        onClick={handleShowModal}
        disabled={selectedSeats.length === 0}
      >
        Confirm Purchase
      </Button>
      <div className="mt-3">
        <p>
          <strong>Selected Seats:</strong>
        </p>
        {selectedSeats.length > 0 ? (
          selectedSeats.map((seat) => (
            <Badge
              key={`${seat.rowIndex}-${seat.seatNumber}`}
              bg="success"
              className="me-2 mb-2"
            >{`Row ${seat.rowIndex + 1} Seat ${seat.seatNumber}`}</Badge>
          ))
        ) : (
          <p>No seats selected</p>
        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Selected Seats</h4>
          {selectedSeats.map((seat) => (
            <p key={`${seat.rowIndex}-${seat.seatNumber}`}>
              Row {seat.rowIndex + 1} Seat {seat.seatNumber}
            </p>
          ))}
          <h4>
            Movie Name:{" "}
            {selectedHall?.schedules?.[0]?.Movie?.title || "Unknown"}
          </h4>
          <h4>
            Date:{" "}
            {selectedHall?.schedules?.[0]
              ? new Date(selectedHall.schedules[0].date).toLocaleDateString()
              : "Unknown"}
          </h4>
          <h4>
            Time:{" "}
            {selectedHall?.schedules?.[0]
              ? selectedHall.schedules[0].startTime
              : "Unknown"}
          </h4>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirmPurchase}>
            Confirm Purchase
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CinemaHall;
