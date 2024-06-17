import axios from "axios";

// Створюємо екземпляр axios для неавторизованих запитів
const $host = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Створюємо екземпляр axios для авторизованих запитів
const $authHost = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Інтерцептор для додавання токену авторизації до заголовків запитів
const authInterceptor = (config) => {
  config.headers.authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
};

// Додаємо інтерцептор до авторизованих запитів
$authHost.interceptors.request.use(authInterceptor);

export { $host, $authHost };
