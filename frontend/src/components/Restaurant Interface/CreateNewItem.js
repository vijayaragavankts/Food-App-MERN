import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { State } from "../../Context/Provider";
import { useNavigate } from "react-router-dom";
import { URL } from "../../App";

const CreateNewItem = () => {
  const { hotel } = State();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Main Courses");
  const [image, setImage] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("restaurantId")) {
      navigate("/");
    }
  }, []);

  const postDetails = async (pics) => {
    try {
      if (pics === undefined) {
        throw new Error("Please select an Image");
      }

      if (pics.type !== "image/jpeg" && pics.type !== "image/png") {
        throw new Error("Please select a valid Image");
      }

      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "food-app");
      data.append("cloud_name", "vijayaragavan");

      const toastId = toast({
        title: "Uploading Image...",
        status: "info",
        duration: null,
        isClosable: false,
        position: "bottom",
      });

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/vijayaragavan/image/upload",
        {
          method: "post",
          body: data,
        }
      );

      const imageData = await response.json();

      toast.update(toastId, {
        title: "Image Uploaded Successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      setImage(imageData.url.toString());
    } catch (err) {
      console.error(err);

      toast({
        title: "Image Upload Failed",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const submitHandler = async () => {
    if (!name || !price || !description || !category || !image) {
      return toast({
        title: "Please fill all the required fields",
        duration: 2000,
        status: "warning",
        isClosable: true,
        position: "right bottom",
      });
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${hotel.data.token}`,
        },
      };
      const restaurant = localStorage.getItem("restaurantId");
      const data = await axios.post(
        `${URL}/getItemsfromRestaurant`,
        { name, price, description, category, image, restaurant },
        config
      );
      console.log(data);
      toast({
        title: "Item Sent to DB Successfully",
        duration: 2000,
        status: "success",
        isClosable: true,
        position: "top",
      });
      navigate("/restaurantMain");
      return;
    } catch (err) {
      console.error("Error in submitHandler:", err); // Add this line for logging
      toast({
        title: "Error Occured",
        description: err.response ? err.response.data.message : "Unknown error",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <Container maxW="xl">
        <VStack spacing="5px">
          <Text fontSize="4xl" marginBottom={5}>
            Create New Item
          </Text>
          <FormControl id="name" isRequired>
            <FormLabel> Item Name </FormLabel>{" "}
            <Input
              placeholder="Ex. Parota"
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
            ></Input>
          </FormControl>
          <FormControl id="description" isRequired>
            <FormLabel> Item Description </FormLabel>
            <Input
              placeholder="Enter Description about the Item"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              value={description}
            ></Input>
          </FormControl>
          <FormControl id="price" isRequired>
            <FormLabel> Item Price </FormLabel>
            <Input
              placeholder="Enter Price of Item"
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              value={price}
            ></Input>
          </FormControl>
          <FormControl id="category" isRequired>
            <FormLabel> Item Category </FormLabel>
            <Select
              placeholder="Select Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Starters">Appetizers/Starters</option>
              <option value="Main Courses">Main Courses</option>
              <option value="Sides">Sides</option>
              <option value="Dessert">Desserts</option>
              <option value="Beverage">Beverages</option>
            </Select>
          </FormControl>
          <FormControl id="image" isRequired>
            <FormLabel>Upload Item Image </FormLabel>
            <Input
              type="file"
              p={1.5}
              accept="image/*"
              onChange={(e) => postDetails(e.target.files[0])}
            ></Input>
          </FormControl>

          <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
          >
            Save
          </Button>
        </VStack>
      </Container>
    </>
  );
};

export default CreateNewItem;
