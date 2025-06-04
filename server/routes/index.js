const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const typeRouter = require("./typeRouter");
const brandRouter = require("./brandRouter");
const deviceRouter = require("./deviceRouter");
const basketRouter = require("./basketRouter");
const categoryRouter = require("./categoryRouter");
const orderRouter = require("./orderRouter");
const addressRouter = require("./addressRouter");

router.use("/user", userRouter);
router.use("/type", typeRouter);
router.use("/brand", brandRouter);
router.use("/device", deviceRouter);
router.use("/basket", basketRouter);
router.use("/category", categoryRouter);
router.use("/address", addressRouter);
router.use("/order", orderRouter);

module.exports = router;
