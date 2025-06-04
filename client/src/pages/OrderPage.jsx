import { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { observer } from "mobx-react-lite";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Spinner,
} from "react-bootstrap";
import { createOrder } from "../http/orderApi";
import { SHOP_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";
import CreateAddress from "../components/modals/CreateAddress";

const OrderPage = observer(() => {
  const { basket, address } = useContext(Context);
  const navigate = useNavigate();

  const [deliveryMethod, setDeliveryMethod] = useState("courier");
  const [paymentMethod, setPaymentMethod] = useState("sbp");

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    address.loadAddresses();
  }, []);

  const openAddressModal = (addr = null) => {
    if (addr) {
      setEditingAddress(addr);
    } else {
      setEditingAddress(null);
    }
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
  };

  const subtotal = basket.totalPrice;

  let shippingCost = 0;
  let deliveryEstimate = "";
  if (deliveryMethod === "courier") {
    shippingCost = 500;
    deliveryEstimate = "1–2 рабочих дня";
  } else if (deliveryMethod === "pickup") {
    shippingCost = 0;
    deliveryEstimate = "Самовывоз: сегодня";
  } else if (deliveryMethod === "express") {
    shippingCost = 1500;
    deliveryEstimate = "Завтра";
  }

  const total = subtotal + shippingCost;

  const handlePlaceOrder = async () => {
    if (!address.selectedAddressId) {
      alert("Пожалуйста, выберите адрес доставки");
      return;
    }

    const orderData = {
      addressId: address.selectedAddressId,
      deliveryMethod,
      paymentMethod,
    };

    try {
      await createOrder(orderData);
      alert("Заказ успешно оформлен!");
      basket.setItems([]);
      navigate(SHOP_ROUTE);
    } catch (e) {
      console.error(e);
      alert("Ошибка при создании заказа");
    }
  };

  return (
    <Container className="mt-4 text-white" data-bs-theme="dark">
      <Row>
        <Col md={8}>
          <Card className="mb-4 bg-dark text-white">
            <Card.Header className="fw-bold">Адреса доставки</Card.Header>
            <Card.Body>
              {address.loading ? (
                <Spinner animation="border" />
              ) : (
                <>
                  {address.addresses.length === 0 && (
                    <p>Адресов пока нет. Нажмите «Добавить адрес»</p>
                  )}
                  {address.addresses.map((addr) => (
                    <Card
                      key={addr.id}
                      className={`mb-2 ${
                        addr.id === address.selectedAddressId
                          ? "border border-warning"
                          : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => address.setSelectedAddress(addr.id)}
                    >
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
                              onClick={(e) => {
                                e.stopPropagation();
                                openAddressModal(addr);
                              }}
                              className="me-2"
                            >
                              Редактировать
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (
                                  window.confirm(
                                    "Вы уверены, что хотите удалить этот адрес?"
                                  )
                                ) {
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
                    Добавить новый адрес
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-4 bg-dark text-white">
            <Card.Header className="fw-bold">Способ доставки</Card.Header>
            <Card.Body>
              <Row className="mb-2">
                <Col>
                  <Form.Check
                    type="radio"
                    id="delivery-courier"
                    label="Курьером (500₽, 1–2 дня)"
                    name="deliveryMethod"
                    value="courier"
                    checked={deliveryMethod === "courier"}
                    onChange={() => setDeliveryMethod("courier")}
                  />
                </Col>
                <Col>
                  <Form.Check
                    type="radio"
                    id="delivery-pickup"
                    label="Самовывоз (бесплатно, сегодня)"
                    name="deliveryMethod"
                    value="pickup"
                    checked={deliveryMethod === "pickup"}
                    onChange={() => setDeliveryMethod("pickup")}
                  />
                </Col>
                <Col>
                  <Form.Check
                    type="radio"
                    id="delivery-express"
                    label="Экспресс (1500₽, завтра)"
                    name="deliveryMethod"
                    value="express"
                    checked={deliveryMethod === "express"}
                    onChange={() => setDeliveryMethod("express")}
                  />
                </Col>
              </Row>
              <div className="mt-2">
                <i>Ожидаемая дата доставки: {deliveryEstimate}</i>
              </div>
            </Card.Body>
          </Card>

          <Card className="mb-4 bg-dark text-white">
            <Card.Header className="fw-bold">Способ оплаты</Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Check
                    type="radio"
                    id="pay-sbp"
                    label="СБП"
                    name="paymentMethod"
                    value="sbp"
                    checked={paymentMethod === "sbp"}
                    onChange={() => setPaymentMethod("sbp")}
                  />
                </Col>
                <Col md={6}>
                  <Form.Check
                    type="radio"
                    id="pay-mir"
                    label="Картой «Мир»"
                    name="paymentMethod"
                    value="mir"
                    checked={paymentMethod === "mir"}
                    onChange={() => setPaymentMethod("mir")}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={6}>
                  <Form.Check
                    type="radio"
                    id="pay-visa-russia"
                    label="Картой (Visa, Mastercard РФ)"
                    name="paymentMethod"
                    value="visa_russia"
                    checked={paymentMethod === "visa_russia"}
                    onChange={() => setPaymentMethod("visa_russia")}
                  />
                </Col>
                <Col md={6}>
                  <Form.Check
                    type="radio"
                    id="pay-visa-foreign"
                    label="Картой (Visa, Mastercard, Amex)"
                    name="paymentMethod"
                    value="visa_foreign"
                    checked={paymentMethod === "visa_foreign"}
                    onChange={() => setPaymentMethod("visa_foreign")}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={6}>
                  <Form.Check
                    type="radio"
                    id="pay-crypto"
                    label="Криптовалюта"
                    name="paymentMethod"
                    value="crypto"
                    checked={paymentMethod === "crypto"}
                    onChange={() => setPaymentMethod("crypto")}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="bg-dark text-white mb-4">
            <Card.Header className="fw-bold">Ваш заказ</Card.Header>
            <Card.Body>
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
                    <th>Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {basket.items.map(({ id, device, quantity }) => (
                    <tr key={id}>
                      <td style={{ width: "64px" }}>
                        <img
                          src={import.meta.env.VITE_API_URL + device.img}
                          alt={device.name}
                          width={64}
                          height={64}
                          style={{ objectFit: "cover" }}
                        />
                      </td>
                      <td className="fw-semibold">{device.name}</td>
                      <td>{quantity}</td>
                      <td>{device.price * quantity} ₽</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <hr className="border-secondary" />
              <div className="d-flex justify-content-between mb-2">
                <span>Промежуточный итог:</span>
                <span>{subtotal} ₽</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Стоимость доставки:</span>
                <span>{shippingCost} ₽</span>
              </div>
              <hr className="border-secondary" />
              <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                <span>Итого (с НДС):</span>
                <span>{total} ₽</span>
              </div>
              <Button
                variant="success"
                size="lg"
                className="w-100 fw-bold"
                disabled={!address.selectedAddressId}
                onClick={handlePlaceOrder}
              >
                Разместить заказ
              </Button>
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

export default OrderPage;
