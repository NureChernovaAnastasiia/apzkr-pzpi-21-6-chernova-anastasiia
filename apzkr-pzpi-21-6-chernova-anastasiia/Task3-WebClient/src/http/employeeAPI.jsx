import { $authHost } from "./index";

// Функція для отримання всіх співробітників
export const fetchAllEmployees = async () => {
  try {
    const response = await $authHost.get("/api/employee");
    return response.data;
  } catch (error) {
    console.error("Помилка при отриманні всіх співробітників:", error);
    throw error;
  }
};

// Функція для отримання співробітника за ID
export const fetchEmployeeById = async (id) => {
  try {
    const response = await $authHost.get(`/api/employee/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Помилка при отриманні співробітника з id ${id}:`, error);
    throw error;
  }
};

// Функція для створення нового співробітника
export const createEmployee = async (employeeData) => {
  try {
    const response = await $authHost.post("/api/employee", employeeData);
    return response.data;
  } catch (error) {
    console.error("Помилка при створенні співробітника:", error);
    throw error;
  }
};

// Функція для оновлення даних співробітника
export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await $authHost.put(`/api/employee/${id}`, employeeData);
    return response.data;
  } catch (error) {
    console.error(
      `Помилка при оновленні даних співробітника з id ${id}:`,
      error
    );
    throw error;
  }
};

// Функція для видалення співробітника
export const deleteEmployee = async (id) => {
  try {
    const response = await $authHost.delete(`/api/employee/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Помилка при видаленні співробітника з id ${id}:`, error);
    throw error;
  }
};
