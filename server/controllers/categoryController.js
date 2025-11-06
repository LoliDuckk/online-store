const { Category, Type } = require("../models/models");
const ApiError = require("../error/ApiError");

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

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);

      if (!category) {
        return next(ApiError.badRequest("Категория не найдена"));
      }

      const typeCount = await Type.count({ where: { categoryId: id } });
      if (typeCount > 0) {
        return next(
          ApiError.badRequest("Нельзя удалить категорию, у которой есть типы")
        );
      }

      await category.destroy();
      return res.json({ message: "Категория удалена" });
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new CategoryController();
