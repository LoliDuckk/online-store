import { Carousel, Col, Container, Image, Row } from "react-bootstrap";
import test from "../assets/1320by500.jpg";
import img1 from "../assets/bg.png";
import { useNavigate } from "react-router-dom";
import { SHOP_ROUTE } from "../utils/consts";
import { useEffect, useState } from "react";
import { fetchDevices } from "../http/deviceApi";
import DeviceItem from "../components/DeviceItem";

export default function HomePage() {
  const navigate = useNavigate();
  const slides = [img1, img1, test];
  const [popularDevices, setPopularDevices] = useState([]);

  useEffect(() => {
    fetchDevices(null, null, 1, 100).then((data) => {
      const sorted = data.rows.sort((a, b) => b.price - a.price).slice(0, 4);
      setPopularDevices(sorted);
    });
  }, []);

  return (
    <Container className="mt-2" data-bs-theme="dark">
      <Carousel fade touch>
        {slides.map((img, index) => (
          <Carousel.Item
            key={index}
            as="button"
            style={{
              backgroundImage: `url(${img})`,
              border: "none",
              width: "100%",
              height: "500px",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
            }}
            onClick={() => navigate(SHOP_ROUTE)}
          />
        ))}
      </Carousel>

      <h2 className="text-white mt-4 mb-3">Популярные товары</h2>
      <Row className="mb-3 g-3">
        {popularDevices.map((device) => (
          <Col key={device.id} xs={12} sm={6} md={4} lg={3}>
            <DeviceItem device={device} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
