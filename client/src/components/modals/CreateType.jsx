import { useEffect, useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { createType, fetchCategories } from "../../http/deviceApi";
import { Context } from "../../main";
import { useFormik } from "formik";
import * as Yup from "yup";

const CreateType = ({ show, onHide }) => {
  const { device } = useContext(Context);

  useEffect(() => {
    fetchCategories().then((data) => device.setCategories(data));
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      file: null,
      categoryId: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(2, "Слишком короткое название")
        .required("Обязательное поле"),
      file: Yup.mixed()
        .required("Изображение обязательно")
        .test("fileType", "Только изображения (jpeg/png/webp)", (value) => {
          return (
            value &&
            ["image/jpeg", "image/png", "image/webp"].includes(value.type)
          );
        }),
      categoryId: Yup.string().required("Выберите категорию"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("img", values.file);
      formData.append("categoryId", values.categoryId);

      await createType(formData);
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
        <Modal.Title>Добавить тип</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Control
            name="name"
            placeholder="Введите название типа"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.name && !!formik.errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.name}
          </Form.Control.Feedback>

          <Form.Select
            className="mt-3"
            name="categoryId"
            value={formik.values.categoryId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.categoryId && !!formik.errors.categoryId}
          >
            <option value="">Выберите категорию</option>
            {device.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {formik.errors.categoryId}
          </Form.Control.Feedback>

          <Form.Control
            className="mt-3"
            type="file"
            name="file"
            onChange={(e) =>
              formik.setFieldValue("file", e.currentTarget.files[0])
            }
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.file && !!formik.errors.file}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.file}
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

export default CreateType;
