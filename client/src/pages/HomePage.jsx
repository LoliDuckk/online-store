import { Carousel, Container, Image } from "react-bootstrap";
import test from "../assets/1320by500.jpg";
import { useNavigate } from "react-router-dom";
import { SHOP_ROUTE } from "../utils/consts";

export default function HomePage() {
  const navigate = useNavigate();
  const slides = [test, test, test];

  return (
    <Container className="mt-2">
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
    </Container>
  );
}
