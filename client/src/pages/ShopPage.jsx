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

    const typeId = params.get("typeId") ? Number(params.get("typeId")) : null;
    const brandId = params.get("brandId")
      ? Number(params.get("brandId"))
      : null;
    const page = params.get("page") ? Number(params.get("page")) : 1;
    const limit = params.get("limit")
      ? Number(params.get("limit"))
      : device.limit;
    const query = params.get("query")?.toLowerCase() || "";

    const priceFromParam = params.get("priceFrom");
    const priceToParam = params.get("priceTo");
    const priceFrom = priceFromParam ? Number(priceFromParam) : null;
    const priceTo = priceToParam ? Number(priceToParam) : null;

    const sort = params.get("sort");

    device.setPage(page);
    device.setSelectedType(typeId ? { id: typeId } : {});
    device.setSelectedBrand(brandId ? { id: brandId } : {});

    fetchDevices(typeId, brandId, page, limit).then((data) => {
      let filteredDevices = data.rows;

      if (query) {
        filteredDevices = filteredDevices.filter((device) =>
          device.name.toLowerCase().includes(query)
        );
      }

      if (priceFrom !== null) {
        filteredDevices = filteredDevices.filter(
          (device) => device.price >= priceFrom
        );
      }
      if (priceTo !== null) {
        filteredDevices = filteredDevices.filter(
          (device) => device.price <= priceTo
        );
      }

      if (sort === "price_asc") {
        filteredDevices.sort((a, b) => a.price - b.price);
      } else if (sort === "price_desc") {
        filteredDevices.sort((a, b) => b.price - a.price);
      } else if (sort === "name_asc") {
        filteredDevices.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sort === "name_desc") {
        filteredDevices.sort((a, b) => b.name.localeCompare(a.name));
      }

      device.setDevices(filteredDevices);
      device.setTotalCount(filteredDevices.length);
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
