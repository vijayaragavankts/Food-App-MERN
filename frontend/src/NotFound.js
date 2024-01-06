import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/customerMain");
  };
  return (
    <Flex
      align="center"
      justify="center"
      direction="column"
      h="100vh"
      textAlign="center"
    >
      <Heading mb={4} fontSize="6xl" color="red.500">
        404
      </Heading>
      <Text fontSize="xl">Items Not Found in this Restaurant</Text>
      <Button onClick={handleBack}>Back</Button>
    </Flex>
  );
};

export default NotFound;
