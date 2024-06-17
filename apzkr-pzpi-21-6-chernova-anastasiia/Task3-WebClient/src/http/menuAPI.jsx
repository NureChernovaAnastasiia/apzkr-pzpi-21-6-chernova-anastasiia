import { $host, $authHost } from "./index";

// Функція для отримання всіх елементів меню їжі
export const fetchAllFoodMenuItems = async () => {
  try {
    const { data } = await $host.get("api/food");
    return data;
  } catch (error) {
    console.error("Error fetching food menu items:", error);
    throw error;
  }
};

// Функція для створення нового елемента меню їжі
export const createFoodMenuItem = async (name, description, price, imgURL) => {
  // Додавання imgURL
  try {
    const { data } = await $authHost.post("api/food", {
      name,
      description,
      price,
      imgURL,
    }); // Додавання imgURL
    return data;
  } catch (error) {
    console.error("Error creating food menu item:", error);
    throw error;
  }
};

// Функція для оновлення елемента меню їжі
export const updateFoodMenuItem = async (
  id,
  name,
  description,
  price,
  imgURL
) => {
  // Додавання imgURL
  try {
    const { data } = await $authHost.put(`api/food/${id}`, {
      name,
      description,
      price,
      imgURL,
    }); // Додавання imgURL
    return data;
  } catch (error) {
    console.error(`Error updating food menu item with ID ${id}:`, error);
    throw error;
  }
};

// Функція для видалення елемента меню їжі
export const deleteFoodMenuItem = async (id) => {
  try {
    const { data } = await $authHost.delete(`api/food/${id}`);
    return data;
  } catch (error) {
    console.error(`Error deleting food menu item with ID ${id}:`, error);
    throw error;
  }
};
