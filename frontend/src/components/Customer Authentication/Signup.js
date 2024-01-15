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
import { URL } from "../../App";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  // clearing localStorage
  // localStorage.clear();

  const handleClick = () => {
    setShow(!show);
  };

  const submitHandler = async () => {
    if (!username || !email || !address || !password || !confirmpassword) {
      return toast({
        title: "Please fill all the required fields",
        duration: 4000,
        status: "warning",
        isClosable: true,
        position: "top",
      });
    }
    if (password !== confirmpassword) {
      return toast({
        title: "Passwords not match",
        duration: 4000,
        status: "warning",
        isClosable: true,
        position: "top",
      });
    }
    try {
      const data = await axios.post(`${URL}/customer/register`, {
        username,
        email,
        address,
        password,
      });
      console.log(data);
      toast({
        title: "Registered Successfully",
        duration: 4000,
        status: "success",
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("customerId", data.data.id);
      navigate("/customerMain");
      return;
    } catch (err) {
      toast({
        title: "Error Occured",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
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
          placeholder="Enter Your Name"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          value={username}
        ></Input>
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel> Email </FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
        ></Input>
      </FormControl>
      <FormControl id="address" isRequired>
        <FormLabel> Address </FormLabel>
        <Input
          placeholder="Enter Your Address"
          onChange={(e) => {
            setAddress(e.target.value);
          }}
          value={address}
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

      <Button
        colorScheme="purple"
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
