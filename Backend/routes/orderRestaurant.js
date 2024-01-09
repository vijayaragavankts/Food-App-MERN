const express = require("express");
const router = express.Router();

const Customer = require("../models/customerSchema");
const Item = require("../models/itemSchema");
const Restaurant = require("../models/restaurantSchema");
const Order = require("../models/orderSchema");
const Deliver = require("../models/deliverSchema");

router.post("/", async (req, res) => {
  try {
    const { restaurant, customer, items, total, quantity } = req.body;

    if (!restaurant || !customer || !items || !total || !quantity) {
      return res
        .status(400)
        .json({ message: "Bad Request: Missing required fields." });
    }

    const newDeliver = await new Deliver({
      customer: customer,
      restaurant: restaurant,
      item: items,
      total: total,
      quantity: quantity,
    });
    await newDeliver.save();
    if (newDeliver) {
      return res.status(201).json({
        message: "Successfully done payment",
        success: true,
        data: newDeliver,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(201).json({
      message: "Error occured in payment",
      data: err.message,
      success: false,
    });
  }
});

module.exports = router;
