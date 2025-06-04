const {
  Basket,
  BasketDevice,
  Device,
  Order,
  OrderDevice,
  Address,
} = require("../models/models");

class OrderController {
  async create(req, res) {
    try {
      const userId = req.user.id;
      const { addressId, deliveryMethod, paymentMethod } = req.body;

      const basket = await Basket.findOne({
        where: { userId },
        include: {
          model: BasketDevice,
          include: [Device],
        },
      });
      if (!basket || !basket.basket_devices.length) {
        return res.status(400).json({ message: "Корзина пуста" });
      }

      const address = await Address.findOne({
        where: { id: addressId, userId },
      });
      if (!address) {
        return res.status(400).json({ message: "Неверный адрес доставки" });
      }

      const items = basket.basket_devices;
      const subtotal = items.reduce(
        (sum, item) => sum + item.quantity * item.device.price,
        0
      );

      let shippingCost = 0;
      let deliveryEstimate = null;

      if (deliveryMethod === "courier") {
        shippingCost = 500;
        deliveryEstimate = "1–2 рабочих дня";
      } else if (deliveryMethod === "pickup") {
        shippingCost = 0;
        deliveryEstimate = "Забрать можно сегодня";
      } else if (deliveryMethod === "express") {
        shippingCost = 1500;
        deliveryEstimate = "На следующий день";
      }
      const total = subtotal + shippingCost;

      const order = await Order.create({
        userId,
        total,
        address: JSON.stringify({
          country: address.country,
          fullName: address.fullName,
          phone: address.phone,
          city: address.city,
          postalCode: address.postalCode,
          street: address.street,
          house: address.house,
          apartment: address.apartment,
        }),
        deliveryMethod,
        paymentMethod,
        shippingCost,
        deliveryEstimate,
        status: "PENDING",
      });

      const orderDevices = await Promise.all(
        items.map((item) =>
          OrderDevice.create({
            orderId: order.id,
            deviceId: item.device.id,
            quantity: item.quantity,
            price: item.device.price,
          })
        )
      );

      await BasketDevice.destroy({ where: { basketId: basket.id } });

      return res.json({
        order,
        orderDevices,
        subtotal,
        shippingCost,
        total,
        deliveryEstimate,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Ошибка при создании заказа" });
    }
  }

  async getAll(req, res) {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderDevice,
          as: "order_devices",
          include: [Device],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json(orders);
  }
}

module.exports = new OrderController();
