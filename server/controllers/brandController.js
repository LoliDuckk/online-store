const { Brand, Device } = require("../models/models");
const ApiError = require("../error/ApiError");

class BrandController {
  async create(req, res) {
    const { name } = req.body;
    const brand = await Brand.create({ name });
    return res.json(brand);
  }

  async getAll(req, res) {
    const brands = await Brand.findAll();
    return res.json(brands);
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const brand = await Brand.findByPk(id);

      if (!brand) {
        return next(ApiError.badRequest("Бренд не найден"));
      }

      const deviceCount = await Device.count({ where: { brandId: id } });
      if (deviceCount > 0) {
        return next(
          ApiError.badRequest(
            "Нельзя удалить бренд, у которого есть устройства"
          )
        );
      }

      await brand.destroy();
      return res.json({ message: "Бренд удалён" });
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new BrandController();
