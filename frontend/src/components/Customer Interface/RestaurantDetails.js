// RestaurantDetails.js
import React, { useEffect } from "react";
import { Box, Image, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

const RestaurantDetails = (restaurant) => {
  const hotelName = restaurant.prop[0].restaurant.name;
  const hotelId = restaurant.prop[0].restaurant._id;

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (!storedUser) {
      navigate("/customer");
    }
  }, []);

  return (
    <>
      <Text fontSize="5xl" fontWeight="bold" mb={2}>
        Categories in {hotelName}
      </Text>
      <Wrap spacing={4}>
        {restaurant.prop.map((category) => (
          <WrapItem
            key={category._id}
            width={{ base: "100%", md: "48%", lg: "32%" }}
          >
            <Box
              key={category.id}
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              m={4}
              boxShadow="base"
              transition="transform 0.2s"
              _hover={{ transform: "scale(1.05)" }}
              cursor="pointer"
            >
              <Link to={`/${hotelId}/items?category=${category.category_name}`}>
                <Image src={category.image} alt={category.category_name} />
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  p={4}
                  color="teal.500"
                  bg="teal.50"
                  borderBottomWidth="1px"
                  borderBottomColor="teal.200"
                  width="100%"
                  textAlign="center"
                >
                  {category.category_name}
                </Text>
              </Link>
            </Box>
          </WrapItem>
        ))}
      </Wrap>
    </>
  );
};

export default RestaurantDetails;
