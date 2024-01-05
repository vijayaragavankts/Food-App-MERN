const jwt = require("jsonwebtoken");
const generateToken = (id) => {
  return jwt.sign({ id }, "vijay", { expiresIn: "30d" });
};

module.exports = generateToken;
