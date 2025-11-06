import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Toast, ToastContainer } from "react-bootstrap";
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

export default function DeleteEntityModal({ show, onHide, onUpdated }) {
  const [entityType, setEntityType] = useState("");
  const [entities, setEntities] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
    if (show && entityType) {
      entityMap[entityType]
        .fetch()
        .then((data) => {
          setEntities(data.rows || data);
          setSelectedId(null);
        })
        .catch(() => showToast("Ошибка при загрузке данных", "danger"));
    }
  }, [entityType, show]);

  const showToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ show: false, message: "", variant }), 5000);
  };

  const handleDelete = async () => {
    if (!entityType || !selectedId) return;

    if (
      window.confirm(
        `Вы уверены, что хотите удалить ${entityMap[
          entityType
        ].label.toLowerCase()}?`
      )
    ) {
      try {
        await entityMap[entityType].delete(selectedId);

        const updated = await entityMap[entityType].fetch();
        setEntities(updated.rows || updated);
        setSelectedId(null);

        const label = entityMap[entityType].label.toLowerCase();
        showToast(
          `${
            label.charAt(0).toUpperCase() + label.slice(1)
          } успешно удалён(а).`,
          "success"
        );

        await onUpdated?.();
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          "Ошибка при удалении. Возможно, у сущности есть связанные элементы.";
        showToast(message, "danger");
      }
    }
  };

  const handleClose = () => {
    setEntityType("");
    setSelectedId(null);
    setEntities([]);
    onHide();
  };

  const entityOptions = Object.entries(entityMap).map(([key, val]) => (
    <option key={key} value={key}>
      {val.label}
    </option>
  ));

  return (
    <>
      <Modal data-bs-theme="dark" show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "white" }}>
            Удаление сущности
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "white" }}>
              Выберите тип сущности
            </Form.Label>
            <Form.Select
              value={entityType}
              onChange={(e) => {
                setEntityType(e.target.value);
              }}
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
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={!entityType || !selectedId}
          >
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer
        className="p-3"
        position="top-end"
        style={{ zIndex: 9999, gap: "10px" }}
      >
        <Toast
          bg={toast.variant}
          show={toast.show}
          animation
          autohide
          delay={5000}
          data-bs-theme="dark"
          onClose={() => setToast({ show: false, message: "", variant: "" })}
        >
          <Toast.Header closeButton={true}>
            <strong className="me-auto">
              {toast.variant === "success" ? "Успешно" : "Ошибка"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
