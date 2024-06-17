import { $host, $authHost } from "./index";

// Функція для отримання всіх фільмів
export const fetchMovies = async () => {
  const { data } = await $host.get("api/movie");
  return data;
};

// Функція для отримання одного фільму за ID
export const fetchOneMovie = async (id) => {
  const { data } = await $host.get(`api/movie/${id}`);
  return data;
};

// Функція для створення нового фільму (потребує ролі адміністратора)
export const createMovie = async (movie) => {
  const { data } = await $authHost.post("api/movie/", movie);
  return data;
};

// Функція для оновлення існуючого фільму (потребує ролі адміністратора)
export const updateMovie = async (id, movie) => {
  const { data } = await $authHost.put(`api/movie/${id}`, movie);
  return data;
};

// Функція для видалення фільму (потребує ролі адміністратора)
export const deleteMovie = async (id) => {
  const { data } = await $authHost.delete(`api/movie/${id}`);
  return data;
};
