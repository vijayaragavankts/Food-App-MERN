const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  category_name: {
    type: String,
  },
  image: {
    type: String,
    default:
      "https://images.pexels.com/photos/12842926/pexels-photo-12842926.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
});

categorySchema.pre("save", function (next) {
  if (this.category_name == "Dessert") {
    this.image =
      "https://images.pexels.com/photos/3631/summer-dessert-sweet-ice-cream.jpg?auto=compress&cs=tinysrgb&w=600";
    next();
  } else if (this.category_name == "Main Courses") {
    this.image =
      "https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=600";
    next();
  } else if (this.category_name == "Starters") {
    this.image =
      "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=600";
    next();
  } else if (this.category_name == "Sides") {
    this.image =
      "https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=600";
    next();
  } else if (this.category_name == "Beverage") {
    this.image =
      "https://images.pexels.com/photos/3008/drinks-supermarket-cans-beverage.jpg?auto=compress&cs=tinysrgb&w=600";
    next();
  }
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
