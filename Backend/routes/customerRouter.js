const express = require("express");
const router = express.Router();
const Customer = require("../models/customerSchema");
const bcrypt = require("bcrypt");
const generateToken = require("../config/generateToken");

router.get("/", (req, res) => {
  res.send("You are in customer login/register page");
});

router.post("/register", async (req, res) => {
  try {
    // console.log("Register here");
    const { username, email, password, address } = req.body;
    if (!username || !password || !email) {
      return res.status(500).json({
        success: false,
        message: "Enter all the required fields for register",
      });
    }
    const customer = await new Customer(req.body);
    await customer.save();

    return res.status(200).json({
      message: "Registration successful",
      name: customer.username,
      email: customer.email,
      password: customer.password,
      address: customer.address,
      token: generateToken(customer._id),
      id: customer._id,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      success: false,
      message: "There is some issues in registering",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const customer = await Customer.findOne({ username: username });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "User with the entered username not present in db",
      });
    }
    const result = await bcrypt.compare(password, customer.password);
    if (!result) {
      return res.status(500).json({
        success: false,
        message: "Entered username or password is wrong",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully Logged in",
      name: customer.name,
      id: customer._id,
      token: generateToken(customer._id),
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Error Occured while Login",
    });
  }
});

module.exports = router;
