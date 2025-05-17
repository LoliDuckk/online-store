const { BasketDevice, Basket, Device } = require("../models/models");

class BasketController {
  async addToBasket(req, res) {
    const { deviceId, quantity = 1 } = req.body;
    const userId = req.user.id;
    const basket = await Basket.findOne({ where: { userId } });

    let basketDevice = await BasketDevice.findOne({
      where: { basketId: basket.id, deviceId },
    });

    if (basketDevice) {
      basketDevice.quantity += quantity;
      await basketDevice.save();
    } else {
      basketDevice = await BasketDevice.create({
        basketId: basket.id,
        deviceId,
        quantity,
      });
    }

    return res.json(basketDevice);
  }

  async updateQuantity(req, res) {
    const { basketDeviceId, quantity } = req.body;
    const basketDevice = await BasketDevice.findByPk(basketDeviceId);
    if (!basketDevice) return res.status(404).json({ message: "Not found" });

    basketDevice.quantity = quantity;
    await basketDevice.save();
    return res.json(basketDevice);
  }

  async getBasket(req, res) {
    const userId = req.user.id;
    const basket = await Basket.findOne({
      where: { userId },
      include: [{ model: BasketDevice, include: [Device] }],
    });
    return res.json(basket);
  }

  async removeFromBasket(req, res) {
    const { basketDeviceId } = req.params;
    await BasketDevice.destroy({ where: { id: basketDeviceId } });
    return res.json({ message: "Удалено из корзины" });
  }
}

module.exports = new BasketController();
