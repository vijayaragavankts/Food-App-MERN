import { Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";

const NotFound = () => {
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
      <Text fontSize="xl">Page Not Found</Text>
    </Flex>
  );
};

export default NotFound;
