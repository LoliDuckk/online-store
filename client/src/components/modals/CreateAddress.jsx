import { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { Button, Form, Modal } from "react-bootstrap";

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
  }, [editingAddress, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { country, fullName, phone, city, postalCode, street, house } =
      formData;
    if (
      !country ||
      !fullName ||
      !phone ||
      !city ||
      !postalCode ||
      !street ||
      !house
    ) {
      alert("Пожалуйста, заполните все обязательные поля");
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
          <Form.Group className="mb-2">
            <Form.Label>Страна *</Form.Label>
            <Form.Control
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Например, Россия"
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>ФИО получателя *</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Иванов Иван Иванович"
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Телефон *</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+7 912 345-67-89"
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Город *</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Москва"
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Почтовый индекс *</Form.Label>
            <Form.Control
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="101000"
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Улица *</Form.Label>
            <Form.Control
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="ул. Пушкина"
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Дом *</Form.Label>
            <Form.Control
              type="text"
              name="house"
              value={formData.house}
              onChange={handleChange}
              placeholder="д. 1"
              required
            />
          </Form.Group>

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
