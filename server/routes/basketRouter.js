const Router = require("express");
const router = new Router();
const basketController = require("../controllers/basketController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, basketController.addToBasket);
router.put("/", authMiddleware, basketController.updateQuantity);
router.get("/", authMiddleware, basketController.getBasket);
router.delete(
  "/:basketDeviceId",
  authMiddleware,
  basketController.removeFromBasket
);

module.exports = router;
