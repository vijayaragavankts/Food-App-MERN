import { Box, Button, ButtonGroup, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../image/pic2.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const quotesData = [
  {
    quote: "People who love to eat are always the best people.",
    author: "Julia Child",
  },
  {
    quote: "The only thing I like better than talking about food is eating",
    author: "John Walters",
  },
  {
    quote: "Life is uncertain. Eat dessert first.",
    author: "Ernestine Ulmer",
  },
  {
    quote: "Food is symbolic of love when words are inadequate.",
    author: "Alan D. Wolfelt",
  },
  {
    quote: "People who love to eat are always the best people.",
    author: "Julia Child",
  },
  {
    quote: "Good food ends with good talk.",
    author: "Geoffrey Neighor",
  },
  {
    quote:
      "One cannot think well, love well, sleep well if one has not dined well.",
    author: "Virginia Woolf",
  },
  {
    quote:
      "The only time to eat diet food is while you're waiting for the steak to cook.",
    author: "Julia Child",
  },
  {
    quote: "Tell me what you eat, and I will tell you what you are.",
    author: "Anthelme Brillat-Savarin",
  },
  {
    quote: "There is no sincerer love than the love of food.",
    author: "George Bernard Shaw",
  },
  {
    quote:
      "Cooking is like love. It should be entered into with abandon or not at all.",
    author: "Harriet Van Horne",
  },
  {
    quote: "People who love to eat are always the best people.",
    author: "Julia Child",
  },
  // Add more quotes as needed
];

const Home = () => {
  const navigate = useNavigate();
  const navigateToRestaurant = () => {
    navigate("/restaurant");
  };
  const navigateToCustomer = () => {
    navigate("/customer");
  };
  const backgroundImageStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    // height: "50vh", // Adjust the height as needed
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000, // Adjust the duration for each quote
  };

  return (
    <div style={backgroundImageStyle}>
      <Text
        bg={"white"}
        bgClip="text"
        fontSize={{ base: "7xl", sm: "7xl", md: "8xl", lg: "9xl" }}
        fontWeight="extrabold"
      >
        BiteBurst
      </Text>
      <Stack
        spacing={4}
        direction="row"
        align="center"
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        padding={{ base: 4, sm: 6, md: 8, lg: 10 }} // Adjust padding based on screen size
      >
        <ButtonGroup
          display="flex"
          flexDirection={{
            base: "column",
            sm: "column",
            md: "row",
            lg: "row",
          }}
          alignItems="center"
          justifyContent="center"
          height="50vh"
          gap={{ base: 50, sm: 100, md: 250, lg: 430 }}
          marginBottom="0"
        >
          <Button
            textColor="black"
            height={{ base: 50, sm: "70px", md: 100, lg: 110 }}
            width={{ base: 280, sm: 300, md: 200, lg: 280 }}
            fontSize={{ base: 18, sm: 20, md: 24, lg: 30 }}
            onClick={navigateToRestaurant}
          >
            Restaurants
          </Button>
          <Button
            textColor="black"
            height={{ base: 50, sm: "70px", md: 100, lg: 110 }}
            width={{ base: "100%", sm: 300, md: 200, lg: 280 }}
            fontSize={{ base: 18, sm: 20, md: 24, lg: 30 }}
            onClick={navigateToCustomer}
          >
            Customers
          </Button>
        </ButtonGroup>
      </Stack>
      <Box
        position="fixed"
        bottom="0"
        left="0"
        width="100%"
        // backgroundColor="rgba(0, 0, 0, 0.8)"
        // padding="1rem"
        textAlign="center"
      >
        <Slider {...settings}>
          {quotesData.map((quote, index) => (
            <Box key={index} backgroundColor="white" padding="2em">
              <Text fontSize="3xl" color="black">
                "{quote.quote}"
              </Text>
              <Text
                fontSize="xl"
                color="gray.400"
                marginTop="0.5rem"
                fontStyle="italic"
              >
                - {quote.author}
              </Text>
            </Box>
          ))}
        </Slider>
      </Box>
    </div>
  );
};

export default Home;
