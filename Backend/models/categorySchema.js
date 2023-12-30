const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  category_name: {
    type: String,
    lowercase: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
