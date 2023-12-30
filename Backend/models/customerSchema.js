const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const customerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
});

customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const hashedpw = await bcrypt.hash(this.password, 10);
  console.log(hashedpw);
  this.password = hashedpw;
  next();
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
