import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Heading,
  IconButton,
  Image,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import axios from "axios";

const OrderCustomer = () => {
  const [newUser, setNewUser] = useState(null);

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (!storedUser) {
      navigate("/customer");
    } else {
      setNewUser(storedUser);
    }
  }, [navigate]);

  const fetchItems = async () => {
    try {
      if (!newUser || !newUser.data) {
        console.error("User information is not available");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${newUser.data.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/orderFromCustomer/customer/${newUser.data.id}/${id}`,
        config
      );

      console.log(data.data);
      setCartItems(data.data);
    } catch (err) {
      console.error("Error Occurred", err);
      toast({
        title: "Error",
        description: "Failed to fetch items. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [newUser]);

  const removeFromCart = async (itemId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${newUser.data.token}`,
        },
      };
      await axios.delete(
        `http://localhost:5000/orderFromCustomer/${itemId}`,
        config
      );

      const newCartItems = cartItems.filter((item) => item.item._id !== itemId);
      setCartItems(newCartItems);

      toast({
        title: "Item Removed Successfully from Cart",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error Occurred while removing item", err);
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.item._id === itemId) {
        const updatedItem = { ...item };
        updatedItem.quantity = newQuantity;
        return updatedItem;
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.item.price * item.quantity,
      0
    );
  };

  console.log(cartItems);

  const handleCheckout = async (cartItems) => {
    const restaurant = id;
    const customer = newUser.data.id;
    const items = cartItems.map((item) => item.item._id);
    const quantity = cartItems.map((item) => item.quantity);
    const totalAmount = calculateTotal(); // Calculate total on the client side

    console.log("Request Payload:", {
      restaurant,
      customer,
      items,
      quantity,
      totalAmount,
    });

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${newUser.data.token}`,
        },
      };

      const data = await axios.post(
        `http://localhost:5000/orderRestaurant`,
        {
          restaurant,
          customer,
          items,
          quantity,
          total: totalAmount,
        },
        config
      );

      console.log("Server Response:", data);

      if (data) {
        toast({
          title: "Payment was Successful",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error occurred in payment",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <Box p={4}>
      <Heading size="xl" mb={4}>
        Shopping Cart
      </Heading>

      {loading ? (
        <Text fontSize="lg" color="teal.500">
          Loading...
        </Text>
      ) : (
        <>
          <Table mt={4} variant="striped">
            <Thead>
              <Tr>
                <Th fontSize="md">Item Image</Th>
                <Th fontSize="md">Item Name</Th>
                <Th fontSize="md">Price Per Unit</Th>
                <Th fontSize="md">Quantity</Th>
                <Th fontSize="md">Actions</Th>
                <Th fontSize="md">Total Cost</Th>
              </Tr>
            </Thead>
            <Tbody>
              {cartItems.map((data) => (
                <Tr key={data._id}>
                  <Td>
                    <Image
                      src={data.item.image}
                      alt={data.item.name}
                      boxSize="70px"
                      objectFit="cover"
                    />
                  </Td>
                  <Td fontSize="lg">{data.item.name}</Td>
                  <Td fontSize="lg">${data.price}</Td>
                  <Td>
                    <HStack>
                      <IconButton
                        icon={<MinusIcon />}
                        onClick={() =>
                          updateQuantity(
                            data.item._id,
                            Math.max(data.quantity - 1, 1)
                          )
                        }
                        colorScheme="teal"
                      />
                      <Input
                        type="number"
                        min={1}
                        value={data.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            data.item._id,
                            parseInt(e.target.value, 10)
                          )
                        }
                        width="50px"
                        textAlign="center"
                        borderColor="teal.500"
                        focusBorderColor="teal.700"
                      />
                      <IconButton
                        icon={<AddIcon />}
                        onClick={() =>
                          updateQuantity(data.item._id, data.quantity + 1)
                        }
                        colorScheme="teal"
                      />
                    </HStack>
                  </Td>

                  <Td>
                    <Button
                      colorScheme="red"
                      size="md"
                      onClick={() => removeFromCart(data.item._id)}
                    >
                      Remove
                    </Button>
                  </Td>
                  <Td fontSize="lg">${data.price * data.quantity}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <VStack mt={4} align="flex-end">
            <Text fontSize="2xl" mr={2}>
              Total: ${calculateTotal()}
            </Text>
            <Button
              colorScheme="teal"
              size="lg"
              mt={4}
              mr={2}
              onClick={() => handleCheckout(cartItems)}
            >
              Pay
            </Button>
          </VStack>
        </>
      )}
    </Box>
  );
};

export default OrderCustomer;
