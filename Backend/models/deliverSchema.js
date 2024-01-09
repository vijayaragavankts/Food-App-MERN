const mongoose = require("mongoose");

const deliverSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  item: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Item",
  },
  quantity: {
    type: [Number],
  },
  total: {
    type: Number,
  },
});

const Deliver = mongoose.model("Deliver", deliverSchema);

module.exports = Deliver;
