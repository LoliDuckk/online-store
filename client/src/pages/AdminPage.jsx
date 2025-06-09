import { Button, Container } from "react-bootstrap";
import CreateType from "../components/modals/CreateType";
import CreateCategory from "../components/modals/CreateCategory";
import CreateBrand from "../components/modals/CreateBrand";
import CreateDevice from "../components/modals/CreateDevice";
import DeleteModal from "../components/modals/DeleteModal";
import ManageOrders from "../components/modals/ManageOrders";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../main";

export default function AdminPage() {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [typeVisible, setTypeVisible] = useState(false);
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [brandVisible, setBrandVisible] = useState(false);
  const [deviceVisible, setDeviceVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);

  useEffect(() => {
    try {
      if (!user.isAdmin) navigate("/");
    } catch (error) {
      navigate("/");
    }
  }, []);

  return (
    <Container className="d-flex flex-column">
      <Button
        variant={"outline-light"}
        className={"mt-2"}
        onClick={() => setCategoryVisible(true)}
      >
        Добавить категорию
      </Button>
      <Button
        variant={"outline-light"}
        className={"mt-2"}
        onClick={() => setTypeVisible(true)}
      >
        Добавить тип
      </Button>

      <Button
        variant={"outline-light"}
        className={"mt-2"}
        onClick={() => setBrandVisible(true)}
      >
        Добавить бренд
      </Button>
      <Button
        variant={"outline-light"}
        className={"mt-2"}
        onClick={() => setDeviceVisible(true)}
      >
        Добавить устройство
      </Button>
      <Button
        variant="danger"
        className="mt-2"
        onClick={() => setDeleteModalVisible(true)}
      >
        Удалить категорию / тип / бренд / устройство
      </Button>
      <Button
        variant={"outline-light"}
        className={"mt-2"}
        onClick={() => setOrderModalVisible(true)}
      >
        Управление заказами
      </Button>

      <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
      <CreateCategory
        show={categoryVisible}
        onHide={() => setCategoryVisible(false)}
      />
      <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
      <CreateDevice
        show={deviceVisible}
        onHide={() => setDeviceVisible(false)}
      />
      <DeleteModal
        show={deleteModalVisible}
        onHide={() => setDeleteModalVisible(false)}
      />
      <ManageOrders
        show={orderModalVisible}
        onHide={() => setOrderModalVisible(false)}
      />
    </Container>
  );
}
