import { Button, Card, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE } from "../utils/consts";
import { addToBasket } from "../http/basketApi";
import { useContext } from "react";
import { Context } from "../main";

export default function DeviceItem({ device }) {
  const navigate = useNavigate();
  const { basket } = useContext(Context);

  const handleNavigate = () => {
    navigate(`${DEVICE_ROUTE}/${device.id}`);
  };

  const handleAddToBasket = async (e) => {
    e.stopPropagation();
    try {
      const item = await addToBasket(device.id);
      basket.addItem(item);
    } catch (error) {
      console.error("Ошибка при добавлении в корзину:", error);
    }
  };

  return (
    <Col md={3} className="mt-3">
      <Card
        className="d-flex flex-column align-items-center p-3 device-card"
        style={{
          cursor: "pointer",
          width: 270,
          height: 340,
          transition: "box-shadow 0.3s ease",
        }}
        onClick={handleNavigate}
      >
        <Image
          src={`${import.meta.env.VITE_API_URL}${device.img}`}
          alt={device.name}
          width={200}
          height={200}
          className="mb-3"
        />

        <div
          className="text-center mb-2"
          style={{
            fontSize: "0.9rem",
            lineHeight: "1.2rem",
            height: "2.4rem",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
          title={device.name}
        >
          {device.name}
        </div>

        <div className="d-flex justify-content-between align-items-center w-100 mt-auto">
          <div className="fw-bold">{device.price} ₽</div>
          <Button variant="outline-light" size="sm" onClick={handleAddToBasket}>
            В корзину
          </Button>
        </div>
      </Card>

      <style>
        {`
          .device-card:hover {
            box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
          }
        `}
      </style>
    </Col>
  );
}
