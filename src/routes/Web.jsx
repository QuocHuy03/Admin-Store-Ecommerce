import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import ListCategory from "../pages/categories/List";
import ListProduct from "../pages/products/List";
import EditCategory from "../pages/categories/Edit";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import { useDispatch, useSelector } from "react-redux";
import store from "../redux/store";
import { loginSuccess } from "../redux/authSlide/authSilde";

export default function Web() {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  // const persistedState = store.getState();

  useEffect(() => {
    if (!isLoggedIn) navigate("/auth");
    else navigate("/");
  }, [isLoggedIn]);

  return (
    <div>
      {isLoggedIn ? (
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/categories" element={<ListCategory />} />
          <Route path="/categories/edit/:slug" element={<EditCategory />} />
          <Route path="/products" element={<ListProduct />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/auth" element={<Login />} exact />
          <Route path="/auth/register" element={<Register />} exact />
        </Routes>
      )}
    </div>
  );
}
