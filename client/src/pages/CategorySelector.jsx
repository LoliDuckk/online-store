import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../main";
import { fetchTypes } from "../http/deviceApi";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import { SHOP_ROUTE } from "../utils/consts";

const CategorySelector = observer(() => {
  const { device } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchTypes().then((data) => device.setTypes(data));
  }, []);

  const handleClick = (type) => {
    const params = new URLSearchParams(location.search);

    params.set("typeId", type.id);
    params.set("page", 1);

    navigate({
      pathname: SHOP_ROUTE,
      search: params.toString(),
    });
  };

  return (
    <Container data-bs-theme="dark" className="mt-4">
      <h2 className="text-white mb-4">Категории</h2>
      <Row>
        {device.types.map((type) => (
          <Col key={type.id} xs={6} sm={4} md={3} lg={3} className="mb-4">
            <Card className="category-card" onClick={() => handleClick(type)}>
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ width: "100%", height: "150px", overflow: "hidden" }}
              >
                <Image
                  src={import.meta.env.VITE_API_URL + type.img}
                  className="mt-3"
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <Card.Body className="text-center">
                <Card.Title>{type.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <style>
        {`
          .category-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
          }
        `}
      </style>
    </Container>
  );
});

export default CategorySelector;
