import { useEffect, useState } from "react";
import { Form, Modal, Table } from "react-bootstrap";
import { fetchAllOrders, updateOrderStatus } from "../../http/orderApi";
import { translateStatus } from "../../utils/translate";

const statusOptions = [
  "PENDING",
  "PROCESSING",
  "SHIPPING",
  "DELIVERED",
  "CANCELLED",
];

export default function ManageOrders({ show, onHide }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (show) {
      fetchAllOrders().then(setOrders).catch(console.error);
    }
  }, [show]);

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    const updated = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updated);
  };

  return (
    <Modal
      style={{ color: "white" }}
      show={show}
      onHide={onHide}
      size="lg"
      centered
      data-bs-theme="dark"
    >
      <Modal.Header closeButton>
        <Modal.Title>Управление заказами</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover variant="dark" responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>ID пользователя</th>
              <th>Имя получателя</th>
              <th>Статус</th>
              <th>Сумма</th>
              <th>Изменить статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.userId}</td>
                <td>
                  {(() => {
                    try {
                      const addr = JSON.parse(order.address);
                      return addr.fullName || "—";
                    } catch (e) {
                      return "Неверный формат";
                    }
                  })()}
                </td>
                <td>{translateStatus(order.status)}</td>

                <td>{order.total} ₽</td>
                <td>
                  <Form.Select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}
