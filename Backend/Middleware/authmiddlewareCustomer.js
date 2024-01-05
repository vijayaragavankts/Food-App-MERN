const jwt = require("jsonwebtoken");
const Customer = require("../models/customerSchema");
const protectCustomer = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "vijay");
      req.user = await Customer.findById(decoded.id);
      next();
    } catch (err) {
      throw new Error("Not Authorized ");
    }
  }
  if (!token) {
    res.redirect("/customer");
    throw new Error("No token");
  }
};

module.exports = protectCustomer;
