import { Box, Container, Flex, Input, Select } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import RestaurantListCustomer from "./RestaurantListCustomer";
import { useNavigate } from "react-router-dom";
import { State } from "../../Context/Provider";

const CustomerMain = () => {
  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem("searchTerm") || ""
  );
  const [filter, setFilter] = useState(localStorage.getItem("filter") || "all");
  const [sortOrder, setSortOrder] = useState(
    localStorage.getItem("sortOrder") || "asc"
  );
  const { isInRestaurantMain, setIsInRestaurantMain } = State();

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    localStorage.setItem("searchTerm", value);
  };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilter(value);
    localStorage.setItem("filter", value);
  };

  const handleSortOrderChange = (event) => {
    const value = event.target.value;
    setSortOrder(value);
    localStorage.setItem("sortOrder", value);
  };

  useEffect(() => {
    localStorage.setItem("searchTerm", searchTerm);
    localStorage.setItem("filter", filter);
    localStorage.setItem("sortOrder", sortOrder);
    setIsInRestaurantMain(true);
  }, [searchTerm, filter, sortOrder]);

  return (
    <>
      <Container maxW="container.lg" mt={10}>
        <Box textAlign="center" mb={6}>
          <Input
            type="text"
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={handleSearch}
            size="lg"
            maxW="400px"
          />
        </Box>
        <Flex justify="space-between" align="center" mb={6}>
          <Select
            placeholder="Filter by..."
            value={filter}
            onChange={handleFilterChange}
            width="150px"
          >
            {/* Add your filter options */}
            <option value="all">All</option>
            <option value="Indian">Indian</option>
            <option value="Mexican">Mexican</option>
            <option value="American">American</option>
            <option value="Chinese">Chinese</option>
          </Select>
          <Select
            placeholder="Sort by..."
            value={sortOrder}
            onChange={handleSortOrderChange}
            width="150px"
          >
            {/* Add your sort options */}
            <option value="asc">Ascending </option>
            <option value="desc">Descending </option>
          </Select>
        </Flex>
      </Container>
      <RestaurantListCustomer
        searchTerm={searchTerm}
        filter={filter}
        sortOrder={sortOrder}
      />
    </>
  );
};

export default CustomerMain;
