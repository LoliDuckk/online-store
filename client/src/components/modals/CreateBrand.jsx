import { Button, Form, Modal } from "react-bootstrap";
import { createBrand } from "../../http/deviceApi";
import { useState } from "react";
import { validateEmpty } from "../../utils/validate";

const CreateBrand = ({ show, onHide }) => {
  const [value, setValue] = useState("");

  const [errors, setErrors] = useState({
    value: "",
  });

  const addBrand = () => {
    const newErrors = {
      value: validateEmpty(value),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) return;

    createBrand({ name: value }).then((data) => {
      setValue("");
      onHide();
    });
  };
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Добавить бренд
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={addBrand}>
          <Form.Control
            placeholder={"Введите название бренда"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {errors.value && (
            <Form.Text className="text-danger">{errors.value}</Form.Text>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="outline-success" onClick={addBrand}>
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateBrand;
