// src/components/BrandBar.jsx
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../main";
import { Row, Button, Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { SHOP_ROUTE } from "../utils/consts";

const BrandBar = observer(() => {
  const { device } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  const handleBrandClick = (brand) => {
    const params = new URLSearchParams(location.search);

    // Установим brandId, сбросим страницу
    params.set("brandId", brand.id);
    params.set("page", 1);

    // Если нужно сбросить категорию при выборе бренда:
    // params.delete("typeId");

    navigate({
      pathname: SHOP_ROUTE,
      search: params.toString(),
    });
  };

  return (
    <Container className="d-flex mb-3">
      <Row>
        {device.brands.map((brand) => (
          <Button
            key={brand.id}
            variant={
              device.selectedBrand.id === brand.id
                ? "primary"
                : "outline-secondary"
            }
            className="me-2"
            onClick={() => handleBrandClick(brand)}
          >
            {brand.name}
          </Button>
        ))}
      </Row>
    </Container>
  );
});

export default BrandBar;
