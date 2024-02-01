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
import { State } from "../../Context/Provider";
import { URL } from "../../Urls";

const OrderCustomer = () => {
  const [newUser, setNewUser] = useState(null);
  const { user } = State();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPayment, setIsPayment] = useState(false);
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
        credentials: "include",
        headers: {
          Authorization: `Bearer ${newUser.data.token}`,
        },
      };

      const { data } = await axios.get(
        `${URL}/orderFromCustomer/customer/${newUser.data.id}/${id}`,
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
        credentials: "include",
        headers: {
          Authorization: `Bearer ${newUser.data.token}`,
        },
      };
      await axios.delete(`${URL}/orderFromCustomer/${itemId}`, config);

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

  const initpayment = (data) => {
    const options = {
      key: "rzp_test_Wa2s8fVV4XSYsM",
      amount: data.amount,
      currency: data.currency,
      description: "Test Transaction",
      order_id: data.id,
      handler: async (response) => {
        try {
          const verifyUrl = `${URL}/api/payment/verify`;
          const { data } = await axios.post(verifyUrl, response);
          console.log(data);
          if (data) {
            console.log("world");
            try {
              console.log("hello");
              const config = {
                credentials: "include",
                headers: {
                  Authorization: `Bearer ${newUser.data.token}`,
                },
              };
              // saving data in db
              const data = await axios.post(
                `${URL}/orderRestaurant`,
                {
                  restaurant: id,
                  customer: newUser.data.id,
                  items: cartItems.map((item) => item.item._id),
                  quantity: cartItems.map((item) => item.quantity),
                  total: calculateTotal(),
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

                // delete the items in db --- customer and restaurant id required
                const restaurant = id;
                const customer = newUser.data.id;
                try {
                  const config = {
                    credentials: "include",
                    headers: {
                      Authorization: `Bearer ${newUser.data.token}`,
                    },
                  };
                  const data = await axios.delete(
                    `${URL}/orderFromCustomer/${customer}/${restaurant}`,

                    config
                  );
                  console.log(data);
                } catch (err) {
                  console.log(err);
                }

                // before navigating to the customerMain have to delete all items present in the cart
                navigate("/customerMain");
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
          }
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "#3399cc",
      },
    };

    // Create a new instance of Razorpay
    const rzp1 = new window.Razorpay(options);

    // Open the payment modal
    rzp1.on("payment.failed", function (response) {
      console.log(response.error.code);
      console.log(response.error.description);
      console.log(response.error.source);
      console.log(response.error.step);
      console.log(response.error.reason);
      console.log(response.error.metadata.order_id);
      console.log(response.error.metadata.payment_id);
    });

    rzp1.open();
  };

  const handleCheckout = async (cartItems) => {
    const restaurant = id;
    const customer = newUser.data.id;
    const items = cartItems.map((item) => item.item._id);
    const quantity = cartItems.map((item) => item.quantity);
    const totalAmount = calculateTotal(); // Calculate total on the client side
    setIsPayment(false);
    console.log("Request Payload:", {
      restaurant,
      customer,
      items,
      quantity,
      totalAmount,
    });

    // razorpay payment code
    try {
      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${newUser.data.token}`,
      //   },
      // };
      const orderUrl = `${URL}/api/payment/orders`;
      const { data } = await axios.post(orderUrl, { totalAmount });
      console.log(data);
      initpayment(data.data);
    } catch (err) {
      console.log("Error in payment", err);
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
