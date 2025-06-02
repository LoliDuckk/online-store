import { Col, Container, Row } from "react-bootstrap";
import BrandBar from "../components/BrandBar";
import DeviceList from "../components/DeviceList";
import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import { Context } from "../main";
import { fetchBrands, fetchDevices, fetchTypes } from "../http/deviceApi";
import Pages from "../components/Pages";

import { useLocation, useNavigate } from "react-router-dom";

const ShopPage = observer(() => {
  const { device } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  // 1) Один раз загрузили возможные типы и бренды (чтобы потом можно было спрятать лоадер, посмотреть имена и т.п.)
  useEffect(() => {
    fetchTypes().then((data) => device.setTypes(data));
    fetchBrands().then((data) => device.setBrands(data));
  }, []);

  // 2) Следим за изменением query-params (location.search)
  useEffect(() => {
    // Считываем параметры из URL
    const params = new URLSearchParams(location.search);
    // parseInt or default to null
    const typeId = params.get("typeId") ? Number(params.get("typeId")) : null;
    const brandId = params.get("brandId")
      ? Number(params.get("brandId"))
      : null;
    const page = params.get("page") ? Number(params.get("page")) : 1;
    const limit = params.get("limit")
      ? Number(params.get("limit"))
      : device.limit;

    // Чтобы в store была ссылка на текущую страницу:
    device.setPage(page);
    device.setSelectedType(typeId ? { id: typeId } : {});
    device.setSelectedBrand(brandId ? { id: brandId } : {});

    // Фетчим устройства под эти параметры
    fetchDevices(typeId, brandId, page, limit).then((data) => {
      device.setDevices(data.rows);
      device.setTotalCount(data.count);
    });
  }, [location.search]);

  return (
    <Container data-bs-theme="dark" className="mt-2">
      <Row>
        <Col md={9}>
          <BrandBar />
          <DeviceList />
          <Pages />
        </Col>
      </Row>
    </Container>
  );
});

export default ShopPage;
