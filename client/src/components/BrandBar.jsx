import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../main";
import { Card, Col, Row } from "react-bootstrap";

const BrandBar = observer(() => {
  const { device } = useContext(Context);
  return (
    <Row className="d-flex">
      {device.brands.map((brand) => (
        <Col md="auto" key={brand.id}>
          <Card
            style={{ cursor: "pointer" }}
            key={brand.id}
            className="p-2"
            onClick={() => device.setSelectedBrand(brand)}
            border={brand.id === device.selectedBrand.id ? "danger" : "light"}
          >
            {brand.name}
          </Card>
        </Col>
      ))}
    </Row>
  );
});

export default BrandBar;
