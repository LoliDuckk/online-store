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
import { useFormik } from "formik";
import * as Yup from "yup";

const AuthPage = observer(() => {
  const { user } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === LOGIN_ROUTE;

  const [serverError, setServerError] = useState("");

  const validationSchema = Yup.object().shape({
    login: Yup.string()
      .min(5, "Минимум 5 символов")
      .required("Логин обязателен"),
    password: Yup.string()
      .min(5, "Минимум 5 символов")
      .required("Пароль обязателен"),
    email: isLogin
      ? Yup.string()
      : Yup.string().required("Email обязателен").email("Некорректный email"),
  });

  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setServerError("");
        let data;
        if (isLogin) {
          data = await auth(values.login, values.password);
        } else {
          data = await registration(
            values.login,
            values.email,
            values.password
          );
        }

        user.setUser(data);
        user.setIsAuth(true);
        if (data.role === "ADMIN") {
          user.setIsAdmin(true);
          navigate(ADMIN_ROUTE);
        } else {
          navigate(HOME_ROUTE);
        }
      } catch (e) {
        setServerError(e?.response?.data?.message || "Ошибка сервера");
      }
    },
  });

  return (
    <Container className="mt-5 d-flex justify-content-center align-items-center">
      <Card
        data-bs-theme="dark"
        style={{ width: 600, background: "none", color: "white" }}
        className="mt-5 p-5"
      >
        <h2 className="ml-auto">{isLogin ? "Авторизация" : "Регистрация"}</h2>
        {serverError && (
          <div className="text-danger mt-3 fw-bold">{serverError}</div>
        )}
        <Form onSubmit={formik.handleSubmit} className="d-flex flex-column">
          {!isLogin && (
            <Form.Group className="mt-3">
              <Form.Control
                name="email"
                placeholder="Введите ваш email..."
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.email && !!formik.errors.email}
                autoComplete="email"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          )}

          <Form.Group className="mt-3">
            <Form.Control
              name="login"
              type="text"
              placeholder="Введите ваш логин..."
              value={formik.values.login}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.login && !!formik.errors.login}
              autoComplete="username"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.login}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Control
              name="password"
              type="password"
              placeholder="Введите ваш пароль..."
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.password && !!formik.errors.password}
              autoComplete="current-password"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.password}
            </Form.Control.Feedback>
          </Form.Group>

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
            <Button variant="outline-success" type="submit">
              {isLogin ? "Войти" : "Зарегистрироваться"}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
});

export default AuthPage;
