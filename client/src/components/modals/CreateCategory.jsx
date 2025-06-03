// components/modals/CreateCategory.jsx
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { createCategory } from "../../http/deviceApi";
import { validateEmpty } from "../../utils/validate";

export default function CreateCategory({ show, onHide }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const addCategory = () => {
    const validation = validateEmpty(value);
    setError(validation);
    if (validation) return;

    createCategory({ name: value }).then(() => {
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
        <Modal.Title>Добавить категорию</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            placeholder="Введите название категории"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {error && <Form.Text className="text-danger">{error}</Form.Text>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="outline-success" onClick={addCategory}>
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
