const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    requried: true,
  },
  cuisine_type: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
  },
});

restaurantSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const hashedpw = await bcrypt.hash(this.password, 10);
  this.password = hashedpw;
  next();
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
