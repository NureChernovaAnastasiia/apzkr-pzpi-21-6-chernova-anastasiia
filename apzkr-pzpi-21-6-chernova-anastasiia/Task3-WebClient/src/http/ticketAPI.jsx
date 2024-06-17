import { $host, $authHost } from "./index";

// Функція для отримання всіх квитків
export const fetchTickets = async () => {
  try {
    const { data } = await $authHost.get("/api/tickets");
    return data;
  } catch (error) {
    console.error("Помилка при отриманні квитків:", error);
    throw error;
  }
};

// Функція для отримання квитка за ID
export const getTicketById = async (id) => {
  try {
    const { data } = await $host.get(`/api/tickets/${id}`);
    return data;
  } catch (error) {
    console.error(`Помилка при отриманні квитка з id ${id}:`, error);
    throw error;
  }
};

// Функція для створення нового квитка
export const createTicket = async (ticketData) => {
  try {
    const { data } = await $authHost.post("/api/tickets", ticketData);
    return data;
  } catch (error) {
    console.error("Помилка при створенні квитка:", error);
    throw error;
  }
};

// Функція для оновлення даних квитка
export const updateTicket = async (id, ticketData) => {
  try {
    const { data } = await $authHost.put(`/api/tickets/${id}`, ticketData);
    return data;
  } catch (error) {
    console.error(`Помилка при оновленні квитка з id ${id}:`, error);
    throw error;
  }
};

// Функція для видалення квитка
export const deleteTicket = async (id) => {
  try {
    const { data } = await $authHost.delete(`/api/tickets/${id}`);
    return data;
  } catch (error) {
    console.error(`Помилка при видаленні квитка з id ${id}:`, error);
    throw error;
  }
};
