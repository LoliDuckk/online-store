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
} from "../utils/consts";
import { observer } from "mobx-react-lite";
import profileIcon from "../assets/user.svg";
import basketIcon from "../assets/basket.svg";
import { getBasket } from "../http/basketApi";

const NavBar = observer(() => {
  const { user, basket } = useContext(Context);
  const navigate = useNavigate();

  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    getBasket().then((data) => {
      basket.setItems(data.basket_devices || []);
    });
  }, []);

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <NavLink style={{ color: "white" }} to={HOME_ROUTE}>
            DNS 2
          </NavLink>
          <NavLink style={{ color: "white" }} to={SHOP_ROUTE}>
            Catalog
          </NavLink>
          {user.isAuth ? (
            <>
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
                <span>Корзина</span>
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
                  <span>Профиль</span>
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
                    onClick={() => navigate(PROFILE_ROUTE)}
                  >
                    История заказов
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as="button" onClick={() => logOut()}>
                    Выйти
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            <>
              <Button
                className="d-flex flex-column"
                onClick={() => navigate(LOGIN_ROUTE)}
                style={{ background: "none", border: "none" }}
              >
                <Image src={profileIcon} height={30} />
                <span>Войти</span>
              </Button>
            </>
          )}
        </Container>
      </Navbar>
    </>
  );
});

export default NavBar;
