const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurantSchema");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.send("You are in Restaurant login/signup page"); // for demo
});

router.post("/register", async (req, res) => {
  try {
    // console.log("Register here");
    const { name, email, password, location, cuisine_type, rating } = req.body;
    if (!name || !password || !email || !location || !cuisine_type) {
      return res.status(500).json({
        success: false,
        message: "Enter all the required fields for registering a restaurant",
      });
    }
    const restaurant = await new Restaurant(req.body);
    await restaurant.save();
    req.session.restaurant_id = restaurant._id;

    return res.status(200).json({
      message: "Registration successful for a restaurant",
      name: restaurant.name,
      email: restaurant.email,
      password: restaurant.password,
      location: restaurant.location,
      cuisine_type: restaurant.cuisine_type,
      rating: restaurant.rating,
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
    const { name, password } = req.body;
    const restaurant = await Restaurant.findOne({ name: name });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restuarant with the entered username not present in db",
      });
    }
    const result = await bcrypt.compare(password, restaurant.password);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Entered name or password is wrong",
      });
    }
    req.session.restaurant_id = restaurant._id;
    return res.status(200).json({
      success: true,
      message: "Successfully Logged in",
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
