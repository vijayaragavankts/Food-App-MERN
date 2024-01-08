import React from "react";
import { useParams } from "react-router-dom";

const OrderCustomer = () => {
  const { id } = useParams();
  console.log(id);

  return <>Hello World</>;
};

export default OrderCustomer;
