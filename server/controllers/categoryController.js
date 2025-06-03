const { Category } = require("../models/models");

class CategoryController {
  async getAll(req, res) {
    const categories = await Category.findAll();
    return res.json(categories);
  }

  async create(req, res) {
    const { name } = req.body;
    const category = await Category.create({ name });
    return res.json(category);
  }

  async delete(req, res) {
    const { id } = req.params;
    await Category.destroy({ where: { id } });
    return res.json({ message: "Категория удалена" });
  }
}

module.exports = new CategoryController();
