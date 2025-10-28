import { useContext, useEffect } from "react";
import { Context } from "../../main";
import { Button, Form, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

const addressSchema = Yup.object().shape({
  country: Yup.string()
    .matches(/^[A-Za-zА-Яа-яЁё\s\-]+$/, "Страна не должна содержать цифры")
    .required("Обязательное поле"),

  fullName: Yup.string()
    .matches(
      /^[A-ZА-ЯЁ][A-ZА-ЯЁ]+\s[A-ZА-ЯЁ]+$/i,
      "Введите имя и фамилию через пробел"
    )
    .required("Обязательное поле"),

  phone: Yup.string()
    .matches(
      /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/,
      "Введите номер в формате +7 (999) 999-99-99"
    )
    .required("Обязательное поле"),

  city: Yup.string()
    .matches(/^[A-Za-zА-Яа-яЁё\s\-]+$/, "Город не должен содержать цифры")
    .required("Обязательное поле"),

  postalCode: Yup.string()
    .matches(/^\d{6}$/, "Почтовый индекс должен содержать 6 цифр")
    .required("Обязательное поле"),

  street: Yup.string()
    .matches(/^[A-Za-zА-Яа-яЁё\s\.\-]+$/, "Улица не должна содержать цифры")
    .required("Обязательное поле"),

  house: Yup.string()
    .matches(/^\d+$/, "Дом должен содержать число")
    .required("Обязательное поле"),

  apartment: Yup.string()
    .matches(/^\d*$/, "Квартира должна содержать число")
    .nullable(),

  isDefault: Yup.boolean(),
});

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, "");
  let result = "+7";

  if (digits.length > 1) result += ` (${digits.slice(1, 4)}`;
  if (digits.length >= 4) result += `) ${digits.slice(4, 7)}`;
  if (digits.length >= 7) result += `-${digits.slice(7, 9)}`;
  if (digits.length >= 9) result += `-${digits.slice(9, 11)}`;

  return result.slice(0, 18);
};

const CreateAddress = ({ show, onHide, editingAddress }) => {
  const { address } = useContext(Context);

  const formik = useFormik({
    initialValues: {
      country: "",
      fullName: "",
      phone: "",
      city: "",
      postalCode: "",
      street: "",
      house: "",
      apartment: "",
      isDefault: false,
    },
    validationSchema: addressSchema,
    onSubmit: async (values) => {
      if (editingAddress) {
        await address.editAddress(editingAddress.id, values);
      } else {
        await address.addAddress(values);
      }
      onHide();
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (editingAddress) {
      formik.setValues({
        country: editingAddress.country || "",
        fullName: editingAddress.fullName || "",
        phone: editingAddress.phone || "",
        city: editingAddress.city || "",
        postalCode: editingAddress.postalCode || "",
        street: editingAddress.street || "",
        house: editingAddress.house || "",
        apartment: editingAddress.apartment || "",
        isDefault: editingAddress.isDefault || false,
      });
    }
  }, [editingAddress]);

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    formik.setFieldValue("phone", formatted);
  };

  return (
    <Modal data-bs-theme="dark" show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>
          {editingAddress ? "Редактировать адрес" : "Новый адрес"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white">
        <Form onSubmit={formik.handleSubmit}>
          {[
            {
              name: "country",
              label: "Страна",
              placeholder: "Например, Россия",
            },
            {
              name: "fullName",
              label: "ФИО получателя",
              placeholder: "Иванов Иван",
            },
            {
              name: "phone",
              label: "Телефон",
              placeholder: "+7 (999) 999-99-99",
              onChange: handlePhoneChange,
            },
            { name: "city", label: "Город", placeholder: "Москва" },
            {
              name: "postalCode",
              label: "Почтовый индекс",
              placeholder: "101000",
            },
            { name: "street", label: "Улица", placeholder: "ул. Пушкина" },
            { name: "house", label: "Дом", placeholder: "д. 1" },
          ].map(({ name, label, placeholder, onChange }) => (
            <Form.Group className="mb-2" key={name}>
              <Form.Label>{label} <span style={{color: "red"}}>*</span></Form.Label>
              <Form.Control
                name={name}
                placeholder={placeholder}
                value={formik.values[name]}
                onChange={onChange || formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched[name] && !!formik.errors[name]}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors[name]}
              </Form.Control.Feedback>
            </Form.Group>
          ))}

          <Form.Group className="mb-2">
            <Form.Label>Квартира</Form.Label>
            <Form.Control
              name="apartment"
              placeholder="кв. 10"
              value={formik.values.apartment}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.apartment && !!formik.errors.apartment}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.apartment}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2 form-check form-switch">
            <Form.Check
              type="checkbox"
              label="Сделать по умолчанию"
              name="isDefault"
              checked={formik.values.isDefault}
              onChange={formik.handleChange}
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
