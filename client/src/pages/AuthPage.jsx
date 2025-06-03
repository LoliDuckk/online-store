import { Button, Card, Container, Form } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ADMIN_ROUTE,
  HOME_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
} from "../utils/consts";
import { auth, registration } from "../http/userApi";
import { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../main";
import {
  validateLength,
  validateEmail,
  validateEmpty,
} from "../utils/validate";

const AuthPage = observer(() => {
  const { user } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const [serverError, setServerError] = useState("");

  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const getValidationErrors = () => ({
    login: validateEmpty(login) || validateLength(login, 5),
    email: isLogin ? "" : validateEmpty(email) || validateEmail(email),
    password: validateEmpty(password) || validateLength(password, 5),
  });

  const click = async () => {
    const newErrors = getValidationErrors();
    setErrors(newErrors);
    if (Object.values(newErrors).some((e) => e)) return;

    try {
      setServerError("");
      let data;
      if (isLogin) {
        data = await auth(login, password);
      } else {
        data = await registration(login, email, password);
      }
      user.setUser(user);
      user.setIsAuth(true);
      if (data.role === "ADMIN") {
        user.setIsAdmin(true);
        navigate(ADMIN_ROUTE);
      }
      navigate(HOME_ROUTE);
    } catch (e) {
      setServerError(e?.response?.data?.message || "Ошибка сервера");
    }
  };

  return (
    <Container className="mt-5 d-flex justify-content-center align-items-center">
      <Card
        data-bs-theme="dark"
        style={{ width: 600, background: "none", color: "white" }}
        className="mt-5 p-5"
      >
        <h2 className="ml-auto">{isLogin ? "Авторизация" : "Регистрация"}</h2>
        {serverError && (
          <div className="text-danger mt-3" style={{ fontWeight: "bold" }}>
            {serverError}
          </div>
        )}
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            click();
          }}
          className="d-flex flex-column"
        >
          {!isLogin && (
            <>
              <Form.Control
                className="mt-3"
                placeholder="Введите ваш email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
              />
              {errors.email && (
                <Form.Text className="text-danger">{errors.email}</Form.Text>
              )}
            </>
          )}
          <Form.Control
            className="mt-3"
            type="text"
            placeholder="Введите ваш логин..."
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            autoComplete="username"
          />
          {errors.login && (
            <Form.Text className="text-danger">{errors.login}</Form.Text>
          )}
          <Form.Control
            className="mt-3"
            type="password"
            placeholder="Введите ваш пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {errors.password && (
            <Form.Text className="text-danger">{errors.password}</Form.Text>
          )}

          <div className="d-flex justify-content-between align-items-center mt-3">
            {isLogin ? (
              <div>
                Нет аккаунта?{" "}
                <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink>
              </div>
            ) : (
              <div>
                Уже есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
              </div>
            )}
            <Button variant="outline-success" onClick={click}>
              {isLogin ? "Войти" : "Зарегистрироваться"}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
});

export default AuthPage;
