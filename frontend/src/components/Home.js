import { Button, ButtonGroup, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const navigateToRestaurant = () => {
    navigate("/restaurant");
  };
  const navigateToCustomer = () => {
    navigate("/customer");
  };
  return (
    <div>
      <Text bg={"tomato"} bgClip="text" fontSize="7xl" fontWeight="extrabold">
        BiteBurst
      </Text>
      <Stack
        spacing={4}
        direction="row"
        align="center"
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        padding={{ base: 4, sm: 6, md: 8, lg: 10 }} // Adjust padding based on screen size
      >
        <ButtonGroup
          display="flex"
          flexDirection={{ base: "column", sm: "column", md: "row", lg: "row" }}
          alignItems="center"
          justifyContent="center"
          height="50vh"
          gap={{ base: 50, sm: 100, md: 250, lg: 430 }}
        >
          <Button
            colorScheme="orange"
            height={{ base: 50, sm: "70px", md: 100, lg: 110 }}
            width={{ base: 280, sm: 300, md: 200, lg: 280 }}
            fontSize={{ base: 18, sm: 20, md: 24, lg: 30 }}
            onClick={navigateToRestaurant}
          >
            For Restaurants
          </Button>
          <Button
            colorScheme="orange"
            height={{ base: 50, sm: "70px", md: 100, lg: 110 }}
            width={{ base: "100%", sm: 300, md: 200, lg: 280 }}
            fontSize={{ base: 18, sm: 20, md: 24, lg: 30 }}
            onClick={navigateToCustomer}
          >
            For Customers
          </Button>
        </ButtonGroup>
      </Stack>
    </div>
  );
};

export default Home;
