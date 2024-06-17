import { $host, $authHost } from "./index";

// Функція для отримання всіх розкладів
export const fetchSchedules = async () => {
  try {
    const { data } = await $host.get("api/schedule");
    return data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
  }
};

// Функція для отримання одного розкладу за ID
export const fetchScheduleById = async (id) => {
  try {
    const { data } = await $host.get(`api/schedule/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching schedule with ID ${id}:`, error);
  }
};

// Функція для створення нового розкладу
export const createSchedule = async (scheduleData) => {
  try {
    const { data } = await $authHost.post("api/schedule", scheduleData);
    return data;
  } catch (error) {
    console.error("Error creating schedule:", error);
  }
};

// Функція для оновлення розкладу
export const updateSchedule = async (id, scheduleData) => {
  try {
    const { data } = await $authHost.put(`api/schedule/${id}`, scheduleData);
    return data;
  } catch (error) {
    console.error(`Error updating schedule with ID ${id}:`, error);
  }
};

// Функція для видалення розкладу
export const deleteSchedule = async (id) => {
  try {
    const { data } = await $authHost.delete(`api/schedule/${id}`);
    return data;
  } catch (error) {
    console.error(`Error deleting schedule with ID ${id}:`, error);
  }
};
