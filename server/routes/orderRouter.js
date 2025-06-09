const Router = require("express");
const router = new Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", authMiddleware, orderController.create);
router.get("/", authMiddleware, orderController.getAll);
router.get("/admin", checkRole("ADMIN"), orderController.getAllAdmin);
router.put(
  "/:orderId/status",
  checkRole("ADMIN"),
  orderController.updateStatus
);

module.exports = router;
