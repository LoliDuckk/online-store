// src/components/CategorySelector.jsx
import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../main";
import { fetchTypes } from "../http/deviceApi";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import "./CategorySelector.css";
import { SHOP_ROUTE } from "../utils/consts";

const CategorySelector = observer(() => {
  const { device } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchTypes().then((data) => device.setTypes(data));
  }, []);

  const handleClick = (type) => {
    // Получим текущие параметры (если есть), чтобы сохранить остальные (например, brandId, page, limit)
    const params = new URLSearchParams(location.search);

    // Задаём новый typeId, сбрасываем страницу на 1
    params.set("typeId", type.id);
    params.set("page", 1);

    // Удаляем brandId, если надо сбросить выбор бренда?
    // params.delete("brandId");

    // Навигируем на /shop с новыми параметрами
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
              <div className="category-image-wrapper">
                <Image
                  src={import.meta.env.VITE_API_URL + type.img}
                  className="category-image mt-3"
                />
              </div>
              <Card.Body className="text-center">
                <Card.Title className="category-title">{type.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
});

export default CategorySelector;
