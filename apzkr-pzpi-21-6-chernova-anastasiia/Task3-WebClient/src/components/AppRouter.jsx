import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { authRoutes, publicRoutes } from "../routes";
import { CINEMA_ROUTE } from "../utils/consts";
import { Context } from "../main";

const AppRouter = () => {
  const { user } = useContext(Context);

  console.log(user);
  return (
    <Routes>
      {user.isAuth &&
        authRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      <Route path="*" element={<Navigate to={CINEMA_ROUTE} />} />
    </Routes>
  );
};

export default AppRouter;

// Компонент AppRouter відповідає за маршрутизацію додатка
// Якщо користувач автентифікований, відображаються authRoutes
// Усі користувачі можуть бачити publicRoutes
// Всі інші маршрути перенаправляються на CINEMA_ROUTE