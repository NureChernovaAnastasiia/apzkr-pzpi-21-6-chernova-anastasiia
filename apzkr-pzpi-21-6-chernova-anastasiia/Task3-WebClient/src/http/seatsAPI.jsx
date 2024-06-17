import { $host } from "./index";

// Функція для отримання всіх місць
export const fetchAllSeats = async () => {
  try {
    const { data } = await $host.get("/api/seats");
    return data;
  } catch (error) {
    console.error("Помилка при отриманні всіх місць:", error);
    throw error;
  }
};

// Функція для отримання місця за ID
export const fetchSeatById = async (id) => {
  try {
    const { data } = await $host.get(`/api/seats/${id}`);
    return data;
  } catch (error) {
    console.error(`Помилка при отриманні місця з id ${id}:`, error);
    throw error;
  }
};

// Функція для створення нового місця
export const createSeat = async (seatData) => {
  try {
    const { data } = await $host.post("/api/seats", seatData);
    return data;
  } catch (error) {
    console.error("Помилка при створенні місця:", error);
    throw error;
  }
};

// Функція для оновлення даних місця
export const updateSeat = async (id, seatData) => {
  try {
    const { data } = await $host.put(`/api/seats/${id}`, seatData);
    return data;
  } catch (error) {
    console.error(`Помилка при оновленні місця з id ${id}:`, error);
    throw error;
  }
};

// Функція для видалення місця
export const deleteSeat = async (id) => {
  try {
    const { data } = await $host.delete(`/api/seats/${id}`);
    return data;
  } catch (error) {
    console.error(`Помилка при видаленні місця з id ${id}:`, error);
    throw error;
  }
};
