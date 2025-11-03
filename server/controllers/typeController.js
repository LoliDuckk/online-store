const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { Type, Category } = require("../models/models");
const ApiError = require("../error/ApiError");

class TypeController {
  async create(req, res) {
    try {
      let { name, categoryId } = req.body;
      const { img } = req.files;

      if (!categoryId) {
        return res.status(400).json({ message: "Категория обязательна" });
      }

      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));
      const type = await Type.create({ name, img: fileName, categoryId });
      return res.json(type);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка при создании типа" });
    }
  }

  async getAll(req, res) {
    const types = await Type.findAll();
    return res.json(types);
  }

  async getGrouped(req, res) {
    const categories = await Category.findAll({
      include: [{ model: Type }],
      order: [["id", "ASC"]],
    });

    res.json(categories);
  }

  async delete(req, res) {
    const { id } = req.params;
    const type = await Type.findByPk(id);
    console.log(type);
    const filePath = path.resolve(__dirname, "..", "static", type.img);
    console.log(filePath);
    fs.unlinkSync(filePath);

    await Type.destroy({ where: { id } });
    return res.json({ message: "Тип удален" });
  }
}

module.exports = new TypeController();
