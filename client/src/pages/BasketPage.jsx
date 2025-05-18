import { useContext, useEffect } from "react";
import { Context } from "../main";
import { observer } from "mobx-react-lite";
import { getBasket, removeFromBasket, updateQuantity } from "../http/basketApi";
import { Button, Container, Image, Table } from "react-bootstrap";

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
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Изображение</th>
                <th>Название</th>
                <th>Цена</th>
                <th>Количесво</th>
                <th>Итоговая цена</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {basket.items.map(({ id, device, quantity }) => (
                <tr key={id}>
                  <td>
                    <Image
                      src={import.meta.env.VITE_API_URL + device?.img}
                      width={100}
                      height={100}
                    />
                  </td>
                  <td>{device?.name}</td>
                  <td>{device?.price}</td>
                  <td>
                    <input
                      style={{ border: "none" }}
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(id, +e.target.value)
                      }
                      type="number"
                    />
                  </td>
                  <td>{device?.price * quantity}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleRemove(id)}
                    >
                      Удалить
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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
