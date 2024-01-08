import "./App.css";
import React from "react";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import RestaurantHome from "./components/RestaurantHome";
import CustomerHome from "./components/CustomerHome";
import RestaurantMain from "./components/Restaurant Interface/RestaurantMain";
import CustomerMain from "./components/Customer Interface/CustomerMain";
import RestaurantDetailsPage from "./components/Customer Interface/RestaurantDetailsPage";
import ItemsHotel from "./components/Customer Interface/ItemsHotel";
import CreateNewItem from "./components/Restaurant Interface/CreateNewItem";
import NotFound from "./NotFound";
import OrderCustomer from "./components/Orders/OrderCustomer";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/restaurant" element={<RestaurantHome />} exact />
        <Route path="/customer" element={<CustomerHome />} exact />
        <Route path="/restaurantMain" element={<RestaurantMain />} exact />
        <Route path="/customerMain" element={<CustomerMain />} exact />
        <Route
          path="/restaurant/:id"
          element={<RestaurantDetailsPage />}
          exact
        />
        <Route path="/:id/items" element={<ItemsHotel />} exact />
        <Route path="/create" element={<CreateNewItem />} exact />
        <Route path="/notFound" element={<NotFound />} exact />
        <Route
          path="/customerMain/:id/cart"
          element={<OrderCustomer />}
          exact
        />
      </Routes>
    </div>
  );
}

export default App;
