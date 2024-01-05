const jwt = require("jsonwebtoken");
const Restaurant = require("../models/restaurantSchema");
const protectRestaurant = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (token === undefined) {
        return res.status(400).json({
          success: false,
          message: "No Token is available",
          data: "No token available",
        });
      }
      const decoded = jwt.verify(token, "vijay");
      if (!decoded) {
        return res.status(400).json({
          success: false,
          message: "No Token is available",
        });
      }
      const rest = await Restaurant.findById(decoded.id);
      if (rest) {
        next();
      } else {
        return res.status(400).json({
          success: false,
          message: "No Token is available",
        });
      }
    } catch (err) {
      throw new Error("Not Authorized ");
    }
  }
  if (token === undefined) {
    res.status(400).json({
      success: false,
      message: "No Token is available",
    });
    throw new Error("No token");
  }
};

module.exports = protectRestaurant;
