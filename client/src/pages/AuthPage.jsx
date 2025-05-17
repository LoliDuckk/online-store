import { Button, Card, Container, Form } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ADMIN_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
} from "../utils/consts";
import { auth, registration } from "../http/userApi";
import { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../main";

const AuthPage = observer(() => {
  const { user } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === LOGIN_ROUTE;

  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateLogin = (login) => {
    return login.length >= 5 ? "" : "Минимум 5 символов";
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? "" : "Введите корректный email";
  };

  const validatePassword = (password) => {
    return password.length >= 5 ? "" : "Минимум 5 символов";
  };

  const click = async () => {
    const newErrors = {
      login: validateLogin(login),
      email: isLogin ? "" : validateEmail(email),
      password: validatePassword(password),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) return;

    try {
      let data;
      if (isLogin) {
        data = await auth(login, password);
      } else {
        data = await registration(login, email, password);
      }
      user.setUser(user);
      user.setIsAuth(true);
      if (data.role === "ADMIN") navigate(ADMIN_ROUTE);
      navigate(SHOP_ROUTE);
    } catch (e) {
      alert(e.response.data.message);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: window.innerHeight - 54 }}
    >
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="ml-auto">{isLogin ? "Авторизация" : "Регистрация"}</h2>
        <Form className="d-flex flex-column">
          {!isLogin && (
            <>
              <Form.Control
                className="mt-3"
                placeholder="Введите ваш email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <Form.Text className="text-danger">{errors.email}</Form.Text>
              )}
            </>
          )}
          <Form.Control
            className="mt-3"
            placeholder="Введите ваш логин..."
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          {errors.login && (
            <Form.Text className="text-danger">{errors.login}</Form.Text>
          )}
          <Form.Control
            className="mt-3"
            placeholder="Введите ваш пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          {errors.password && (
            <Form.Text className="text-danger">{errors.password}</Form.Text>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 16,
            }}
          >
            {isLogin ? (
              <div>
                Нет аккаунта?{" "}
                <NavLink to={REGISTRATION_ROUTE}>Зарегестрируйся!</NavLink>
              </div>
            ) : (
              <div>
                Уже есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
              </div>
            )}
            <Button variant="outline-success" onClick={click}>
              {isLogin ? "Войти" : "Регистрация"}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
});

export default AuthPage;
