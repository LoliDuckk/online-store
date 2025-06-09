import { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { observer } from "mobx-react-lite";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import CreateAddress from "../components/modals/CreateAddress";

const ProfilePage = observer(() => {
  const { user, address } = useContext(Context);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    address.loadAddresses();
  }, []);

  const openAddressModal = (addr = null) => {
    setEditingAddress(addr);
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
  };

  return (
    <Container className=" mt-4 text-white" data-bs-theme="dark">
      <Row
        className="justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Col md={6}>
          <Card className="mb-4 bg-dark text-white shadow-lg">
            <Card.Header className="fw-bold">Профиль пользователя</Card.Header>
            <Card.Body>
              <p>
                <strong>Логин:</strong> {user.user?.login}
              </p>
              <p>
                <strong>Email:</strong> {user.user?.email}
              </p>
              <p>
                <strong>Роль:</strong> {user.user?.role}
              </p>
            </Card.Body>
          </Card>

          <Card className="mb-4 bg-dark text-white">
            <Card.Header className="fw-bold">Мои адреса</Card.Header>
            <Card.Body>
              {address.loading ? (
                <Spinner animation="border" />
              ) : (
                <>
                  {address.addresses.length === 0 && (
                    <p>У вас пока нет сохранённых адресов</p>
                  )}
                  {address.addresses.map((addr) => (
                    <Card key={addr.id} className="mb-2">
                      <Card.Body>
                        <Row>
                          <Col>
                            <div>
                              <b>{addr.fullName}</b>{" "}
                              {addr.isDefault && "(Основной)"}
                            </div>
                            <div>
                              {addr.street}, д. {addr.house}
                              {addr.apartment && `, кв. ${addr.apartment}`}
                            </div>
                            <div>
                              {addr.city}, {addr.postalCode}, {addr.country}
                            </div>
                            <div>Телефон: {addr.phone}</div>
                          </Col>
                          <Col md="auto" className="d-flex align-items-center">
                            <Button
                              variant="outline-light"
                              size="sm"
                              onClick={() => openAddressModal(addr)}
                              className="me-2"
                            >
                              Редактировать
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={async () => {
                                if (window.confirm("Удалить этот адрес?")) {
                                  await address.removeAddress(addr.id);
                                }
                              }}
                            >
                              Удалить
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => openAddressModal(null)}
                  >
                    Добавить адрес
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <CreateAddress
        show={showAddressModal}
        onHide={closeAddressModal}
        editingAddress={editingAddress}
      />
    </Container>
  );
});

export default ProfilePage;
