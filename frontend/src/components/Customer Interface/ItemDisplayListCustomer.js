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
  VStack,
  useToast,
} from "@chakra-ui/react";
import NotFound from "../../NotFound";
import { URL } from "../../Urls";
import Loader from "../Loader";

const ItemDisplayListCustomer = ({ searchTerm, sortOrder }) => {
  const { id } = useParams();
  const location = useLocation();
  const queryString = location.search;
  const queryParams = new URLSearchParams(queryString);
  const category = queryParams.get("category");
  const { user } = State();
  const [itemInfo, setItemInfo] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [newUser, setNewUser] = useState();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("userInfo"))) {
      navigate("/customer");
    }
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setNewUser(storedUser);
  }, [navigate]);

  const fetchItems = async () => {
    try {
      const config = {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${newUser.data.token}`,
        },
      };
      const { data } = await axios.get(
        `${URL}/showRestaurantsToCustomer/${id}/items?category=${category}`,
        config
      );
      setItemInfo(data.data);
      setLoading(false); // Set loading to false after fetching items
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const config = {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${newUser.data.token}`,
          },
        };
        const { data } = await axios.get(
          `${URL}/orderFromCustomer/customer/${newUser.data.id}`,
          config
        );
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
    fetchCartItems();
    fetchItems();
  }, [searchTerm, sortOrder, id, category, newUser]);

  // ----------------------------------------------------------------------------------------------
  const filteredAndSortedItems = itemInfo
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const compareResult =
        sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      return compareResult;
    });

  // ------------------------------------------------------------------------------------------------

  const handleAddToCart = async (item) => {
    try {
      const config = {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${newUser.data.token}`,
        },
      };
      const itemId = item._id;
      const price = item.price;
      const restaurant = item.restaurant;
      const quantity = 1;
      const customer = newUser.data.id;

      const existingCartItemIndex = cartItems.findIndex(
        (cartItem) => cartItem.itemId === itemId
      );

      if (existingCartItemIndex !== -1) {
        await handleRemoveFromCart(itemId);
      } else {
        const data = await axios.post(
          `${URL}/orderFromCustomer`,
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
      const config = {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${newUser.data.token}`,
        },
      };
      const data = await axios.delete(
        `${URL}/orderFromCustomer/${itemId}`,
        config
      );
      const updatedCartItems = cartItems.filter(
        (cartItem) => cartItem.itemId !== itemId
      );
      setCartItems(updatedCartItems);
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
        {loading ? ( // Show loader if loading is true
          <Loader />
        ) : (
          // Render the item display list when loading is false
          <>
            {filteredAndSortedItems.map((item) => (
              <Box
                key={item._id}
                maxW="sm"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                m={4}
                boxShadow="base"
              >
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
              </Box>
            ))}
          </>
        )}
      </Flex>
    </div>
  );
};

export default ItemDisplayListCustomer;
