import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { State } from "../../Context/Provider";
import axios from "axios";
import { Box, Button, Flex, Image, Text, VStack } from "@chakra-ui/react";
import NotFound from "../../NotFound";

const ItemDisplayListCustomer = ({ searchTerm, sortOrder }) => {
  const { id } = useParams();
  const location = useLocation();
  // Access the search property of the location object, which contains the query string
  const queryString = location.search;
  // Use a helper function to parse the query string into an object
  const queryParams = new URLSearchParams(queryString);
  const category = queryParams.get("category");
  const { user } = State();
  const [itemInfo, setItemInfo] = useState([]);

  const [newUser, setNewUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("userInfo"))) {
      navigate("/customer");
    }
    // Fetch user data from localStorage only once when the component mounts
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setNewUser(storedUser);
  }, [navigate]);

  // fetch items in that restaurant and category
  const fetchItems = async () => {
    try {
      // console.log(user.data.token);
      const config = {
        headers: {
          Authorization: `Bearer ${newUser.data.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/showRestaurantsToCustomer/${id}/items?category=${category}`,
        config
      );

      console.log(data.data);
      setItemInfo(data.data);

      //   setItemInfo(data.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const filteredAndSortedItems = itemInfo
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    .sort((a, b) => {
      const compareResult =
        sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      return compareResult;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchItems();
  }, [searchTerm, sortOrder, id, category, newUser]);
  return (
    <div>
      <Flex justify="center" wrap="wrap">
        {filteredAndSortedItems
          ? filteredAndSortedItems.map((item) => (
              <Box
                key={item._id}
                maxW="sm"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                m={4}
                boxShadow="base"
              >
                {/* <Link to={`/restaurant/${restaurant._id}`}> */}
                <Image src={item.image} alt={item.name} />
                <Box p={4}>
                  <Text fontSize="xl" fontWeight="bold">
                    {item.name}
                  </Text>
                  <Text fontSize="3xl" color="gray.600" fontStyle="bold">
                    {`$${item.price}`}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    {item.description}
                  </Text>
                  {/* <Flex align="center" mt={2}>
                <Badge colorScheme="green" mr={2}>
                  Rating: {restaurant.rating}
                </Badge>
              </Flex> */}
                  <VStack mt={4} spacing={2}>
                    <Button colorScheme="teal">Order Now</Button>
                  </VStack>
                </Box>
                {/* </Link> */}
              </Box>
            ))
          : ""}
      </Flex>
    </div>
  );
};

export default ItemDisplayListCustomer;
