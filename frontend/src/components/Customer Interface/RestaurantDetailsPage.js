import React, { lazy, useEffect, useState, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { State } from "../../Context/Provider";
import axios from "axios";
// import RestaurantDetails from "./RestaurantDetails";
import { Container } from "@chakra-ui/react";
import NotFound from "../../NotFound";
import { URL } from "../../Urls";
import Loader from "../Loader";

const RestaurantDetails = lazy(() => import("./RestaurantDetails"));

const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const { user } = State();
  const [restaurantInfo, setRestaurantInfo] = useState();
  const [newUser, setNewUser] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from localStorage only once when the component mounts
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setNewUser(storedUser);
  }, []);

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/customer");
  //   }
  // }, [user, navigate]);

  const fetchSingleRestaurant = async () => {
    try {
      const config = {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${newUser.data.token}`,
        },
      };
      const response = await axios.get(
        `${URL}/showRestaurantsToCustomer/${id}/categories`,
        config
      );

      if (!response) {
        navigate("/notFound");
        return;
      }
      // Check if response.data is defined before accessing response.data.data
      if (response.data && response.data.data) {
        setRestaurantInfo(response.data.data);
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (err) {
      console.log(err);
      // navigate("/notFound");
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchSingleRestaurant();
  }, [newUser, id]);
  return (
    <>
      <Container maxW="container.lg" mt={10}>
        {restaurantInfo && restaurantInfo.length > 0 ? (
          <Suspense fallback={<Loader />}>
            <RestaurantDetails prop={restaurantInfo} />
          </Suspense>
        ) : (
          <Loader />
        )}
      </Container>
    </>
  );
};

export default RestaurantDetailsPage;
