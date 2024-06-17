import React, { useState, useEffect } from "react";
import {
  fetchAllHalls,
  createHall,
  updateHall,
  deleteHall,
} from "../http/hallAPI";

const HallsManagement = () => {
  const [halls, setHalls] = useState([]); // Список залів
  const [name, setName] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [editingHall, setEditingHall] = useState(null); // Змінна для редагування залу

  // Завантаження даних про зали
  useEffect(() => {
    const getHalls = async () => {
      try {
        const data = await fetchAllHalls();
        setHalls(data);
      } catch (error) {
        console.error("Error fetching halls:", error); // Виведення помилки у консоль
      }
    };

    getHalls();
  }, []);

  // Обробка створення або оновлення залу
  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const hallData = { name, totalSeats: parseInt(totalSeats, 10) };

    try {
      if (editingHall) {
        await updateHall(editingHall.id, hallData);
      } else {
        await createHall(hallData);
      }

      setName("");
      setTotalSeats("");
      setEditingHall(null); // Скидання режиму редагування

      const updatedHalls = await fetchAllHalls();
      setHalls(updatedHalls);
    } catch (error) {
      console.error("Error creating or updating hall:", error);
    }
  };

  // Встановлення режиму редагування
  const handleEdit = (hall) => {
    setName(hall.name);
    setTotalSeats(hall.totalSeats);
    setEditingHall(hall);
  };

  // Видалення залу
  const handleDelete = async (id) => {
    try {
      await deleteHall(id);
      const updatedHalls = await fetchAllHalls();
      setHalls(updatedHalls);
    } catch (error) {
      console.error("Error deleting hall:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center mt-4 mb-5">Halls Management</h1>
      <form onSubmit={handleCreateOrUpdate}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Hall Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="totalSeats" className="form-label">
            Total Seats
          </label>
          <input
            type="number"
            className="form-control"
            id="totalSeats"
            value={totalSeats}
            onChange={(e) => setTotalSeats(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editingHall ? "Update Hall" : "Create Hall"}
        </button>
      </form>

      <h2 className="mt-5">All Halls</h2>
      <ul className="list-group">
        {halls.map((hall) => (
          <li
            key={hall.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {hall.name} (Seats: {hall.totalSeats})
            <div>
              <button
                className="btn btn-warning me-2"
                onClick={() => handleEdit(hall)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(hall.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HallsManagement;
