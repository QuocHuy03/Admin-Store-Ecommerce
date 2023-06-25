import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";

export default function Web() {
  return (
    <Routes>
      <Route path="/" exact element={<Home />} />
      {/* <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
