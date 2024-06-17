import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";

// Функція для реєстрації нового користувача
export const registration = async (email, password) => {
  const { data } = await $host.post("api/user/registration", {
    email,
    password,
    role: "ADMIN",
  });
  localStorage.setItem("token", data.token);
  return jwtDecode(data.token);
};

// Функція для входу користувача
export const login = async (email, password) => {
  const { data } = await $host.post("api/user/login", { email, password });
  localStorage.setItem("token", data.token);
  return jwtDecode(data.token);
};

// Функція для перевірки автентичності користувача
export const check = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Токен не знайдено");
  }

  try {
    const { data } = await $authHost.get("api/user/auth", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.setItem("token", data.token);
    return jwtDecode(data.token);
  } catch (error) {
    console.error("Помилка при перевірці ролі користувача:", error);
    throw error;
  }
};
