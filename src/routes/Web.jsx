import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import List from "../pages/categories/List";

export default function Web() {
  return (
    <Routes>
      <Route path="/" exact element={<Home />} />
      <Route path="/categories" element={<List />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
