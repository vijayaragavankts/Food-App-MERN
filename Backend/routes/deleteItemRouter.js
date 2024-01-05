const express = require("express");
const Item = require("../models/itemSchema");
const router = express.Router();

router.delete("/:id/delete", async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findByIdAndDelete(id);
    if (item) {
      return res.status(200).json({
        message: "Successfully Deleted",
        success: true,
        data: item,
      });
    } else {
      return res.status(404).json({
        message: "Item not found",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

module.exports = router;
