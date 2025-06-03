import { useContext, useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { Context } from "../main";
import { SHOP_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";

const FilterBar = observer(() => {
  const { device } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPriceFrom(params.get("priceFrom") || "");
    setPriceTo(params.get("priceTo") || "");
    setSelectedBrandId(params.get("brandId") || "");
    setSort(params.get("sort") || "");
  }, [location.search]);

  const applyFilters = () => {
    const params = new URLSearchParams(location.search);

    if (priceFrom) params.set("priceFrom", priceFrom);
    else params.delete("priceFrom");

    if (priceTo) params.set("priceTo", priceTo);
    else params.delete("priceTo");

    if (selectedBrandId) params.set("brandId", selectedBrandId);
    else params.delete("brandId");

    if (sort) params.set("sort", sort);
    else params.delete("sort");

    params.set("page", 1); // сброс страницы

    navigate({
      pathname: SHOP_ROUTE,
      search: params.toString(),
    });
  };

  return (
    <Form
      className="mb-3 p-3 border rounded"
      style={{ backgroundColor: "#1c1c1c" }}
    >
      <Row className="mb-3">
        <Col>
          <Form.Label>Цена от</Form.Label>
          <Form.Control
            type="number"
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
            placeholder="0"
          />
        </Col>
        <Col>
          <Form.Label>до</Form.Label>
          <Form.Control
            type="number"
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
            placeholder="100000"
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Label>Бренд</Form.Label>
          <Form.Select
            value={selectedBrandId}
            onChange={(e) => setSelectedBrandId(e.target.value)}
          >
            <option value="">Все</option>
            {device.brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={6}>
          <Form.Label>Сортировка</Form.Label>
          <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">По умолчанию</option>
            <option value="price_asc">По цене ↑</option>
            <option value="price_desc">По цене ↓</option>
            <option value="name_asc">По названию A-Z</option>
            <option value="name_desc">По названию Z-A</option>
          </Form.Select>
        </Col>
      </Row>
      <Button variant="warning" onClick={applyFilters}>
        Применить
      </Button>
    </Form>
  );
});

export default FilterBar;
