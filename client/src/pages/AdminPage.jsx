import { Button, Container } from "react-bootstrap";
import CreateType from "../components/modals/CreateType";
import CreateCategory from "../components/modals/CreateCategory";
import CreateBrand from "../components/modals/CreateBrand";
import CreateDevice from "../components/modals/CreateDevice";
import DeleteModal from "../components/modals/DeleteModal";
import ManageOrders from "../components/modals/ManageOrders";
import UserStatsModal from "../components/modals/UserStatsModal";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../main";
import {
  fetchCategories,
  fetchTypes,
  fetchBrands,
  fetchDevices,
} from "../http/deviceApi";

export default function AdminPage() {
  const { user, device } = useContext(Context);
  const navigate = useNavigate();
  const [typeVisible, setTypeVisible] = useState(false);
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [brandVisible, setBrandVisible] = useState(false);
  const [deviceVisible, setDeviceVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [userStatsVisible, setUserStatsVisible] = useState(false);

  useEffect(() => {
    try {
      if (!user.isAdmin) navigate("/");
    } catch (error) {
      navigate("/");
    }
  }, []);

  const refreshData = async () => {
    try {
      const [categories, types, brands, devices] = await Promise.all([
        fetchCategories(),
        fetchTypes(),
        fetchBrands(),
        fetchDevices(null, null, 1, 100),
      ]);
      device.setCategories(categories);
      device.setTypes(types);
      device.setBrands(brands);
      device.setDevices(devices.rows || devices);
    } catch (e) {
      console.error("Ошибка при обновлении данных:", e);
    }
  };

  return (
    <Container className="d-flex flex-column">
      <h2 className="text-white mt-3">Управление товарами</h2>
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
      <h2 className="text-white mt-3">Управление пользователями и заказами</h2>
      <Button
        variant={"outline-light"}
        className={"mt-2"}
        onClick={() => setOrderModalVisible(true)}
      >
        Управление заказами
      </Button>
      <Button
        variant={"outline-light"}
        className={"mt-2"}
        onClick={() => setUserStatsVisible(true)}
      >
        Пользователи и статистика
      </Button>

      <CreateType
        show={typeVisible}
        onHide={() => setTypeVisible(false)}
        onUpdated={refreshData}
      />
      <CreateCategory
        show={categoryVisible}
        onHide={() => setCategoryVisible(false)}
        onUpdated={refreshData}
      />
      <CreateBrand
        show={brandVisible}
        onHide={() => setBrandVisible(false)}
        onUpdated={refreshData}
      />
      <CreateDevice
        show={deviceVisible}
        onHide={() => setDeviceVisible(false)}
        onUpdated={refreshData}
      />
      <DeleteModal
        show={deleteModalVisible}
        onHide={() => setDeleteModalVisible(false)}
        onUpdated={refreshData}
      />
      <ManageOrders
        show={orderModalVisible}
        onHide={() => setOrderModalVisible(false)}
      />
      <UserStatsModal
        show={userStatsVisible}
        onHide={() => setUserStatsVisible(false)}
      />
    </Container>
  );
}
