import React, { useEffect, useState } from "react";

import { Box, Container, Flex, Input, Select } from "@chakra-ui/react";
import ItemDisplayListCustomer from "./ItemDisplayListCustomer";
import { useNavigate } from "react-router-dom";

const ItemsHotel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const navigate = useNavigate();

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("userInfo"))) {
      navigate("/customer");
    }
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const handleSortOrderChange = (event) => {
    const value = event.target.value;
    setSortOrder(value);
  };

  return (
    <>
      <Container maxW="container.lg" mt={10}>
        <Box textAlign="center" mb={6}>
          <Input
            type="text"
            placeholder="Search Items..."
            value={searchTerm}
            onChange={handleSearch}
            size="lg"
            maxW="400px"
          />
        </Box>
        <Flex justify="space-between" align="center" mb={6}>
          <Select
            placeholder="Sort by..."
            value={sortOrder}
            onChange={handleSortOrderChange}
            width="150px"
          >
            {/* Add your sort options */}
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Select>
        </Flex>
      </Container>
      <ItemDisplayListCustomer searchTerm={searchTerm} sortOrder={sortOrder} />
    </>
  );
};

export default ItemsHotel;
