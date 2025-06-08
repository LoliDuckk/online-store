import { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { fetchOrders } from "../http/orderApi";
import { observer } from "mobx-react-lite";
import { Container, Accordion, Table, Spinner } from "react-bootstrap";
import moment from "moment";

const OrderHistoryPage = observer(() => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (e) {
        console.error("Ошибка при загрузке истории заказов", e);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <Container
        className="mt-4 text-white d-flex justify-content-center"
        data-bs-theme="dark"
      >
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4 text-white" data-bs-theme="dark">
      {orders.length === 0 ? (
        <div>У вас пока нет заказов.</div>
      ) : (
        <Accordion>
          <h2 className="mb-4">Ваша история заказов</h2>
          {orders.map((order, idx) => (
            <Accordion.Item eventKey={String(idx)} key={order.id}>
              <Accordion.Header>
                <div className="d-flex justify-content-between w-100">
                  <span>Заказ №{order.id}</span>
                  <span>
                    {moment(order.createdAt).format("DD.MM.YYYY HH:mm")}
                  </span>
                  <span>Сумма: {order.total} ₽</span>
                  <span style={{ marginRight: "10px" }}>
                    Статус: {order.status}
                  </span>
                </div>
              </Accordion.Header>
              <Accordion.Body className="bg-dark text-white">
                <Table
                  striped
                  bordered
                  hover
                  responsive
                  className="align-middle text-center text-white"
                >
                  <thead>
                    <tr>
                      <th>Изображение</th>
                      <th>Название</th>
                      <th>Кол-во</th>
                      <th>Цена</th>
                      <th>Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.order_devices.map(({ id, device, quantity }) => (
                      <tr key={id}>
                        <td style={{ width: "64px" }}>
                          <img
                            src={import.meta.env.VITE_API_URL + device?.img}
                            alt={device?.name}
                            width={64}
                            height={64}
                            style={{ objectFit: "cover" }}
                          />
                        </td>
                        <td className="fw-semibold">{device?.name}</td>
                        <td>{quantity}</td>
                        <td>{device?.price} ₽</td>
                        <td>{device?.price * quantity} ₽</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="d-flex justify-content-end">
                  <div>
                    <div>Доставка: {order.shippingCost} ₽</div>
                    <div className="fw-bold mt-2">Итого: {order.total} ₽</div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}

      <style>
        {`
.accordion-button:not(.collapsed) {
color: #212529 !important;
  background-color: #ffc107 !important;
}
      `}
      </style>
    </Container>
  );
});

export default OrderHistoryPage;
