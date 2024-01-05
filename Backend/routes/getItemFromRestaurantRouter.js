const express = require("express");
const Item = require("../models/itemSchema");
const Category = require("../models/categorySchema");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { category, name, price, description, image, restaurant } = req.body;

    if (!name || !price || !category || !description || !restaurant || !image) {
      res.status(500).json({
        success: false,
        message: "Enter all the fields",
      });
    }
    // category is a String , now we have to fetch in Category Schema with this restaurant Id and catefory name
    // if this is available then we just get the particular category Id and add these data to Item Schema Model
    // Otherwise we have to create a new Category with the given cateogry name and using this category id, add data to Item Schema

    const isCategory = await Category.findOne({
      restaurant: restaurant,
      category_name: category,
    });
    if (isCategory) {
      // means , there is an existing category in this restaurant , therefore plz add the item to the existing category
      const id = isCategory._id;
      const item = await new Item({
        category: id,
        restaurant: restaurant,
        name: name,
        price: price,
        description: description,
        image: image,
      });
      await item.save();
      return res.status(200).json({
        message:
          "Got Item from restaurant and matched with existing category and stored in db",
        success: true,
        data: item,
      });
    } else {
      // there is no existing category in this restaurant with this category_name
      // so create a new category and get the category id and add data to the Item Schema
      const cat = await new Category({
        restaurant: restaurant,
        category_name: category,
        image: "",
      });
      await cat.save();
      const id = cat._id;
      const item = await new Item({
        category: id,
        restaurant: restaurant,
        name: name,
        price: price,
        description: description,
        image: image,
      });
      await item.save();
      return res.status(200).json({
        message: "Got Item from restaurant and stored in db",
        success: true,
        data: item,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      message: "Error Occurred",
      success: false,
    });
  }
});

// updating a item in restaurant

// updating a item in restaurant
router.put("/", async (req, res) => {
  const { name, price, description, image, itemId } = req.body;
  try {
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(400).json({
        success: false,
        message: "There is no item with this id in DB to Update",
        data: "No item to Update",
      });
    }

    // Assuming req.body contains the updated data you want to apply
    const updating = await Item.findByIdAndUpdate(
      itemId,
      {
        name: name || item.name,
        price: price || item.price,
        description: description || item.description,
        image: image || item.image,
        restaurant: item.restaurant,
        category: item.category,
      },
      { new: true }
    );

    if (!updating) {
      return res.status(500).json({
        success: false,
        message: "Error updating the item",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: updating,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error updating the item",
    });
  }
});

module.exports = router;
