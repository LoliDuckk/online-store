const Router = require("express");
const router = new Router();
const addressController = require("../controllers/AddressController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, addressController.create);
router.get("/", authMiddleware, addressController.getAll);
router.put("/:id", authMiddleware, addressController.update);
router.delete("/:id", authMiddleware, addressController.delete);

module.exports = router;
