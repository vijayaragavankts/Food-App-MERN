import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [cuisine_type, setCuisine_type] = useState("");
  const [rating, setRating] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [show, setShow] = useState(false);
  const [image, setImage] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

  // clearing localStorage
  // localStorage.clear();

  const handleClick = () => {
    setShow(!show);
  };

  const submitHandler = async () => {
    if (
      !name ||
      !email ||
      !location ||
      !cuisine_type ||
      !password ||
      !confirmpassword
    ) {
      return toast({
        title: "Please fill all the required fields",
        duration: 2000,
        status: "warning",
        isClosable: true,
        position: "top",
      });
    }
    if (password !== confirmpassword) {
      return toast({
        title: "Passwords not match",
        duration: 2000,
        status: "warning",
        isClosable: true,
        position: "top",
      });
    }
    try {
      const data = await axios.post(
        "http://localhost:5000/restaurant/register",
        { name, email, location, password, cuisine_type, rating, image }
      );
      console.log(data);
      toast({
        title: "Registered Successfully",
        duration: 2000,
        status: "success",
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("hotelInfo", JSON.stringify(data));
      localStorage.setItem("restaurantId", data.data.id);
      navigate("/restaurantMain");
      return;
    } catch (err) {
      toast({
        title: "Error Occured",
        description: err.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

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

  return (
    <VStack spacing="5px">
      <FormControl id="name" isRequired>
        <FormLabel> Name </FormLabel>{" "}
        <Input
          placeholder="Enter Your Restaurant Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={name}
        ></Input>
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel> Email </FormLabel>
        <Input
          placeholder="Enter Your Restaurant Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
        ></Input>
      </FormControl>
      <FormControl id="location" isRequired>
        <FormLabel> Location </FormLabel>
        <Input
          placeholder="Enter Your Restaurant Loation"
          onChange={(e) => {
            setLocation(e.target.value);
          }}
          value={location}
        ></Input>
      </FormControl>
      <FormControl id="cuisine" isRequired>
        <FormLabel> Cuisine Type </FormLabel>
        <Input
          placeholder="Enter Cuisine Ex. Chinese, Mexican"
          onChange={(e) => {
            setCuisine_type(e.target.value);
          }}
          value={cuisine_type}
        ></Input>
      </FormControl>
      <FormControl id="rating" isRequired>
        <FormLabel> Rating </FormLabel>
        <Input
          placeholder="Enter your Restaurant Rating"
          onChange={(e) => {
            setRating(e.target.value);
          }}
          value={rating}
        ></Input>
      </FormControl>
      <FormControl id="password2" isRequired>
        <FormLabel> Password </FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
          ></Input>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmpassword" isRequired>
        <FormLabel> Confirm Password </FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmpassword(e.target.value)}
            value={confirmpassword}
          ></Input>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic" isRequired>
        <FormLabel>Upload Your Restaurant Image / Logo</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
