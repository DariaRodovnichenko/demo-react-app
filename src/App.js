// src/App.js
import React from "react";
import { ProductStorage } from "./ProductStorage";
import { WeatherApp } from "./Weather";
import { Link, Route, Routes } from "react-router-dom";
import { Customer } from "./Customer";

export const App = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Weather</Link>
          </li>
          <li>
            <Link to="/shopping">Shopping Cart</Link>
          </li>
          <li>
            <Link to="/customers">Customers</Link>
          </li>
        </ul>
      </nav>
      <div>
        <Routes>
          <Route path="/" element={<WeatherApp />} />
          <Route path="/shopping" element={<ProductStorage />} />
          <Route path="/customers" element={<Customer />} />
        </Routes>
      </div>
    </>
  );
};
