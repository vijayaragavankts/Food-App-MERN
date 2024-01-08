const express = require("express");
const router = express.Router();

const Customer = require("../models/customerSchema");
const Item = require("../models/itemSchema");
const Restaurant = require("../models/restaurantSchema");
const Order = require("../models/orderSchema");

router.post("/", async (req, res) => {
  try {
    const { customer, restaurant, itemId, price, quantity } = req.body;
    const order = await new Order({
      restaurant: restaurant,
      customer: customer,
      item: itemId,
      price: price,
      quantity: quantity,
    });
    await order.save();
    res.status(201).json({ message: "Order created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Item Id
    const order = await Order.findOne({
      item: id,
    });
    const data = await Order.findByIdAndDelete(order._id);
    if (data) {
      res.status(201).json({ message: "Order deleted successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/customer/:id", async (req, res) => {
  try {
    const { id } = req.params; // customer Id
    const data = await Order.find({ customer: id });
    if (data) {
      res
        .status(201)
        .json({
          message: "Getting Order Data from DB is Successful",
          success: true,
          data: data,
        });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
