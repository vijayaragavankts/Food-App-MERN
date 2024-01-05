import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Badge,
  Box,
  Button,
  Flex,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { State } from "../../Context/Provider";
import { Link, useNavigate } from "react-router-dom";

const RestaurantListCustomer = ({ searchTerm, filter, sortOrder }) => {
  const { user } = State();
  const [restaurantDetail, setRestaurantDetail] = useState([]);
  const [newUser, setNewUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("userInfo"))) {
      navigate("/customer");
    }
    // Fetch user data from localStorage only once when the component mounts
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setNewUser(storedUser);
  }, []);

  const fetchAll = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${newUser.data.token}`,
        },
      };
      const { data } = await axios.get(
        "http://localhost:5000/showRestaurantsToCustomer",
        config
      );
      //   console.log(data.data);
      console.log(newUser);
      setRestaurantDetail(data.data);
    } catch (err) {}
  };

  const filteredAndSortedRestaurants = restaurantDetail
    .filter((restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (restaurant) => filter === "all" || restaurant.cuisine_type === filter
    )
    .sort((a, b) => {
      const compareResult =
        sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating;
      return compareResult;
    });

  useEffect(() => {
    if (newUser) {
      // Fetch restaurant data only if newUser is available
      fetchAll();
    }
  }, [newUser]);

  return (
    <>
      <Flex justify="center" wrap="wrap">
        {filteredAndSortedRestaurants.map((restaurant) => (
          <Box
            key={restaurant._id}
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            m={4}
            boxShadow="base"
          >
            <Link to={`/restaurant/${restaurant._id}`}>
              <Image
                src={
                  restaurant.image
                    ? restaurant.image
                    : "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600"
                }
                alt={restaurant.name}
              />
              <Box p={4}>
                <Text fontSize="xl" fontWeight="bold">
                  {restaurant.name}
                </Text>
                <Text fontSize="md" color="gray.600">
                  Cuisine: {restaurant.cuisine_type}
                </Text>
                <Text fontSize="md" color="gray.600">
                  Location: {restaurant.location}
                </Text>
                <Flex align="center" mt={2}>
                  <Badge colorScheme="green" mr={2}>
                    Rating: {restaurant.rating}
                  </Badge>
                </Flex>
                <VStack mt={4} spacing={2}>
                  <Button colorScheme="teal">View Now</Button>
                </VStack>
              </Box>
            </Link>
          </Box>
        ))}
      </Flex>
    </>
  );
};

export default RestaurantListCustomer;
