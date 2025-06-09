import { useEffect, useState } from "react";
import { Modal, Table, Spinner } from "react-bootstrap";
import { fetchUsersWithStats } from "../../http/userApi";

export default function UserStatsModal({ show, onHide }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (show) {
      setLoading(true);
      fetchUsersWithStats()
        .then((res) => setUsers(res))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [show]);

  return (
    <Modal
      style={{ color: "white" }}
      data-bs-theme="dark"
      show={show}
      onHide={onHide}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Пользователи и статистика</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Логин</th>
                <th>Email</th>
                <th>Дата регистрации</th>
                <th>Заказов</th>
                <th>Сумма заказов</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.login}</td>
                  <td>{u.email}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>{u.orderCount || 0}</td>
                  <td>{parseFloat(u.totalSpent || 0).toFixed(2)} ₽</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
    </Modal>
  );
}
