import { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { createDevice, fetchBrands, fetchTypes } from "../../http/deviceApi";
import { observer } from "mobx-react-lite";
import { useFormik } from "formik";
import * as Yup from "yup";

const CreateDevice = observer(({ show, onHide }) => {
  const { device } = useContext(Context);
  const [info, setInfo] = useState([]);

  useEffect(() => {
    fetchTypes().then((data) => device.setTypes(data));
    fetchBrands().then((data) => device.setBrands(data));
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      file: null,
      typeId: "",
      brandId: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(2, "Слишком короткое название")
        .required("Обязательное поле"),
      price: Yup.number()
        .typeError("Введите число")
        .positive("Цена должна быть положительной")
        .required("Обязательное поле"),
      file: Yup.mixed()
        .required("Изображение обязательно")
        .test("fileType", "Только изображения (jpeg/png/webp)", (value) =>
          value
            ? ["image/jpeg", "image/png", "image/webp"].includes(value.type)
            : false
        ),
      typeId: Yup.string().required("Выберите тип"),
      brandId: Yup.string().required("Выберите бренд"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price.toString());
      formData.append("img", values.file);
      formData.append("typeId", values.typeId);
      formData.append("brandId", values.brandId);
      formData.append("info", JSON.stringify(info));

      await createDevice(formData);
      resetForm();
      setInfo([]);
      onHide();
    },
  });

  const addInfo = () => {
    setInfo([...info, { title: "", description: "", number: Date.now() }]);
  };

  const removeInfo = (number) => {
    setInfo(info.filter((i) => i.number !== number));
  };

  const changeInfo = (key, value, number) => {
    setInfo(
      info.map((i) => (i.number === number ? { ...i, [key]: value } : i))
    );
  };

  return (
    <Modal
      className="text-white"
      data-bs-theme="dark"
      show={show}
      onHide={onHide}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Добавить устройство</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit} className="d-flex flex-column">
          <Form.Select
            className="mt-3"
            name="typeId"
            value={formik.values.typeId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.typeId && !!formik.errors.typeId}
          >
            <option value="">Выберите тип</option>
            {device.types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {formik.errors.typeId}
          </Form.Control.Feedback>

          <Form.Select
            className="mt-3"
            name="brandId"
            value={formik.values.brandId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.brandId && !!formik.errors.brandId}
          >
            <option value="">Выберите бренд</option>
            {device.brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {formik.errors.brandId}
          </Form.Control.Feedback>

          <Form.Control
            className="mt-3"
            name="name"
            placeholder="Введите название устройства"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.name && !!formik.errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.name}
          </Form.Control.Feedback>

          <Form.Control
            className="mt-3"
            name="price"
            placeholder="Введите стоимость устройства"
            type="number"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.price && !!formik.errors.price}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.price}
          </Form.Control.Feedback>

          <Form.Control
            className="mt-3"
            type="file"
            onChange={(e) =>
              formik.setFieldValue("file", e.currentTarget.files[0])
            }
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.file && !!formik.errors.file}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.file}
          </Form.Control.Feedback>

          <Button className="mt-3" variant="outline-light" onClick={addInfo}>
            Добавить новое свойство
          </Button>

          {info.map((i) => (
            <Row key={i.number} className="mt-2">
              <Col md={4}>
                <Form.Control
                  placeholder="Введите название"
                  value={i.title}
                  onChange={(e) =>
                    changeInfo("title", e.target.value, i.number)
                  }
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  placeholder="Введите описание"
                  value={i.description}
                  onChange={(e) =>
                    changeInfo("description", e.target.value, i.number)
                  }
                />
              </Col>
              <Col md={4}>
                <Button
                  variant="outline-danger"
                  onClick={() => removeInfo(i.number)}
                >
                  Удалить
                </Button>
              </Col>
            </Row>
          ))}
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
});

export default CreateDevice;
