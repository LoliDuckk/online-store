const jwt = require("jsonwebtoken");

module.exports = function (role) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      return next();
    }
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Пользователь не авторизован" });
      }
      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Пользователь не авторизован" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decoded.role !== role) {
        return res.status(403).json("Нет прав доступа");
      }
      req.user = decoded;
      next();
    } catch (e) {
      res.status(401).json({ message: "Пользователь не авторизован" });
    }
  };
};
