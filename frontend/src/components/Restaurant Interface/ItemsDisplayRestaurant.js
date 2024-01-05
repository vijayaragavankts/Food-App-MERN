import React, { useEffect, useState } from "react";
import "../../../src/App.css";
import axios from "axios";
import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { State } from "../../Context/Provider";
import { useNavigate } from "react-router-dom";

const ItemsDisplayRestaurant = ({ searchTerm, sortOrder }) => {
  const { hotel, restaurantId, setRestaurantId, isInRestaurantMain } = State();
  const [itemDetail, setItemDetail] = useState([]);
  const [newHotel, setNewHotel] = useState();
  const [selectedItem, setSelectedItem] = useState(null);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!localStorage.getItem("restaurantId")) {
      navigate("/");
    }
    const storedHotel = JSON.parse(localStorage.getItem("hotelInfo"));
    setNewHotel(storedHotel);
  }, []);

  const fetchAllItems = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${newHotel.data.token}`,
        },
      };
      const id = localStorage.getItem("restaurantId");
      console.log(id);
      const { data } = await axios.get(
        `http://localhost:5000/showItemsToRestaurant/${id}`,
        config
      );
      console.log(data.data);
      setItemDetail(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredAndSortedItems = itemDetail
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    .sort((a, b) => {
      const compareResult =
        sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      return compareResult;
    });

  useEffect(() => {
    fetchAllItems();
  }, [searchTerm, sortOrder, hotel, navigate, newHotel]);

  // Logic for modal , edit and delete

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [localImage, setLocalImage] = useState("");
  const [temp, setTemp] = useState(false);

  useEffect(() => {
    // Set initial values when selectedItem changes
    if (selectedItem) {
      setName(name || selectedItem.name);
      setPrice(price || selectedItem.price);
      setDescription(description || selectedItem.description);
      if (temp) {
        setLocalImage(selectedItem.image || "");
        setTemp(false);
      } else {
        setLocalImage(image);
      }
    }
  }, [selectedItem, image]);

  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => {
    setIsOpen(true);
    setTemp(true);
    setImage("");
  };
  const onClose = () => {
    setIsOpen(false);
    setTemp(false);
    setName("");
    setPrice("");
    setDescription("");
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    onOpen();
  };

  const handleDelete = async (itemId) => {
    if (!itemId) {
      return toast({
        title: "Cant able to Delete! Try Again",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${newHotel.data.token}`,
        },
      };

      const data = await axios.delete(
        `http://localhost:5000/deleteItem/${itemId}/delete`,
        config
      );
      if (data) {
        toast({
          title: "Item Deleted Successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
        fetchAllItems();
      }
    } catch (err) {}
  };

  const postDetails = (pics) => {
    if (pics === undefined) {
      return toast({
        title: "Please select an Image",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "food-app");
      data.append("cloud_name", "vijayaragavan");
      fetch("https://api.cloudinary.com/v1_1/vijayaragavan/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setImage(data.url.toString());

          toast({
            title: "Image Uploaded Successfully",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "bottom",
          });
          console.log(image);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return toast({
        title: "Please select an Image",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name || !price || !description) {
      return toast({
        title: "Fill all the fields",
        status: "warning",
        duration: 2000,
        isClosable: true,

        position: "bottom",
      });
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${newHotel.data.token}`,
        },
      };
      const id = localStorage.getItem("restaurantId");
      const itemId = selectedItem._id;
      console.log(itemId);
      const data = await axios.put(
        `http://localhost:5000/getItemsfromRestaurant/`,
        {
          name,
          price,
          description,
          image,
          itemId,
        },
        config
      );
      console.log(data);
      if (data) {
        setIsOpen(false);
        fetchAllItems();
      }
      toast({
        title: "Updated Successfully",
        status: "success",
        duration: 1500,
        isClosable: true,

        position: "bottom",
      });
    } catch (err) {
      console.log(err);
      return toast({
        title: "Error Occurred in Update Modal",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <Flex justify="center" wrap="wrap">
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
            <Image
              src={
                item.image
                  ? item.image
                  : "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600"
              }
              alt={item.name}
            />
            <Box p={4}>
              <Text fontSize="5xl" fontWeight="bold" fontFamily="Long Cang">
                {item.name}
              </Text>
              <Text fontSize="3xl" color="gray.600">
                {`$${item.price}`}
              </Text>
              <Text fontSize="md" color="gray.600">
                {item.description}
              </Text>
              <Flex justify="space-around" align="center" mb={3} mt={3}>
                <EditIcon
                  fontSize="2xl"
                  color="green"
                  cursor="pointer"
                  onClick={() => handleEdit(item)}
                />
                <DeleteIcon
                  fontSize="2xl"
                  color="red"
                  cursor="pointer"
                  onClick={() => handleDelete(item._id)}
                />
              </Flex>
            </Box>
          </Box>
        ))}
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Items</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <FormControl isRequired>
                <FormLabel>Name of Item</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter Name of Item"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Price</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter Price of Item"
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Description</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter Description for Item"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
              </FormControl>

              <FormControl id="pic" mt={4}>
                <FormLabel>Upload Item Image</FormLabel>
                <Box mb={4}>
                  <Image
                    src={localImage}
                    alt="Selected Item"
                    borderRadius="lg"
                  />
                </Box>
                <Input
                  type="file"
                  p={1.5}
                  accept="image/*"
                  onChange={(e) => postDetails(e.target.files[0])}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                mt={4}
                onClick={handleUpdate}
              >
                Update
              </Button>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ItemsDisplayRestaurant;
