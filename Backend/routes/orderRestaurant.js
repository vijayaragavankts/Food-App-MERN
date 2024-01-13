const express = require("express");
const router = express.Router();

const Customer = require("../models/customerSchema");
const Item = require("../models/itemSchema");
const Restaurant = require("../models/restaurantSchema");
const Order = require("../models/orderSchema");
const Deliver = require("../models/deliverSchema");

const protectRestaurant = require("../Middleware/authmiddlewareRestaurant"); // middleware for protecting restaurant pages
const protectCustomer = require("../Middleware/authmiddlewareCustomer"); // middleware for protecting customer pages

// Create a delivery order
router.post("/", protectCustomer, async (req, res) => {
  try {
    console.log(req.body);
    const { restaurant, customer, items, total, quantity } = req.body;

    if (!restaurant || !customer || !items || !total || !quantity) {
      return res
        .status(400)
        .json({ error: "Bad Request: Missing required fields." });
    }

    const newDeliver = await new Deliver({
      customer: customer,
      restaurant: restaurant,
      item: items,
      total: total,
      quantity: quantity,
    });

    await newDeliver.save();

    return res.status(201).json({
      message:
        "Successfully completed the payment and created a delivery order.",
      success: true,
      data: newDeliver,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error occurred in payment or order creation.",
      data: err.message,
      success: false,
    });
  }
});

// Retrieve delivery orders for a restaurant
router.get("/:id", protectRestaurant, async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Deliver.find({ restaurant: id })
      .populate("customer")
      .populate("item");

    if (orders.length > 0) {
      return res.status(200).json({
        message:
          "Successfully fetched data of all orders related to this restaurant.",
        success: true,
        data: orders,
      });
    } else {
      return res.status(404).json({
        message: "No data found for orders related to this restaurant.",
        success: false,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error occurred in retrieving order data.",
      data: err.message,
      success: false,
    });
  }
});

// delete delivery if the restaurant enters deliver button

router.delete("/:id", protectRestaurant, async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Deliver.findByIdAndDelete(id);
    if (data) {
      console.log("deleted order");
      return res.status(200).json({
        message: "Successfully deleted order data.",
        success: true,
        data: data,
      });
    } else {
      return res.status(404).json({
        message: "No data to delete with this id.",
        success: false,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error occurred in deleting orders",
      data: err.message,
      success: false,
    });
  }
});

module.exports = router;
