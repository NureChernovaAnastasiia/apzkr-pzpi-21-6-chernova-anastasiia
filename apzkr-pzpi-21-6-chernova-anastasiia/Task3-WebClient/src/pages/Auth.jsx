import React, { useState, useContext } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { CINEMA_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE } from "../utils/consts";
import { login, registration } from "../http/userAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../main";

// Компонент для аутентифікації користувача
const Auth = observer(() => {
  const { user } = useContext(Context); // Отримання контексту користувача
  const location = useLocation(); // Отримання поточного шляху
  const navigate = useNavigate(); // Хук для навігації
  const isLogin = location.pathname === LOGIN_ROUTE; // Визначення, чи це сторінка входу
  const [email, setEmail] = useState(""); // Стан для email
  const [password, setPassword] = useState(""); // Стан для паролю

  const click = async () => {
    try {
      let data;
      if (isLogin) {
        data = await login(email, password); // Вхід користувача
      } else {
        data = await registration(email, password); // Реєстрація користувача
      }
      user.setUser(data); // Встановлення даних користувача
      user.setIsAuth(true); // Встановлення статусу авторизації
      navigate(CINEMA_ROUTE); // Перенаправлення на головну сторінку
    } catch (e) {
      alert(e.response.data.message); // Відображення повідомлення про помилку
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: window.innerHeight - 54 }}
    >
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="m-auto">{isLogin ? "SIGN IN" : "SIGN UP"}</h2>
        <Form className="d-flex flex-column">
          <Form.Control
            className="mt-3"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Control
            className="mt-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </Form>
        <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
          {isLogin ? (
            <div>
              Don't have an account?{" "}
              <NavLink to={REGISTRATION_ROUTE}>Sign Up</NavLink>
            </div>
          ) : (
            <div>
              Already have an account? <NavLink to={LOGIN_ROUTE}>Login</NavLink>
            </div>
          )}
        </Row>
        <Button variant={"outline-success"} onClick={click}>
          {isLogin ? "SIGN IN" : "SIGN UP"}
        </Button>
      </Card>
    </Container>
  );
});

export default Auth;
