import { createContext, useContext, useEffect, useState } from "react";

const Context = createContext();

const Provider = ({ children }) => {
  const [user, setUser] = useState();
  const [hotel, setHotel] = useState();
  const [isInRestaurantMain, setIsInRestaurantMain] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
  }, []);
  useEffect(() => {
    const hotelInfo = JSON.parse(localStorage.getItem("hotelInfo"));
    setHotel(hotelInfo);
  }, []);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        hotel,
        setHotel,
        isInRestaurantMain,
        setIsInRestaurantMain,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const State = () => {
  return useContext(Context);
};

export default Provider;
