import { useContext, useEffect } from "react";
import { Context } from "../main";
import { observer } from "mobx-react-lite";
import { getBasket, removeFromBasket, updateQuantity } from "../http/basketApi";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";

const BasketPage = observer(() => {
  const { basket } = useContext(Context);

  useEffect(() => {
    getBasket().then((data) => {
      basket.setItems(data.basket_devices || []);
    });
  }, []);

  const handleQuantityChange = (id, quantity) => {
    updateQuantity(id, quantity).then(() => {
      basket.updateQuantity(id, quantity);
    });
  };

  const handleRemove = (id) => {
    removeFromBasket(id).then(() => {
      basket.removeItem(id);
    });
  };

  return (
    <Container className="mt-3">
      <h2>Ваша Корзина</h2>
      {basket.items.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <>
          {basket.items.map(({ id, device, quantity }) => (
            <Card key={id} className="mb-3">
              <Row className="align-items-center">
                <Col md={2}>
                  <Image
                    src={import.meta.env.VITE_API_URL + device.img}
                    width={100}
                  />
                </Col>
                <Col md={4}>{device.name}</Col>
                <Col md={2}>{device.price} ₽</Col>
                <Col md={2}>
                  <select
                    value={quantity}
                    onChange={(e) => handleQuantityChange(id, +e.target.value)}
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col md={2}>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleRemove(id)}
                  >
                    Удалить
                  </Button>
                </Col>
              </Row>
            </Card>
          ))}
          <h4 className="text-end mt-3">Итого: {basket.totalPrice} ₽</h4>
          <div className="text-end">
            <Button variant="success">Оформить заказ</Button>
          </div>
        </>
      )}
    </Container>
  );
});

export default BasketPage;
