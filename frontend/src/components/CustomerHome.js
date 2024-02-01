import React, { lazy, Suspense } from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
// import Login from "./Customer Authentication/Login";
// import Signup from "./Customer Authentication/Signup";

const Login = lazy(() => import("./Customer Authentication/Login"));
const Signup = lazy(() => import("./Customer Authentication/Signup"));

const CustomerHome = () => {
  return (
    <div>
      <Container maxW="xl" centerContent>
        <Box
          d="flex"
          justifyContent="center"
          p={3}
          bg={"white"}
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Text
            align="center"
            color="black"
            fontSize="4xl"
            fontFamily="work sans"
          >
            Customer Page
          </Text>{" "}
        </Box>{" "}
        <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
          <Tabs variant="soft-rounded" colorScheme="purple">
            <TabList>
              <Tab width="50%"> Login </Tab> <Tab width="50%"> Sign Up </Tab>{" "}
            </TabList>{" "}
            <TabPanels>
              <TabPanel>
                {" "}
                <Suspense fallback={<div>Loading...</div>}>
                  <Login />
                </Suspense>
              </TabPanel>{" "}
              <TabPanel>
                {" "}
                <Suspense fallback={<div>Loading...</div>}>
                  <Signup />{" "}
                </Suspense>
              </TabPanel>{" "}
            </TabPanels>{" "}
          </Tabs>{" "}
        </Box>{" "}
      </Container>
    </div>
  );
};

export default CustomerHome;
