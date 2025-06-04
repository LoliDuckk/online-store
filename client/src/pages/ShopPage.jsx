import { Col, Container, Row } from "react-bootstrap";
import FilterBar from "../components/FilterBar";
import DeviceList from "../components/DeviceList";
import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import { Context } from "../main";
import { fetchBrands, fetchDevices, fetchTypes } from "../http/deviceApi";
import Pages from "../components/Pages";
import { useLocation } from "react-router-dom";

const ShopPage = observer(() => {
  const { device } = useContext(Context);
  const location = useLocation();

  useEffect(() => {
    fetchTypes().then((data) => device.setTypes(data));
    fetchBrands().then((data) => device.setBrands(data));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const typeId = params.get("typeId") || null;
    const brandId = params.get("brandId") || null;
    const page = Number(params.get("page")) || 1;
    const limit = Number(params.get("limit")) || device.limit;
    const priceFrom = params.get("priceFrom") || null;
    const priceTo = params.get("priceTo") || null;
    const sort = params.get("sort") || null;
    const query = params.get("query") || null;

    device.setPage(page);
    device.setSelectedType(typeId ? { id: Number(typeId) } : {});
    device.setSelectedBrand(brandId ? { id: Number(brandId) } : {});

    fetchDevices(
      typeId,
      brandId,
      page,
      limit,
      priceFrom,
      priceTo,
      sort,
      query
    ).then((data) => {
      device.setDevices(data.rows);
      device.setTotalCount(data.count);
    });
  }, [location.search]);

  return (
    <Container data-bs-theme="dark" className="mt-2">
      <Row>
        <Col md="auto">
          <FilterBar />
        </Col>
        <Col>
          <DeviceList />
          <Pages />
        </Col>
      </Row>
    </Container>
  );
});

export default ShopPage;
