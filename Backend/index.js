const express = require("express");
const mongoose = require("mongoose");
const homeRouter = require("./routes/homeRouter");
const customerRouter = require("./routes/customerRouter");
const restaurantRouter = require("./routes/restaurantRouter");
const getCategoryFromRestaurantRouter = require("./routes/getCategoryFromRestaurantRouter");
const getItemFromRestaurantRouter = require("./routes/getItemFromRestaurantRouter");
const showRestaurantsToCustomer = require("./routes/showRestaurantsToCustomer");
const session = require("express-session");
const protectRestaurant = require("./Middleware/authmiddlewareRestaurant"); // middleware for protecting restaurant pages
const protectCustomer = require("./Middleware/authmiddlewareCustomer"); // middleware for protecting customer pages

mongoose
  .connect("mongodb://localhost:27017/foodApp")
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(
  session({ secret: "THISISSECRET", resave: true, saveUninitialized: true })
);

app.use(express.json()); // middleware

app.use("/", homeRouter);
app.use("/customer", customerRouter);
app.use("/restaurant", restaurantRouter);
app.use(
  "/getCategoryfromrestaurant",
  protectRestaurant,
  getCategoryFromRestaurantRouter
);
app.use(
  "/getItemsfromRestaurant",
  protectRestaurant,
  getItemFromRestaurantRouter
);
app.use(
  "/showRestaurantsToCustomer",
  protectCustomer,
  showRestaurantsToCustomer
);

app.listen(5000, () => {
  console.log("Serving in the port 5000");
});