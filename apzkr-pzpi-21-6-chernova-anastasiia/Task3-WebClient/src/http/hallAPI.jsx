import { $host } from "./index";

// Функція для отримання всіх залів
export const fetchAllHalls = async () => {
  try {
    const { data } = await $host.get("/api/halls");
    return data;
  } catch (error) {
    console.error("Помилка при отриманні всіх залів:", error);
    throw error;
  }
};

// Функція для отримання залу за ID
export const fetchHallById = async (id) => {
  try {
    const { data } = await $host.get(`/api/halls/${id}`);
    return data;
  } catch (error) {
    console.error(`Помилка при отриманні залу з id ${id}:`, error);
    throw error;
  }
};

// Функція для створення нового залу
export const createHall = async (hallData) => {
  try {
    const { data } = await $host.post("/api/halls", hallData);
    return data;
  } catch (error) {
    console.error("Помилка при створенні залу:", error);
    throw error;
  }
};

// Функція для оновлення даних залу
export const updateHall = async (id, hallData) => {
  try {
    const { data } = await $host.put(`/api/halls/${id}`, hallData);
    return data;
  } catch (error) {
    console.error(`Помилка при оновленні даних залу з id ${id}:`, error);
    throw error;
  }
};

// Функція для видалення залу
export const deleteHall = async (id) => {
  try {
    const { data } = await $host.delete(`/api/halls/${id}`);
    return data;
  } catch (error) {
    console.error(`Помилка при видаленні залу з id ${id}:`, error);
    throw error;
  }
};

// Функція для отримання місць у залі за ID залу
export const fetchSeatsByHallId = async (hallId) => {
  try {
    const { data } = await $host.get(`/api/halls/${hallId}/seats`);
    return data;
  } catch (error) {
    console.error(
      `Помилка при отриманні місць для залу з id ${hallId}:`,
      error
    );
    throw error;
  }
};
