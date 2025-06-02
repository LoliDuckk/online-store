import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { createType } from "../../http/deviceApi";
import { validateEmpty, validateFile } from "../../utils/validate";

const CreateType = ({ show, onHide }) => {
  const [value, setValue] = useState("");
  const [file, setFile] = useState(null);

  const [errors, setErrors] = useState({
    value: "",
    file: "",
  });

  const selectFile = (e) => {
    setFile(e.target.files[0]);
  };

  const addType = () => {
    const newErrors = {
      value: validateEmpty(value),
      file: validateFile(file),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) return;

    const formData = new FormData();
    formData.append("name", value);
    formData.append("img", file);
    createType(formData).then((data) => {
      setValue("");
      onHide();
    });
  };

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
        <Modal.Title id="contained-modal-title-vcenter">
          Добавить тип
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            placeholder={"Введите название типа"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {errors.value && (
            <Form.Text className="text-danger">{errors.value}</Form.Text>
          )}
          <Form.Control className="mt-3" type="file" onChange={selectFile} />
          {errors.file && (
            <Form.Text className="text-danger">{errors.file}</Form.Text>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="outline-success" onClick={addType}>
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateType;
