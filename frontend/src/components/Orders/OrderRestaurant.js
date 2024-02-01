import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { State } from "../../Context/Provider";
import { useNavigate } from "react-router-dom";
import { URL } from "../../Urls";

const OrderRestaurant = () => {
  const [loading, setLoading] = useState(true);
  const [newHotel, setNewHotel] = useState();
  const { hotel } = State();
  const navigate = useNavigate();
  const [temp, setTemp] = useState(false);
  const [info, setInfo] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const storedHotel = JSON.parse(localStorage.getItem("hotelInfo"));
    if (!storedHotel) {
      navigate("/restaurant");
    } else {
      setNewHotel(storedHotel);
    }
  }, []);

  useEffect(() => {
    const fetchorders = async () => {
      try {
        const config = {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${newHotel.data.token}`,
          },
        };
        const { data } = await axios.get(
          `${URL}/orderRestaurant/${newHotel.data.id}`,
          config
        );
        console.log(data.data);
        setInfo(data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchorders();
  }, [hotel, newHotel, temp]);

  // const handleTotal = (itemArray, qtyArray) => {
  //   let total = 0;

  //   // Iterate over each item in the array
  //   for (let i = 0; i < itemArray.length; i++) {
  //     // Calculate the subtotal for the current item (price * quantity)
  //     const subtotal = itemArray[i].price * qtyArray[i];

  //     // Add the subtotal to the total
  //     total += subtotal;
  //   }

  //   // Return the total amount
  //   return total;
  // };

  const handleDelivery = async (id) => {
    try {
      const config = {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${newHotel.data.token}`,
        },
      };
      const data = await axios.delete(`${URL}/orderRestaurant/${id}`, config);
      if (data) {
        toast({
          title: "Items Delivered Successfully",
          duration: 1500,
          isClosable: true,
          position: "bottom",
          status: "success",
        });
        setTemp(!temp);
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error occured in Deleting Order",
        duration: 1500,
        isClosable: true,
        position: "bottom",
        status: "error",
      });
    }
  };

  return (
    <Box p={4}>
      <Heading size="xl" mb={4}>
        Orders for Restaurant
      </Heading>

      {loading ? (
        <Text fontSize="lg" color="teal.500">
          Loading...
        </Text>
      ) : (
        <Table mt={4} variant="striped">
          <Thead>
            <Tr>
              <Th fontSize="md">Order ID</Th>
              <Th fontSize="md">Customer</Th>
              <Th fontSize="md">Items</Th>
              <Th fontSize="md">Total Amount</Th>
              <Th fontSize="md">status</Th>
              <Th fontSize="md">Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {info.map((order) => (
              <Tr key={order._id}>
                <Td>{order._id}</Td>
                <Td>{order.customer.username}</Td>
                <Td>
                  {order.item.map((item, idx) => (
                    <span key={item._id}>
                      {item.name} : {order.quantity[idx]},{" "}
                    </span>
                  ))}
                </Td>
                <Td>${order.total}</Td>
                <Td>
                  <Badge colorScheme="green" mr={2}>
                    Paid
                  </Badge>
                </Td>
                <Td>
                  <Button
                    colorScheme="teal"
                    size="sm"
                    onClick={() => handleDelivery(order._id)}
                  >
                    Deliver
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default OrderRestaurant;
