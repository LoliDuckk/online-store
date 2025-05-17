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
import bigStar from "../assets/bigStar.png";
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
    <Container className="mt-3">
      <Row>
        <Col md={4}>
          <Image
            width={300}
            height={300}
            src={import.meta.env.VITE_API_URL + device.img}
          />
        </Col>
        <Col md={4}>
          <div className="d-flex flex-column align-items-center">
            <h2>{device.name}</h2>
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                background: `url(${bigStar}) no-repeat center center`,
                width: 100,
                height: 100,
                backgroundSize: "cover",
                fontSize: 32,
              }}
            >
              {device.rating}
            </div>
          </div>
        </Col>
        <Col md={4}>
          <Card
            className="d-flex flex-column align-items-center justify-content-around"
            style={{
              width: 300,
              height: 300,
              fontSize: 32,
              border: "5px solid lightgray",
            }}
          >
            <h3>{device.price} &#8381;</h3>
            <Button variant={"outline-dark"} onClick={handleAddToBasket}>
              В корзину
            </Button>
          </Card>
        </Col>
      </Row>
      <h3>Характеристики</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Название</th>
            <th>Описание</th>
          </tr>
        </thead>
        <tbody>
          {device.info.map((info) => (
            <tr key={info.id}>
              <td>{info.title}</td>
              <td>{info.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
