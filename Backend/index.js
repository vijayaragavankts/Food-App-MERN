const express = require("express");
const mongoose = require("mongoose");
const homeRouter = require("./routes/homeRouter");
const customerRouter = require("./routes/customerRouter");
const restaurantRouter = require("./routes/restaurantRouter");
const getCategoryFromRestaurantRouter = require("./routes/getCategoryFromRestaurantRouter");
const getItemFromRestaurantRouter = require("./routes/getItemFromRestaurantRouter");
const showRestaurantsToCustomer = require("./routes/showRestaurantsToCustomer");
const showItemsToRestaurant = require("./routes/showItemsToRestaurant");
const deleteItemRouter = require("./routes/deleteItemRouter");
const orderFromCustomer = require("./routes/orderFromCustomer");
const orderRestaurant = require("./routes/orderRestaurant");
const payment = require("./routes/payment");

const protectRestaurant = require("./Middleware/authmiddlewareRestaurant"); // middleware for protecting restaurant pages
const protectCustomer = require("./Middleware/authmiddlewareCustomer"); // middleware for protecting customer pages
const cors = require("cors");

require("dotenv").config();

// mongoose
//   .connect("mongodb://localhost:27017/foodApp")
//   .then(() => {
//     console.log("Database Connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI);

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "https://mern-food-app.onrender.com"], // Replace with the actual origin of your frontend
    credentials: true,
  })
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

app.use("/showItemsToRestaurant", protectRestaurant, showItemsToRestaurant);

app.use("/deleteItem", protectRestaurant, deleteItemRouter);

app.use(
  "/showRestaurantsToCustomer",
  protectCustomer,
  showRestaurantsToCustomer
);

// order
app.use("/orderFromCustomer", protectCustomer, orderFromCustomer);

app.use("/orderRestaurant", orderRestaurant);

// payment route
app.use("/api/payment", payment);

app.listen(5000, () => {
  console.log("Serving in the port 5000");
});
