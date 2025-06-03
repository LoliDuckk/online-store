import { Col, Container, Row } from "react-bootstrap";
import BrandBar from "../components/BrandBar";
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

    device.setPage(page);
    device.setSelectedType(typeId ? { id: typeId } : {});
    device.setSelectedBrand(brandId ? { id: brandId } : {});

    fetchDevices(typeId, brandId, page, limit).then((data) => {
      const filteredDevices = query
        ? data.rows.filter((device) =>
            device.name.toLowerCase().includes(query)
          )
        : data.rows;

      device.setDevices(filteredDevices);
      device.setTotalCount(filteredDevices.length);
    });
  }, [location.search]);

  return (
    <Container data-bs-theme="dark" className="mt-2">
      <Row>
        <Col md="auto">
          <BrandBar />
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
