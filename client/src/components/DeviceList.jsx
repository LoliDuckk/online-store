import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../main";
import { Row, Col } from "react-bootstrap";
import DeviceItem from "./DeviceItem";

const DeviceList = observer(() => {
  const { device } = useContext(Context);
  return (
    <Row className="g-3">
      {device.devices.map((device) => (
        <Col key={device.id} xs={12} sm={6} md={4} lg={3}>
          <DeviceItem device={device} />
        </Col>
      ))}
    </Row>
  );
});

export default DeviceList;
