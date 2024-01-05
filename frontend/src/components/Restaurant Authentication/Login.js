import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { State } from "../../Context/Provider";

const Login = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  // // clearing localStorage
  // localStorage.clear();

  const handleClick = () => {
    setShow(!show);
  };

  const submitHandler = async () => {
    if (!name || !password) {
      return toast({
        title: "Please fill all the fields",
        duration: 200,
        status: "warning",
        isClosable: true,
        position: "top",
      });
    }
    try {
      const data = await axios.post("http://localhost:5000/restaurant/login", {
        name,
        password,
      });
      console.log(data);
      toast({
        title: "Login Successful",
        duration: 1500,
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
        title: "Error Occured!",
        description: err.response.data.message,
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="restaurant" isRequired>
        <FormLabel> Restaurant </FormLabel>
        <Input
          placeholder="Enter Your Restaurant Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={name}
        ></Input>
      </FormControl>
      <FormControl id="password" isRequired>
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
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Login
      </Button>
    </VStack>
  );
};

export default Login;
