import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  validateCardNumber,
  validateExpiry,
  validateCVC,
  validateFullName,
} from "../../utils/validate";

const CardPaymentModal = ({ show, onHide, onSuccess }) => {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    card: "",
    expiry: "",
    cvc: "",
  });

  const handlePay = () => {
    const newErrors = {
      name: validateFullName(cardName),
      card: validateCardNumber(cardNumber),
      expiry: validateExpiry(expiry),
      cvc: validateCVC(cvc),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e !== "");
    if (hasErrors) return;

    onSuccess();
  };

  const formatCardNumber = (value) =>
    value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (value) =>
    value
      .replace(/\D/g, "")
      .replace(/^(.{2})(.)/, "$1/$2")
      .slice(0, 5);

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      className="text-white"
      data-bs-theme="dark"
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>Оплата картой</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <svg
            width="100%"
            height="200"
            viewBox="0 0 400 200"
            style={{
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2c3e50, #4ca1af)",
              color: "white",
              boxShadow: "0 0 10px rgba(255, 193, 7, 0.4)",
            }}
          >
            <text
              x="20"
              y="40"
              fill="#ffffffaa"
              fontSize="16"
              fontWeight="bold"
            >
              БАНК НЕВОЗМОЖНОГО
            </text>
            <text x="20" y="100" fill="#fff" fontSize="20" letterSpacing="2px">
              {cardNumber || "#### #### #### ####"}
            </text>
            <text x="20" y="140" fill="#fff" fontSize="14">
              {cardName || "ИМЯ ФАМИЛИЯ"}
            </text>
            <text x="320" y="140" fill="#fff" fontSize="14">
              {expiry || "MM/YY"}
            </text>
            <circle cx="360" cy="40" r="20" fill="#ffc107" opacity="0.8" />
          </svg>
        </div>

        <Form data-bs-theme="dark">
          <Form.Group className="mb-3">
            <Form.Label>Имя и фамилия</Form.Label>
            <Form.Control
              type="text"
              placeholder="Иван Иванов"
              value={cardName}
              onChange={(e) => setCardName(e.target.value.toUpperCase())}
            />
            {errors.name && (
              <Form.Text className="text-danger">{errors.name}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Номер карты</Form.Label>
            <Form.Control
              type="text"
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            />
            {errors.card && (
              <Form.Text className="text-danger">{errors.card}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Срок действия</Form.Label>
            <Form.Control
              type="text"
              placeholder="MM/YY"
              maxLength={5}
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            />
            {errors.expiry && (
              <Form.Text className="text-danger">{errors.expiry}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>CVC/CVV</Form.Label>
            <Form.Control
              type="text"
              placeholder="123"
              maxLength={4}
              value={cvc}
              onChange={(e) =>
                setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
            />
            {errors.cvc && (
              <Form.Text className="text-danger">{errors.cvc}</Form.Text>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-warning"
          className="w-100 fw-bold"
          onClick={handlePay}
        >
          Оплатить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CardPaymentModal;
