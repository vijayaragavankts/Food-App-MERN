import "./App.css";
import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "./components/Loader";

const Home = lazy(() => import("./components/Home"));
// import Home from "./components/Home";

// import RestaurantHome from "./components/RestaurantHome";
const RestaurantHome = lazy(() => import("./components/RestaurantHome"));

// import CustomerHome from "./components/CustomerHome";
const CustomerHome = lazy(() => import("./components/CustomerHome"));

// import RestaurantMain from "./components/Restaurant Interface/RestaurantMain";
const RestaurantMain = lazy(() =>
  import("./components/Restaurant Interface/RestaurantMain")
);

// import CustomerMain from "./components/Customer Interface/CustomerMain";
const CustomerMain = lazy(() =>
  import("./components/Customer Interface/CustomerMain")
);

// import RestaurantDetailsPage from "./components/Customer Interface/RestaurantDetailsPage";
const RestaurantDetailsPage = lazy(() =>
  import("./components/Customer Interface/RestaurantDetailsPage")
);

// import ItemsHotel from "./components/Customer Interface/ItemsHotel";
const ItemsHotel = lazy(() =>
  import("./components/Customer Interface/ItemsHotel")
);

// import CreateNewItem from "./components/Restaurant Interface/CreateNewItem";
const CreateNewItem = lazy(() =>
  import("./components/Restaurant Interface/CreateNewItem")
);

// import NotFound from "./NotFound";
const NotFound = lazy(() => import("./NotFound"));

// import OrderCustomer from "./components/Orders/OrderCustomer";
const OrderCustomer = lazy(() => import("./components/Orders/OrderCustomer"));

// import OrderRestaurant from "./components/Orders/OrderRestaurant";
const OrderRestaurant = lazy(() =>
  import("./components/Orders/OrderRestaurant")
);

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loader />}>
              <Home />
            </Suspense>
          }
          exact
        />
        <Route
          path="/restaurant"
          element={
            <Suspense fallback={<Loader />}>
              <RestaurantHome />
            </Suspense>
          }
          exact
        />
        <Route
          path="/customer"
          element={
            <Suspense fallback={<Loader />}>
              <CustomerHome />
            </Suspense>
          }
          exact
        />
        <Route
          path="/restaurantMain"
          element={
            <Suspense fallback={<Loader />}>
              <RestaurantMain />
            </Suspense>
          }
          exact
        />
        <Route
          path="/customerMain"
          element={
            <Suspense fallback={<Loader />}>
              <CustomerMain />
            </Suspense>
          }
          exact
        />
        <Route
          path="/restaurant/:id"
          element={
            <Suspense fallback={<Loader />}>
              <RestaurantDetailsPage />
            </Suspense>
          }
          exact
        />
        <Route
          path="/:id/items"
          element={
            <Suspense fallback={<Loader />}>
              <ItemsHotel />
            </Suspense>
          }
          exact
        />
        <Route
          path="/create"
          element={
            <Suspense fallback={<Loader />}>
              <CreateNewItem />
            </Suspense>
          }
          exact
        />
        <Route
          path="/notFound"
          element={
            <Suspense fallback={<Loader />}>
              <NotFound />
            </Suspense>
          }
          exact
        />
        <Route
          path="/customerMain/:id/cart"
          element={
            <Suspense fallback={<Loader />}>
              <OrderCustomer />
            </Suspense>
          }
          exact
        />
        <Route
          path="/restaurantOrders"
          element={
            <Suspense fallback={<Loader />}>
              <OrderRestaurant />
            </Suspense>
          }
          exact
        />
      </Routes>
    </div>
  );
}

export default App;
