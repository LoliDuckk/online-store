import { Button, Form, Modal } from "react-bootstrap";
import { createCategory } from "../../http/deviceApi";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function CreateCategory({ show, onHide }) {
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
      await createCategory({ name: values.name });
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
        <Modal.Title>Добавить категорию</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              name="name"
              placeholder="Введите название категории"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.name && !!formik.errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
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
}
