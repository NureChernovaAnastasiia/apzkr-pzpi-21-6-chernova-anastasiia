import { $authHost } from "./index";

// Функція для отримання всіх квитків у кошику
export const fetchBasketTickets = async () => {
  try {
    const { data } = await $authHost.get("/api/basketTickets");
    return data;
  } catch (error) {
    console.error("Помилка при отриманні квитків у кошику:", error);
    throw error;
  }
};

// Функція для отримання квитка у кошику за ID
export const getBasketTicketById = async (id) => {
  try {
    const { data } = await $authHost.get(`/api/basketTickets/${id}`);
    return data;
  } catch (error) {
    console.error(`Помилка при отриманні квитка у кошику з id ${id}:`, error);
    throw error;
  }
};

// Функція для створення нового квитка у кошику
export const createBasketTicket = async (basketTicketData) => {
  try {
    const { data } = await $authHost.post(
      "/api/basketTickets",
      basketTicketData
    );
    return data;
  } catch (error) {
    console.error("Помилка при створенні квитка у кошику:", error);
    throw error;
  }
};

// Функція для видалення квитка у кошику
export const deleteBasketTicket = async (id) => {
  try {
    const { data } = await $authHost.delete(`/api/basketTickets/${id}`);
    return data;
  } catch (error) {
    console.error(`Помилка при видаленні квитка у кошику з id ${id}:`, error);
    throw error;
  }
};
