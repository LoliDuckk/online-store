import { useContext, useEffect } from "react";
import { Context } from "../main";
import { Button, Container, Dropdown, Image, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HOME_ROUTE,
  LOGIN_ROUTE,
  SHOP_ROUTE,
  PROFILE_ROUTE,
  BASKET_ROUTE,
  ADMIN_ROUTE,
  CATEGORY_ROUTE,
} from "../utils/consts";
import { observer } from "mobx-react-lite";
import logoIcon from "../assets/logo.svg";
import profileIcon from "../assets/user2.svg";
import basketIcon from "../assets/basket.svg";
import cmsIcon from "../assets/cms.svg";
import { getBasket } from "../http/basketApi";

const NavBar = observer(() => {
  const { user, basket } = useContext(Context);
  const navigate = useNavigate();

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
    <>
      <Navbar bg="black" data-bs-theme="dark">
        <Container>
          <NavLink
            className="fs-1 text-decoration-none d-flex align-items-center"
            style={{ color: "white" }}
            to={HOME_ROUTE}
          >
            <Image src={logoIcon} height={50} style={{ marginRight: "10px" }} />
            <span>Techno</span>
          </NavLink>
          <NavLink style={{ color: "white" }} to={CATEGORY_ROUTE}>
            Catalog
          </NavLink>
          {user.isAuth ? (
            <div className="d-flex align-items-end">
              {user.isAdmin ? (
                <Button
                  style={{
                    position: "relative",
                    marginRight: "10px",
                    background: "none",
                    border: "none",
                  }}
                  onClick={() => navigate(ADMIN_ROUTE)}
                >
                  <Image src={cmsIcon} height={30} />
                  <br />
                  <span className="fs-5">Админ панель</span>
                </Button>
              ) : (
                ""
              )}
              <Button
                style={{
                  position: "relative",
                  marginRight: "10px",
                  background: "none",
                  border: "none",
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
                      background: "red",
                      borderRadius: "50%",
                      color: "white",
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

              <Dropdown>
                <Dropdown.Toggle style={{ background: "none", border: "none" }}>
                  <Image src={profileIcon} height={30} />
                  <br />
                  <span className="fs-5">Профиль</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    className="fs-5"
                    as="button"
                    onClick={() => navigate(PROFILE_ROUTE)}
                  >
                    Личный кабинет
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="fs-5"
                    as="button"
                    onClick={() => navigate(PROFILE_ROUTE)}
                  >
                    История заказов
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    className="fs-5"
                    as="button"
                    onClick={() => logOut()}
                  >
                    Выйти
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : (
            <>
              <Button
                className="d-flex flex-column"
                onClick={() => navigate(LOGIN_ROUTE)}
                style={{ background: "none", border: "none" }}
              >
                <Image src={profileIcon} height={30} />
                <span className="fs-5">Войти</span>
              </Button>
            </>
          )}
        </Container>
      </Navbar>
    </>
  );
});

export default NavBar;
