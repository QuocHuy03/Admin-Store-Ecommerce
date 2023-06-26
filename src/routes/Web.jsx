import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import ListCategory from "../pages/categories/List";
import ListProduct from "../pages/products/List";
import EditCategory from "../pages/categories/Edit"

export default function Web() {
  return (
    <Routes>
      <Route path="/" exact element={<Home />} />
      <Route path="/categories" element={<ListCategory />} />
      <Route path="/categories/edit/:slug" element={<EditCategory />} />
      <Route path="/products" element={<ListProduct />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
