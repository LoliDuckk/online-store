import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Container,
  Image,
  Row,
  Table,
} from "react-bootstrap";
import { fetchOneDevice } from "../http/deviceApi";
import { addToBasket } from "../http/basketApi";
import { Context } from "../main";

export default function DevicePage() {
  const [device, setDevice] = useState({ info: [] });
  const { id } = useParams();
  const { basket } = useContext(Context);

  useEffect(() => {
    fetchOneDevice(id).then((data) => setDevice(data));
  }, [id]);

  const handleAddToBasket = async () => {
    const item = await addToBasket(device.id);
    basket.addItem(item);
  };

  return (
    <Container className="mt-4 text-light">
      <Row className="mb-4">
        <Col md={4} className="text-center">
          <Image
            width={300}
            height={300}
            src={import.meta.env.VITE_API_URL + device.img}
            rounded
            style={{ objectFit: "cover" }}
          />
        </Col>

        <Col
          md={4}
          className="d-flex flex-column align-items-center justify-content-center"
        >
          <h2 className="text-center">{device.name}</h2>
        </Col>

        <Col
          md={4}
          className="d-flex align-items-center justify-content-center"
        >
          <Card
            data-bs-theme="dark"
            className="text-center p-4 shadow"
            style={{
              width: "100%",
              maxWidth: 320,
              borderRadius: 12,
              backgroundColor: "#1e1e1e",
              border: "1px solid #444",
              color: "white",
            }}
          >
            <h3 className="mb-4">{device.price} &#8381;</h3>
            <Button
              variant="warning"
              size="lg"
              onClick={handleAddToBasket}
              style={{
                fontWeight: "bold",
                padding: "10px 24px",
              }}
            >
              В корзину
            </Button>
          </Card>
        </Col>
      </Row>

      <h4 className="mb-3">Характеристики</h4>
      <Table bordered hover variant="dark" responsive>
        <tbody>
          {device.info.map((info, index) => (
            <tr
              key={info.id}
              style={{
                backgroundColor: index % 2 === 0 ? "#2a2a2a" : "#1f1f1f",
              }}
            >
              <td style={{ width: "30%", fontWeight: "500", color: "#f8f9fa" }}>
                {info.title}
              </td>
              <td style={{ color: "#e0e0e0" }}>{info.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
