import { $authHost } from "./index";

// Функція для створення нового відгуку
export const createReview = async (reviewData) => {
  try {
    const response = await $authHost.post("/api/reviews", reviewData);

    // Перевірка статусу відповіді
    if (response.status !== 201 && response.status !== 200) {
      throw new Error(`Не вдалося створити відгук. Статус: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Помилка при виклику API для створення відгуку:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Не вдалося створити відгук");
  }
};
