import { useState } from "react";
import { Link } from "react-router-dom";

export const Customer = () => {
  const [customers] = useState([{ id: 1 }, { id: 2 }]);

  return (
    <ul>
      {customers.map((customer) => (
        <li key={customer.id}>
          <Link to={`/customers/${customer.id}`}>Customer {customer.id}</Link>
        </li>
      ))}
    </ul>
  );
};
