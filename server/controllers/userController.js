const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Basket, Order } = require("../models/models");
const { Sequelize } = require("../db");

const generateJwt = (id, login, email, role) => {
  return jwt.sign({ id, login, email, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async registration(req, res, next) {
    const { login, email, password, role } = req.body;

    if (!login || !email || !password) {
      return next(ApiError.badRequest("Некорректный email или пароль"));
    }

    const [candidateEmail, candidateLogin] = await Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { login } }),
    ]);
    if (candidateLogin) {
      return next(
        ApiError.badRequest("Пользователь с таким логином уже существует")
      );
    }
    if (candidateEmail) {
      return next(
        ApiError.badRequest("Пользователь с таким email уже существует")
      );
    }

    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      login,
      email,
      password: hashPassword,
      role,
    });
    const basket = await Basket.create({ userId: user.id });
    const token = generateJwt(user.id, user.login, user.email, user.role);
    return res.json({ token });
  }

  async login(req, res, next) {
    const { login, password } = req.body;

    const user = await User.findOne({ where: { login } });
    if (!user) {
      return next(ApiError.badRequest("Пользователь не найден"));
    }

    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.badRequest("Указан неверный пароль"));
    }

    const token = generateJwt(user.id, user.login, user.email, user.role);
    return res.json({ token });
  }

  async getAllUsersWithStats(req, res) {
    try {
      const users = await User.findAll({
        attributes: [
          "id",
          "login",
          "email",
          "createdAt",
          [Sequelize.fn("COUNT", Sequelize.col("orders.id")), "orderCount"],
          [Sequelize.fn("SUM", Sequelize.col("orders.total")), "totalSpent"],
        ],
        include: [
          {
            model: Order,
            attributes: [],
          },
        ],
        group: ["user.id"],
        raw: true,
      });

      return res.json(users);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Ошибка при получении пользователей" });
    }
  }

  async check(req, res, next) {
    const token = generateJwt(
      req.user.id,
      req.user.login,
      req.user.email,
      req.user.role
    );
    return res.json({ token });
  }
}

module.exports = new UserController();
