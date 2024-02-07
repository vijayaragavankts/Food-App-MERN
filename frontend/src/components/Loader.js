import React from "react";
import { Spin } from "antd";
import { Flex, Box } from "@chakra-ui/react";

const Loader = () => (
  <Flex height="100vh" width="100%" alignItems="center" justify="center">
    <Box>
      <Spin size="large" align="center" />
    </Box>
  </Flex>
);

export default Loader;
