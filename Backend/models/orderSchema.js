const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
  },
  quantity: {
    type: Number,
    default: 0,
    minimum: 0,
  },
  price: {
    type: Number,
    minimum: 0,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
