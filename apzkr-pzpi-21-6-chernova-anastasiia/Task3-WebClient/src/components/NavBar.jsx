import React, { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Context } from "../main";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { check } from "../http/userAPI";
import {
  CINEMA_ROUTE,
  ADMIN_ROUTE,
  LOGIN_ROUTE,
  BASKET_ROUTE,
  RECOMMENDATIONS_ROUTE,
  SCHEDULE_ROUTE,
  TICKET_LIST_ROUTE,
  FEEDBACK_ROUTE,
  MENU_ROUTE,
  EMPLOYEES_ROUTE,
  HALLS_MANAGMENT_ROUTE,
} from "../utils/consts";

const NavBar = observer(() => {
  // Використовуємо useContext для отримання стану автентифікації користувача
  const { user } = useContext(Context);

  // Використовуємо useState для зберігання стану відкритого меню і ролі користувача
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState("");

  // Функція для перемикання стану меню
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Функція для виходу з системи
  const LogOut = () => {
    user.setUser({});
    user.setIsAuth(false);
    localStorage.removeItem("token");
    setRole("");
  };

  // Використовуємо useEffect для перевірки автентифікації при завантаженні компонента
  useEffect(() => {
    const authenticate = async () => {
      try {
        // Отримуємо дані користувача з сервера
        const userData = await check();
        // Встановлюємо користувача як автентифікованого
        user.setUser({ isAuth: true });
        user.setIsAuth(true);
        // Встановлюємо роль користувача
        setRole(userData.role);
      } catch (error) {
        console.error("Authentication error:", error);
      }
    };

    authenticate();
  }, [user]);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={NavLink} to={CINEMA_ROUTE}>
          CineMagic
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleMenu} />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-between"
        >
          <Nav className="w-100 d-flex justify-content-between">
            <Nav.Link as={NavLink} to={SCHEDULE_ROUTE}>
              Schedule
            </Nav.Link>
            <Nav.Link as={NavLink} to={MENU_ROUTE}>
              Menu
            </Nav.Link>
            {user.isAuth && role === "ADMIN" && (
              <>
                <Nav.Link as={NavLink} to={ADMIN_ROUTE}>
                  Admin Panel
                </Nav.Link>
                <Nav.Link as={NavLink} to={EMPLOYEES_ROUTE}>
                  Employees
                </Nav.Link>
                <Nav.Link as={NavLink} to={HALLS_MANAGMENT_ROUTE}>
                  Hall Management
                </Nav.Link>
                <Nav.Link as={NavLink} to={TICKET_LIST_ROUTE}>
                  Tickets
                </Nav.Link>
              </>
            )}
            {user.isAuth && (
              <>
                <Nav.Link as={NavLink} to={FEEDBACK_ROUTE}>
                  Feedback
                </Nav.Link>
                <Nav.Link as={NavLink} to={RECOMMENDATIONS_ROUTE}>
                  Recommendations
                </Nav.Link>
                <Nav.Link as={NavLink} to={BASKET_ROUTE}>
                  Basket
                </Nav.Link>
                <Button variant="outline-light" onClick={LogOut}>
                  Log out
                </Button>
              </>
            )}
            {!user.isAuth && (
              <Button variant="outline-light" as={NavLink} to={LOGIN_ROUTE}>
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

export default NavBar;

// Компонент NavBar відповідає за навігацію додатка
// Використовуємо useContext для отримання стану автентифікації користувача
// Використовуємо useEffect для перевірки автентифікації при завантаженні компонента
// В залежності від ролі користувача (ADMIN або звичайний користувач) показуються відповідні навігаційні посилання
// При натисканні на кнопку Log out користувач виходить із системи
