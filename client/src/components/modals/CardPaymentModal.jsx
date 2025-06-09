import { Modal, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

const cardSchema = Yup.object().shape({
  cardName: Yup.string()
    .matches(
      /^[A-ZА-ЯЁ][A-ZА-ЯЁ]+\s[A-ZА-ЯЁ]+$/i,
      "Введите имя и фамилию через пробел"
    )
    .required("Обязательное поле"),

  cardNumber: Yup.string()
    .matches(
      /^\d{4} \d{4} \d{4} \d{4}$/,
      "Номер карты должен быть в формате 0000 0000 0000 0000"
    )
    .required("Обязательное поле"),

  expiry: Yup.string()
    .matches(/^\d{2}\/\d{2}$/, "Введите срок в формате MM/YY")
    .required("Обязательное поле"),

  cvc: Yup.string()
    .matches(/^\d{3,4}$/, "Введите 3–4 цифры")
    .required("Обязательное поле"),
});

const formatCardNumber = (value) =>
  value
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim()
    .slice(0, 19);

const formatExpiry = (value) =>
  value
    .replace(/\D/g, "")
    .replace(/^(.{2})(.)/, "$1/$2")
    .slice(0, 5);

const CardPaymentModal = ({ show, onHide, onSuccess }) => {
  const formik = useFormik({
    initialValues: {
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
    },
    validationSchema: cardSchema,
    onSubmit: (values) => {
      onSuccess(values);
    },
  });

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
              ПРИМЕР БАНКА
            </text>
            <text x="20" y="100" fill="#fff" fontSize="20" letterSpacing="2px">
              {formik.values.cardNumber || "#### #### #### ####"}
            </text>
            <text x="20" y="140" fill="#fff" fontSize="14">
              {formik.values.cardName || "ИМЯ ФАМИЛИЯ"}
            </text>
            <text x="320" y="140" fill="#fff" fontSize="14">
              {formik.values.expiry || "MM/YY"}
            </text>
          </svg>
        </div>

        <Form data-bs-theme="dark" onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Имя и фамилия</Form.Label>
            <Form.Control
              type="text"
              name="cardName"
              placeholder="Иван Иванов"
              value={formik.values.cardName}
              onChange={(e) =>
                formik.setFieldValue("cardName", e.target.value.toUpperCase())
              }
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.cardName && !!formik.errors.cardName}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.cardName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Номер карты</Form.Label>
            <Form.Control
              type="text"
              name="cardNumber"
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              value={formik.values.cardNumber}
              onChange={(e) =>
                formik.setFieldValue(
                  "cardNumber",
                  formatCardNumber(e.target.value)
                )
              }
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.cardNumber && !!formik.errors.cardNumber
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.cardNumber}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Срок действия</Form.Label>
            <Form.Control
              type="text"
              name="expiry"
              placeholder="MM/YY"
              maxLength={5}
              value={formik.values.expiry}
              onChange={(e) =>
                formik.setFieldValue("expiry", formatExpiry(e.target.value))
              }
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.expiry && !!formik.errors.expiry}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.expiry}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>CVC/CVV</Form.Label>
            <Form.Control
              type="text"
              name="cvc"
              placeholder="123"
              maxLength={4}
              value={formik.values.cvc}
              onChange={(e) =>
                formik.setFieldValue(
                  "cvc",
                  e.target.value.replace(/\D/g, "").slice(0, 4)
                )
              }
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.cvc && !!formik.errors.cvc}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.cvc}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="outline-warning"
            type="submit"
            className="w-100 fw-bold"
          >
            Оплатить
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CardPaymentModal;
