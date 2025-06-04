const { Address } = require("../models/models");

class AddressController {
  async create(req, res) {
    try {
      const userId = req.user.id;
      const {
        country,
        fullName,
        phone,
        city,
        postalCode,
        street,
        house,
        apartment,
      } = req.body;

      if (req.body.isDefault) {
        await Address.update(
          { isDefault: false },
          { where: { userId, isDefault: true } }
        );
      }

      const address = await Address.create({
        userId,
        country,
        fullName,
        phone,
        city,
        postalCode,
        street,
        house,
        apartment,
        isDefault: req.body.isDefault || false,
      });
      return res.json(address);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Ошибка при создании адреса" });
    }
  }

  async getAll(req, res) {
    try {
      const userId = req.user.id;
      const addresses = await Address.findAll({
        where: { userId },
        order: [
          ["isDefault", "DESC"],
          ["id", "ASC"],
        ],
      });
      return res.json(addresses);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Ошибка при получении адресов" });
    }
  }

  async update(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const {
        country,
        fullName,
        phone,
        city,
        postalCode,
        street,
        house,
        apartment,
        isDefault,
      } = req.body;

      const existing = await Address.findOne({ where: { id, userId } });
      if (!existing)
        return res.status(404).json({ message: "Адрес не найден" });

      if (isDefault) {
        await Address.update(
          { isDefault: false },
          { where: { userId, isDefault: true } }
        );
      }

      await existing.update({
        country,
        fullName,
        phone,
        city,
        postalCode,
        street,
        house,
        apartment,
        isDefault: isDefault || false,
      });

      return res.json(existing);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Ошибка при обновлении адреса" });
    }
  }

  async delete(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const existing = await Address.findOne({ where: { id, userId } });
      if (!existing)
        return res.status(404).json({ message: "Адрес не найден" });

      await Address.destroy({ where: { id } });
      return res.json({ message: "Адрес удалён" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Ошибка при удалении адреса" });
    }
  }
}

module.exports = new AddressController();
