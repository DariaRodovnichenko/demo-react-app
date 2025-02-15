import { useParams } from "react-router-dom";

export const CustomerInfo = () => {
  const { id } = useParams();

  return <div>Customer ID: {id}</div>;
};
