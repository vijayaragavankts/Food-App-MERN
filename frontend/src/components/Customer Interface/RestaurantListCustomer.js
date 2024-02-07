import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { State } from "../../Context/Provider";
import { Link, useNavigate } from "react-router-dom";
import image from "../../image/location-pin.png";
import cartImage from "../../image/trolley.png";
import { URL } from "../../Urls";
import Loader from "../Loader";

const RestaurantListCustomer = ({ searchTerm, filter, sortOrder }) => {
  const { user } = State();
  const [restaurantDetail, setRestaurantDetail] = useState([]);
  const [newUser, setNewUser] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
        credentials: "include",
        headers: {
          Authorization: `Bearer ${newUser.data.token}`,
        },
      };
      const { data } = await axios.get(
        `${URL}/showRestaurantsToCustomer`,
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

  useEffect(() => {
    if (
      filteredAndSortedRestaurants &&
      filteredAndSortedRestaurants.length > 0
    ) {
      setLoading(false); // Set loading to false when restaurants are loaded
    }
  }, [filteredAndSortedRestaurants]);

  return (
    <>
      {loading ? ( // Show loader if loading is true
        <Flex justify="center" align="center" minHeight="400px">
          <Loader />
        </Flex>
      ) : (
        <Flex justify="center" wrap="wrap">
          {filteredAndSortedRestaurants.map((restaurant) => (
            <Box
              key={restaurant._id}
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              m={4}
              boxShadow="md"
              transition="transform 0.2s, box-shadow 0.2s"
              _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
            >
              <Image
                src={
                  restaurant.image ||
                  "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600"
                }
                alt={restaurant.name}
                h="200px"
                objectFit="cover"
              />
              <Box p={4}>
                <Text fontSize="3xl" fontWeight="bold" mb={2} color="teal.500">
                  {restaurant.name}
                </Text>
                <VStack spacing={2} align="left">
                  <Text fontSize="lg" mb={1}>
                    {`${restaurant.cuisine_type} Cuisine`}
                  </Text>
                  <Text
                    fontSize="md"
                    color="gray.700"
                    mb={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Image src={image} alt="Location:" boxSize="20px" mr={2} />
                    <i>{restaurant.location}</i>
                  </Text>
                  <Flex align="center" justifyContent="space-between">
                    <span>
                      <Badge colorScheme="green" mr={2} fontSize="xl">
                        {restaurant.rating}
                      </Badge>
                      <Icon as={StarIcon} color="yellow.500" fontSize="xl" />
                    </span>
                    <span>
                      <Link to={`${restaurant._id}/cart`}>
                        <Image
                          src={cartImage}
                          alt="Cart"
                          boxSize="30px"
                          mr={2}
                        />
                      </Link>
                    </span>
                  </Flex>
                  <Link to={`/restaurant/${restaurant._id}`}>
                    <Button colorScheme="teal" variant="outline">
                      View Now
                    </Button>
                  </Link>
                </VStack>
              </Box>
            </Box>
          ))}
        </Flex>
      )}
    </>
  );
};

export default RestaurantListCustomer;
