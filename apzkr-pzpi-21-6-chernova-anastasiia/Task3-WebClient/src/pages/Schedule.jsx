import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Form, Button } from "react-bootstrap";
import { fetchSchedules, deleteSchedule, updateSchedule } from "../http/scheduleAPI";
import { check } from "../http/userAPI";

const Schedule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [originalSchedule, setOriginalSchedule] = useState([]);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [editedScheduleData, setEditedScheduleData] = useState({});
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scheduleData = await fetchSchedules();
        setSchedule(scheduleData);
        setOriginalSchedule(scheduleData); // Store original schedule data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userData = await check();
        setUserRole(userData.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Use originalSchedule for filtering
    const filteredSchedule = originalSchedule.filter((item) =>
      item.Movie.title.toLowerCase().includes(term)
    );
    setSchedule(filteredSchedule);
  };

  const handleSort = () => {
    const sortedSchedule = [...schedule].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`).getTime();
      const dateB = new Date(`${b.date}T${b.startTime}`).getTime();
      return dateA - dateB;
    });
    setSchedule(sortedSchedule);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleEdit = (id) => {
    setEditingScheduleId(id);
  };

  const handleSave = async () => {
    try {
      await updateSchedule(editingScheduleId, editedScheduleData);
      const updatedSchedule = schedule.map((item) =>
        item.id === editingScheduleId ? { ...item, ...editedScheduleData } : item
      );
      setSchedule(updatedSchedule);
      setEditingScheduleId(null);
      setEditedScheduleData({});
    } catch (error) {
      console.error(`Error updating schedule with ID ${editingScheduleId}:`, error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSchedule(id);
      const updatedSchedule = schedule.filter((item) => item.id !== id);
      setSchedule(updatedSchedule);
    } catch (error) {
      console.error(`Error deleting schedule with ID ${id}:`, error);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Schedule</h1>
          <Form.Group controlId="formSearch">
            <Form.Control
              type="text"
              placeholder="Search by movie title"
              value={searchTerm}
              onChange={handleSearch}
            />
          </Form.Group>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Movie</th>
                <th>Hall</th>
                {(userRole === "ADMIN") && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {schedule.map((item) => (
                <tr key={item.id}>
                  <td>
                    {editingScheduleId === item.id ? (
                      <input
                        type="date"
                        value={editedScheduleData.date || item.date}
                        onChange={(e) =>
                          setEditedScheduleData({ ...editedScheduleData, date: e.target.value })
                        }
                      />
                    ) : (
                      formatDate(item.date)
                    )}
                  </td>
                  <td>
                    {editingScheduleId === item.id ? (
                      <input
                        type="time"
                        value={editedScheduleData.startTime || item.startTime}
                        onChange={(e) =>
                          setEditedScheduleData({
                            ...editedScheduleData,
                            startTime: e.target.value,
                          })
                        }
                      />
                    ) : (
                      `${formatTime(item.startTime)} - ${formatTime(item.endTime)}`
                    )}
                  </td>
                  <td>
                    {editingScheduleId === item.id ? (
                      <input
                        type="text"
                        value={editedScheduleData.movie?.title || item.Movie.title}
                        onChange={(e) =>
                          setEditedScheduleData({
                            ...editedScheduleData,
                            movie: { ...editedScheduleData.movie, title: e.target.value },
                          })
                        }
                      />
                    ) : (
                      item.Movie.title
                    )}
                  </td>
                  <td>
                    {editingScheduleId === item.id ? (
                      <input
                        type="text"
                        value={editedScheduleData.hallId || item.Hall.name}
                        onChange={(e) =>
                          setEditedScheduleData({
                            ...editedScheduleData,
                            hallId: e.target.value,
                          })
                        }
                      />
                    ) : (
                      item.Hall.name
                    )}
                  </td>
                  {(userRole === "ADMIN" && editingScheduleId === item.id) ? (
                    <td>
                      <Button variant="success" onClick={handleSave}>
                        Save
                      </Button>
                    </td>
                  ) : (
                    (userRole === "ADMIN") && (
                      <td>
                        <Button variant="primary" onClick={() => handleEdit(item.id)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(item.id)}>
                          Delete
                        </Button>
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
          <button onClick={handleSort}>Sort by Date & Time</button>
        </Col>
      </Row>
    </Container>
  );
};

export default Schedule;
