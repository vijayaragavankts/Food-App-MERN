const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurantSchema");
const Category = require("../models/categorySchema");
const Item = require("../models/itemSchema");

router.get("/", async (req, res) => {
  const hotels = await Restaurant.find();
  if (!hotels) {
    res.status(500).json({
      success: false,
      message: "No Restaurants Available",
    });
  }
  const data = hotels;
  return res.status(200).json({
    success: true,
    message: "Displaying all available hotels",
    data: data,
  });
});

router.get("/single/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(400).json({
        success: false,
        message: "No restaurant found with this id",
      });
    }
    const data = restaurant;
    return res.status(200).json({
      success: true,
      message: "Single Restaurant is Displaying",
      data: data,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id/categories", async (req, res) => {
  try {
    const { id } = req.params;
    const categories = await Category.find({ restaurant: id }).populate(
      "restaurant"
    );
    if (!categories) {
      return res.status(400).json({
        success: false,
        message: "Cant find any categories for this id",
      });
    }
    const data = categories;
    return res.status(200).json({
      success: true,
      message: "Displaying Categories in this restaurant id",
      data: data,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id/items", async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.query;
    // if no query string is passed
    console.log(category);
    if (!category) {
      return res.status(500).json({
        success: false,
        message: "There is no query string is passed to check",
      });
    }
    // finding the category with the restaurant id and category name
    const cat = await Category.findOne({
      restaurant: id,
      category_name: `${category}`,
    });

    console.log(cat);
    if (!cat) {
      return res.status(400).json({
        success: false,
        message: "No category with this restaurant id and category name",
      });
    }

    // finding the items on the restaurant with thr restaurant id and category id
    const items = await Item.find({
      restaurant: id,
      category: cat._id,
    });

    if (!items) {
      return res.status(400).json({
        success: false,
        message: "NO items Available",
      });
    }

    const data = items;

    return res.status(200).json({
      success: true,
      message:
        "Displaying the list of items under this restaurant with this category",
      data: data,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
