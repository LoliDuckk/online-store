import { Button, Card, Col, Image } from "react-bootstrap";
import star from "../assets/star.svg";
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE } from "../utils/consts";
import { addToBasket } from "../http/basketApi";
import { useContext } from "react";
import { Context } from "../main";

export default function DeviceItem({ device }) {
  const navigate = useNavigate();
  const { basket } = useContext(Context);

  const handleAddToBasket = async (e) => {
    e.stopPropagation();
    const item = await addToBasket(device.id);
    basket.addItem(item);
  };

  return (
    <Col
      md={3}
      className="mt-3"
      onClick={() => navigate(DEVICE_ROUTE + "/" + device.id)}
    >
      <Card style={{ width: 150, cursor: "pointer" }} border={"light"}>
        <Image
          width={150}
          height={150}
          src={import.meta.env.VITE_API_URL + device.img}
        />
        <div className="text-black-50 mt-1 d-flex justify-content-between align-items-center">
          <div>Aboba</div>
          <div className="d-flex align-items-center">
            <div>{device.rating}</div>
            <Image width={18} height={18} src={star} />
          </div>
        </div>
        <div>{device.name}</div>
        <Button
          variant="outline-dark"
          size="sm"
          className="mt-2"
          onClick={handleAddToBasket}
        >
          В корзину
        </Button>
      </Card>
    </Col>
  );
}
