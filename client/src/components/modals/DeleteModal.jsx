import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  fetchCategories,
  deleteCategory,
  fetchTypes,
  deleteType,
  fetchBrands,
  deleteBrand,
  fetchDevices,
  deleteDevice,
} from "../../http/deviceApi";

const entityMap = {
  category: {
    label: "Категория",
    fetch: fetchCategories,
    delete: deleteCategory,
  },
  type: {
    label: "Тип",
    fetch: fetchTypes,
    delete: deleteType,
  },
  brand: {
    label: "Бренд",
    fetch: fetchBrands,
    delete: deleteBrand,
  },
  device: {
    label: "Устройство",
    fetch: () => fetchDevices(null, null, 1, 100),
    delete: deleteDevice,
  },
};

export default function DeleteEntityModal({ show, onHide }) {
  const [entityType, setEntityType] = useState("");
  const [entities, setEntities] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (show && entityType) {
      entityMap[entityType].fetch().then((data) => {
        setEntities(data.rows || data);
        setSelectedId(null);
      });
    }
  }, [entityType, show]);

  const handleDelete = async () => {
    if (!entityType || !selectedId) return;
    if (
      window.confirm(
        `Вы уверены, что хотите удалить ${entityMap[
          entityType
        ].label.toLowerCase()}?`
      )
    ) {
      await entityMap[entityType].delete(selectedId);
      const updated = await entityMap[entityType].fetch();
      setEntities(updated.rows || updated);
      setSelectedId(null);
    }
  };

  const entityOptions = Object.entries(entityMap).map(([key, val]) => (
    <option key={key} value={key}>
      {val.label}
    </option>
  ));

  return (
    <Modal data-bs-theme="dark" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "white" }}>Удаление сущности</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: "white" }}>
            Выберите тип сущности
          </Form.Label>
          <Form.Select
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
          >
            <option value="">-- Не выбрано --</option>
            {entityOptions}
          </Form.Select>
        </Form.Group>

        {entityType && (
          <Form.Group>
            <Form.Label style={{ color: "white" }}>
              Выберите {entityMap[entityType].label.toLowerCase()}
            </Form.Label>
            <Form.Select
              value={selectedId || ""}
              onChange={(e) => setSelectedId(Number(e.target.value))}
            >
              <option disabled value="">
                -- Не выбрано --
              </option>
              {entities.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name || e.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Отмена
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={!entityType || !selectedId}
        >
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
