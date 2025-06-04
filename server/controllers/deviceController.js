const { Op } = require("sequelize");
const uuid = require("uuid");
const path = require("path");
const { Device, DeviceInfo } = require("../models/models");
const ApiError = require("../error/ApiError");

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));

      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
      });

      if (info) {
        info = JSON.parse(info);
        info.forEach((element) => {
          DeviceInfo.create({
            title: element.title,
            description: element.description,
            deviceId: device.id,
          });
        });
      }

      return res.json(device);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    let { brandId, typeId, limit, page, priceFrom, priceTo, sort, query } =
      req.query;

    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;

    const where = {};
    if (brandId) where.brandId = brandId;
    if (typeId) where.typeId = typeId;
    if (priceFrom || priceTo) {
      where.price = {};
      if (priceFrom) where.price[Op.gte] = Number(priceFrom);
      if (priceTo) where.price[Op.lte] = Number(priceTo);
    }
    if (query) {
      where.name = { [Op.iLike]: `%${query}%` };
    }

    const order = [];
    if (sort === "price_asc") order.push(["price", "ASC"]);
    else if (sort === "price_desc") order.push(["price", "DESC"]);
    else if (sort === "name_asc") order.push(["name", "ASC"]);
    else if (sort === "name_desc") order.push(["name", "DESC"]);

    const devices = await Device.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order,
    });

    return res.json(devices);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: "info" }],
    });
    return res.json(device);
  }

  async delete(req, res) {
    const { id } = req.params;
    await Device.destroy({ where: { id } });
    return res.json({ message: "Устройство удалено" });
  }
}

module.exports = new DeviceController();
