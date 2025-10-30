import { Button, Form, Modal } from "react-bootstrap";
import { createBrand } from "../../http/deviceApi";
import { useFormik } from "formik";
import * as Yup from "yup";

const CreateBrand = ({ show, onHide, onUpdated }) => {
  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(2, "Слишком короткое название")
        .max(30, "Слишком длинное название")
        .required("Обязательное поле"),
    }),
    onSubmit: async (values, { resetForm }) => {
      await createBrand({ name: values.name });
      await onUpdated?.();
      resetForm();
      onHide();
    },
  });

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
        <Modal.Title>Добавить бренд</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Control
            name="name"
            placeholder="Введите название бренда"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.name && !!formik.errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.name}
          </Form.Control.Feedback>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="outline-success" onClick={formik.handleSubmit}>
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateBrand;
