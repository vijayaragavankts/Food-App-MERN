import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { State } from "../../Context/Provider";
import { useNavigate } from "react-router-dom";

const OrderRestaurant = () => {
  const [loading, setLoading] = useState(true);
  const [newHotel, setNewHotel] = useState();
  const { hotel } = State();
  const navigate = useNavigate();
  const [info, setInfo] = useState([]);

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
          headers: {
            Authorization: `Bearer ${hotel.data.token}`,
          },
        };
        const { data } = await axios.get(
          `http://localhost:5000/orderRestaurant/${hotel.data.id}`,
          config
        );
        console.log(data.data);
        setInfo(data.data);
      } catch (err) {
        console.log(err);
      } finally {
        // setLoading(false);
      }
    };
    fetchorders();
  }, []);

  const handleTotal = (itemArray, qtyArray) => {
    let total = 0;

    // Iterate over each item in the array
    for (let i = 0; i < itemArray.length; i++) {
      // Calculate the subtotal for the current item (price * quantity)
      const subtotal = itemArray[i].price * qtyArray[i];

      // Add the subtotal to the total
      total += subtotal;
    }

    // Return the total amount
    return total;
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
            </Tr>
          </Thead>
          <Tbody>
            {info.map((order) => (
              <Tr key={order._id}>
                <Td>{order._id}</Td>
                <Td>{order.customer.username}</Td>
                <Td>{/* Display items here */}</Td>
                <Td>${() => handleTotal(order.item, order.quantity)}</Td>
              </Tr>
              // order.totalAmount
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default OrderRestaurant;
