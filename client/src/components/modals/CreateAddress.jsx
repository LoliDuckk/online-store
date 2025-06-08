import { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { Button, Form, Modal } from "react-bootstrap";
import { validateEmpty, validateFullName } from "../../utils/validate"; // путь подстрой под проект

const CreateAddress = ({ show, onHide, editingAddress }) => {
  const { address } = useContext(Context);
  const [formData, setFormData] = useState({
    country: "",
    fullName: "",
    phone: "",
    city: "",
    postalCode: "",
    street: "",
    house: "",
    apartment: "",
    isDefault: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingAddress) {
      setFormData({
        country: editingAddress.country,
        fullName: editingAddress.fullName,
        phone: editingAddress.phone,
        city: editingAddress.city,
        postalCode: editingAddress.postalCode,
        street: editingAddress.street,
        house: editingAddress.house,
        apartment: editingAddress.apartment || "",
        isDefault: editingAddress.isDefault,
      });
    } else {
      setFormData({
        country: "",
        fullName: "",
        phone: "",
        city: "",
        postalCode: "",
        street: "",
        house: "",
        apartment: "",
        isDefault: false,
      });
    }
    setErrors({});
  }, [editingAddress, show]);

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "");
    let result = "+7";

    if (digits.length > 1) result += ` (${digits.slice(1, 4)}`;
    if (digits.length >= 4) result += `) ${digits.slice(4, 7)}`;
    if (digits.length >= 7) result += `-${digits.slice(7, 9)}`;
    if (digits.length >= 9) result += `-${digits.slice(9, 11)}`;

    return result.slice(0, 18);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = name === "phone" ? formatPhone(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
    }));

    if (errors[name]) {
      validateField(name, newValue);
    }
  };

  const validateField = (name, value) => {
    let error = "";

    if (
      [
        "country",
        "fullName",
        "phone",
        "city",
        "postalCode",
        "street",
        "house",
      ].includes(name)
    ) {
      error = validateEmpty(value);
    }

    if (name === "fullName" && !error) {
      error = validateFullName(value);
    }

    if (name === "phone" && !error) {
      const phonePattern = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
      if (!phonePattern.test(value)) {
        error = "Введите номер в формате +7 (999) 999-99-99";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return !error;
  };

  const validateForm = () => {
    const fieldNames = [
      "country",
      "fullName",
      "phone",
      "city",
      "postalCode",
      "street",
      "house",
    ];

    const valid = fieldNames.every((field) =>
      validateField(field, formData[field])
    );
    return valid;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editingAddress) {
      await address.editAddress(editingAddress.id, formData);
    } else {
      await address.addAddress(formData);
    }

    onHide();
  };

  return (
    <Modal data-bs-theme="dark" show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>
          {editingAddress ? "Редактировать адрес" : "Новый адрес"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white">
        <Form onSubmit={handleSave}>
          {[
            {
              name: "country",
              label: "Страна",
              placeholder: "Например, Россия",
            },
            {
              name: "fullName",
              label: "ФИО получателя",
              placeholder: "Иванов Иван Иванович",
            },
            {
              name: "phone",
              label: "Телефон",
              placeholder: "+7 (999) 999-99-99",
            },
            { name: "city", label: "Город", placeholder: "Москва" },
            {
              name: "postalCode",
              label: "Почтовый индекс",
              placeholder: "101000",
            },
            { name: "street", label: "Улица", placeholder: "ул. Пушкина" },
            { name: "house", label: "Дом", placeholder: "д. 1" },
          ].map(({ name, label, placeholder }) => (
            <Form.Group className="mb-2" key={name}>
              <Form.Label>{label} *</Form.Label>
              <Form.Control
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                onBlur={(e) => validateField(name, e.target.value)}
                placeholder={placeholder}
                isInvalid={!!errors[name]}
                maxLength={name === "phone" ? 18 : undefined}
              />
              <Form.Control.Feedback type="invalid">
                {errors[name]}
              </Form.Control.Feedback>
            </Form.Group>
          ))}

          <Form.Group className="mb-2">
            <Form.Label>Квартира</Form.Label>
            <Form.Control
              type="text"
              name="apartment"
              value={formData.apartment}
              onChange={handleChange}
              placeholder="кв. 10"
            />
          </Form.Group>

          <Form.Group className="mb-2 form-check form-switch">
            <Form.Check
              type="checkbox"
              label="Сделать по умолчанию"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-end mt-3">
            <Button variant="outline-light" className="me-2" onClick={onHide}>
              Отмена
            </Button>
            <Button type="submit" variant="warning">
              {editingAddress ? "Сохранить" : "Добавить"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateAddress;
