import {
  Box,
  Button,
  Container,
  Flex,
  Icon,
  Input,
  Select,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ItemsDisplayRestaurant from "./ItemsDisplayRestaurant";
import { useNavigate } from "react-router-dom";
import { AddIcon } from "@chakra-ui/icons";

const RestaurantMain = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("restaurantId")) {
      navigate("/");
    }
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const handleCreate = () => {
    navigate("/create");
  };

  // const handleFilterChange = (event) => {
  //   const value = event.target.value;
  //   setFilter(value);
  // };

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
            placeholder="Search items..."
            value={searchTerm}
            onChange={handleSearch}
            size="lg"
            maxW="400px"
          />
        </Box>
        <Flex justify="space-between" align="center" mb={6}>
          {/* <Select
            placeholder="Filter by..."
            value={filter}
            onChange={handleFilterChange}
            width="150px"
          >
            {/* Add your filter options */}
          {/* <option value="all">All</option>
            <option value="Indian">Indian</option>
            <option value="Mexican">Mexican</option>
            <option value="American">American</option>
            <option value="Chinese">Chinese</option> */}
          {/* </Select> */}
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
          <Button colorScheme="green" onClick={handleCreate}>
            <Icon as={AddIcon} /> &nbsp; Create New Item
          </Button>
        </Flex>
      </Container>
      <ItemsDisplayRestaurant searchTerm={searchTerm} sortOrder={sortOrder} />
    </>
  );
};

export default RestaurantMain;
