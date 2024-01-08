import React, { useEffect, useState } from "react";
import "../../../src/App.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { State } from "../../Context/Provider";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  Image,
  Text,
  Toast,
  VStack,
  useToast,
} from "@chakra-ui/react";
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
  const [cartItems, setCartItems] = useState([]);

  const [newUser, setNewUser] = useState();
  const navigate = useNavigate();
  const toast = useToast();

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
    const fetchCartItems = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${newUser.data.token}`,
          },
        };
        const { data } = await axios.get(
          `http://localhost:5000/orderFromCustomer/customer/${newUser.data.id}`,
          config
        );

        // Initialize the cartItems state with the fetched data
        setCartItems(
          data.data.map((item) => ({
            itemId: item.item,
            quantity: item.quantity,
          }))
        );
      } catch (err) {
        console.error("Error fetching cart items:", err);
      }
    };

    // Fetch initial cart items when the component mounts
    fetchCartItems();

    fetchItems();
  }, [searchTerm, sortOrder, id, category, newUser]);

  const handleAddToCart = async (item) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${newUser.data.token}`,
        },
      };
      const itemId = item._id;
      const price = item.price;
      const restaurant = item.restaurant;
      const quantity = 1;
      const customer = newUser.data.id;
      console.log(itemId, price, restaurant, quantity, customer);

      const existingCartItemIndex = cartItems.findIndex(
        (cartItem) => cartItem.itemId === itemId
      );

      if (existingCartItemIndex !== -1) {
        // Item is already in the cart, handle removal
        await handleRemoveFromCart(itemId);
      } else {
        // Item is not in the cart, add it
        const data = await axios.post(
          `http://localhost:5000/orderFromCustomer`,
          { itemId, price, restaurant, quantity, customer },
          config
        );

        if (data) {
          toast({
            status: "success",
            duration: 1500,
            title: "Item Added to Cart",
            position: "top",
            isClosable: true,
          });
        }

        // Update the cartItems state with the added item
        setCartItems([...cartItems, { itemId, quantity }]);
      }
    } catch (err) {
      console.log("Error in Adding/Removing cart", err);
      toast({
        status: "warning",
        duration: 1500,
        title: "Error in adding/removing item to/from cart",
        position: "top",
        isClosable: true,
      });
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      // Implement the logic to remove the item from the cart in the database
      const config = {
        headers: {
          Authorization: `Bearer ${newUser.data.token}`,
        },
      };

      const data = await axios.delete(
        `http://localhost:5000/orderFromCustomer/${itemId}`,
        config
      );

      // Update the cartItems state to remove the item
      const updatedCartItems = cartItems.filter(
        (cartItem) => cartItem.itemId !== itemId
      );
      setCartItems(updatedCartItems);

      // Notify the user that the item has been removed
      if (data) {
        toast({
          status: "success",
          duration: 1500,
          title: "Item Removed from Cart",
          position: "top",
          isClosable: true,
        });
      }
    } catch (err) {
      console.log("Error in Removing cart", err);
      toast({
        status: "warning",
        duration: 1500,
        title: "Error in removing item from cart",
        position: "top",
        isClosable: true,
      });
    }
  };

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
                  <Text fontSize="5xl" fontWeight="bold" fontFamily="Long Cang">
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
                    <Button
                      colorScheme={
                        cartItems.some(
                          (cartItem) => cartItem.itemId === item._id
                        )
                          ? "red"
                          : "teal"
                      }
                      onClick={() => handleAddToCart(item)}
                    >
                      {cartItems.some(
                        (cartItem) => cartItem.itemId === item._id
                      )
                        ? "Remove from Cart"
                        : "Add to Cart"}
                    </Button>
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
