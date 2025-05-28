import { useContext, useEffect } from "react";
import { Context } from "../main";
import { observer } from "mobx-react-lite";
import { getBasket, removeFromBasket, updateQuantity } from "../http/basketApi";
import { Button, Container, Image, Table, Form } from "react-bootstrap";

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
    <Container className="mt-4">
      <h2 className="mb-4 fw-bold fs-2">Ваша Корзина</h2>
      {basket.items.length === 0 ? (
        <p className="fs-2 text-muted">
          Ваша корзина пуста. Добавьте несколько товаров в корзину, нажав кнопку
          ‘В корзину‘
        </p>
      ) : (
        <>
          <Table
            striped
            bordered
            hover
            responsive
            className="align-middle text-center fs-5"
          >
            <thead className="table-dark text-white fs-5">
              <tr>
                <th>Изображение</th>
                <th>Название</th>
                <th>Цена</th>
                <th>Количество</th>
                <th>Итоговая цена</th>
                <th>Действия</th>
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
                      style={{ objectFit: "cover" }}
                      rounded
                    />
                  </td>
                  <td className="fw-semibold">{device?.name}</td>
                  <td>{device?.price} ₽</td>
                  <td>
                    <Form.Control
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(id, +e.target.value)
                      }
                      style={{
                        width: "80px",
                        margin: "0 auto",
                        fontWeight: "500",
                      }}
                      min={1}
                    />
                  </td>
                  <td className="fw-semibold">
                    {device?.price && quantity ? device.price * quantity : 0} ₽
                  </td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="fw-bold"
                      onClick={() => handleRemove(id)}
                    >
                      Удалить
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="text-end mt-4">
            <h4 className="fw-bold fs-3">Итого: {basket.totalPrice} ₽</h4>
            <Button variant="success" size="lg" className="fw-bold mt-2">
              Оформить заказ
            </Button>
          </div>
        </>
      )}
    </Container>
  );
});

export default BasketPage;
