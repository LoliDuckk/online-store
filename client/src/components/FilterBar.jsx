import { useContext, useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { Context } from "../main";
import { SHOP_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";
import { fetchDevices } from "../http/deviceApi";

const FilterBar = observer(() => {
  const { device } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeId = params.get("typeId") || null;
    const brandId = params.get("brandId") || null;

    fetchDevices(typeId, brandId, 1, 255).then((data) => {
      if (!data?.rows?.length) return;
      const { min, max } = data.rows.reduce(
        (acc, device) => ({
          min: Math.min(acc.min, device.price),
          max: Math.max(acc.max, device.price),
        }),
        { min: data.rows[0].price, max: data.rows[0].price }
      );
      setMinPrice(min);
      setMaxPrice(max);
    });
  }, [location.search]);

  const handlePriceInput = ({ value, min, max, otherValue, type }) => {
    if (value === "") return "";
    let num = Number(value);
    if (num < min) num = min;
    if (num > max) num = max;
    if (otherValue !== "") {
      const otherNum = Number(otherValue);
      if (type === "from" && num > otherNum) num = otherNum;
      if (type === "to" && num < otherNum) num = otherNum;
    }
    return num.toString();
  };

  const applyFilters = () => {
    const params = new URLSearchParams(location.search);

    priceFrom ? params.set("priceFrom", priceFrom) : params.delete("priceFrom");
    priceTo ? params.set("priceTo", priceTo) : params.delete("priceTo");
    selectedBrandId
      ? params.set("brandId", selectedBrandId)
      : params.delete("brandId");
    sort ? params.set("sort", sort) : params.delete("sort");

    params.set("page", 1);

    navigate({
      pathname: SHOP_ROUTE,
      search: params.toString(),
    });
  };

  const resetFilters = () => {
    const params = new URLSearchParams(location.search);
    params.delete("priceFrom");
    params.delete("priceTo");
    params.delete("brandId");
    params.delete("sort");
    params.set("page", 1);

    setPriceFrom("");
    setPriceTo("");
    setSelectedBrandId("");
    setSort("");

    navigate({
      pathname: SHOP_ROUTE,
      search: params.toString(),
    });
  };

  return (
    <Form
      className="mb-3 p-2 border rounded text-white"
      style={{
        backgroundColor: "#303030",
        fontSize: "0.875rem",
      }}
    >
      <Form.Group className="mb-2">
        <Form.Label>Цена</Form.Label>
        <div className="d-flex flex-column gap-1">
          <Form.Control
            type="number"
            size="sm"
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
            onBlur={(e) =>
              setPriceFrom(
                handlePriceInput({
                  value: e.target.value,
                  min: minPrice,
                  max: maxPrice,
                  otherValue: priceTo,
                  type: "from",
                })
              )
            }
            placeholder={`от ${minPrice}`}
            min={minPrice}
            max={maxPrice}
          />
          <Form.Control
            type="number"
            size="sm"
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
            onBlur={(e) =>
              setPriceTo(
                handlePriceInput({
                  value: e.target.value,
                  min: minPrice,
                  max: maxPrice,
                  otherValue: priceFrom,
                  type: "to",
                })
              )
            }
            placeholder={`до ${maxPrice}`}
            min={minPrice}
            max={maxPrice}
          />
        </div>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Бренд</Form.Label>
        <Form.Select
          size="sm"
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
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Сортировка</Form.Label>
        <Form.Select
          size="sm"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">По умолчанию</option>
          <option value="price_asc">По цене ↑</option>
          <option value="price_desc">По цене ↓</option>
          <option value="name_asc">По названию А-Я</option>
          <option value="name_desc">По названию Я-А</option>
        </Form.Select>
      </Form.Group>

      <div className="d-flex flex-column gap-1 mt-2">
        <Button size="sm" variant="warning" onClick={applyFilters}>
          Применить
        </Button>
        <Button size="sm" variant="outline-warning" onClick={resetFilters}>
          Сбросить
        </Button>
      </div>
    </Form>
  );
});

export default FilterBar;
