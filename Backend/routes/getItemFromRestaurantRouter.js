const express = require("express");
const Item = require("../models/itemSchema");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const id = req.session.restaurant_id;
    const { category, name, price, description } = req.body;
    const restaurant = id;
    if (!name || !price) {
      res.status(500).json({
        success: false,
        message: "Enter all the fields",
      });
    }
    const item = await new Item({
      category: category,
      restaurant: restaurant,
      name: name,
      price: price,
      description: description,
    });
    await item.save();
    if (item) {
      res.status(200).json({
        status: "Success",
        message: "Item Saved",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
