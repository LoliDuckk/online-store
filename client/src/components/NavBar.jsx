import { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import {
  Button,
  Container,
  Dropdown,
  Image,
  Navbar,
  Form,
} from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HOME_ROUTE,
  LOGIN_ROUTE,
  PROFILE_ROUTE,
  BASKET_ROUTE,
  ADMIN_ROUTE,
  CATEGORY_ROUTE,
  SHOP_ROUTE,
  HISTORY_ROUTE,
} from "../utils/consts";
import { observer } from "mobx-react-lite";
import logoIcon from "../assets/logo.svg";
import profileIcon from "../assets/user2.svg";
import basketIcon from "../assets/basket.svg";
import cmsIcon from "../assets/cms.svg";
import searchIcon from "../assets/search.svg";
import catalogIcon from "../assets/archive.svg";
import { getBasket } from "../http/basketApi";

const NavBar = observer(() => {
  const { user, basket } = useContext(Context);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
    user.setIsAdmin(false);
    localStorage.removeItem("token");
    navigate(LOGIN_ROUTE);
  };

  useEffect(() => {
    if (user.isAuth) {
      getBasket().then((data) => {
        basket.setItems(data.basket_devices || []);
      });
    }
  }, [user.isAuth]);

  return (
    <Navbar bg="black" data-bs-theme="dark" expand="lg" className="py-2">
      <Container>
        <Navbar.Brand
          as={NavLink}
          to={HOME_ROUTE}
          className="d-flex align-items-center text-white"
        >
          <Image src={logoIcon} height={50} className="me-2" />
          <span className="fs-2">Techno</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" className="border-0" />

        <Navbar.Collapse id="main-navbar">
          <Form
            className="d-flex align-items-center mx-lg-3 my-2 my-lg-0 w-100"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchTerm.trim()) {
                navigate(
                  `${SHOP_ROUTE}?query=${encodeURIComponent(searchTerm)}`
                );
                setSearchTerm("");
              }
            }}
          >
            <Form.Control
              type="search"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-start"
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                border: "1px solid black",
                height: "38px",
              }}
            />
            <Button
              type="submit"
              className="rounded-end d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: "#f0c000",
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                border: "1px solid black",
                height: "38px",
                padding: "0 12px",
              }}
            >
              <Image src={searchIcon} height={20} />
            </Button>
          </Form>

          <div className="d-flex flex-wrap align-items-end justify-content-end mt-3 mt-lg-0 w-100">
            <Button
              style={{
                marginRight: "10px",
                background: "none",
                border: "none",
              }}
              onClick={() => navigate(CATEGORY_ROUTE)}
            >
              <Image src={catalogIcon} height={30} />
              <br />
              <span className="fs-5">Каталог</span>
            </Button>

            {user.isAdmin && (
              <Button
                style={{
                  marginRight: "10px",
                  background: "none",
                  border: "none",
                }}
                onClick={() => navigate(ADMIN_ROUTE)}
              >
                <Image src={cmsIcon} height={30} />
                <br />
                <span className="fs-5">Админ</span>
              </Button>
            )}

            <Button
              style={{
                marginRight: "10px",
                background: "none",
                border: "none",
                position: "relative",
              }}
              onClick={() => navigate(BASKET_ROUTE)}
            >
              <Image src={basketIcon} height={30} />
              <br />
              <span className="fs-5">Корзина</span>
              {basket.items.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "0px",
                    right: "0px",
                    width: "25px",
                    height: "25px",
                    background: "#ffc107",
                    borderRadius: "50%",
                    color: "black",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {basket.items.length}
                </div>
              )}
            </Button>

            {user.isAuth ? (
              <Dropdown>
                <Dropdown.Toggle style={{ background: "none", border: "none" }}>
                  <Image src={profileIcon} height={30} />
                  <br />
                  <span className="fs-5">Профиль</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as="button"
                    onClick={() => navigate(PROFILE_ROUTE)}
                  >
                    Личный кабинет
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    onClick={() => navigate(HISTORY_ROUTE)}
                  >
                    История заказов
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as="button" onClick={logOut}>
                    Выйти
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button
                onClick={() => navigate(LOGIN_ROUTE)}
                style={{ background: "none", border: "none" }}
                className="d-flex flex-column"
              >
                <Image src={profileIcon} height={30} />
                <span className="fs-5">Войти</span>
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

export default NavBar;
