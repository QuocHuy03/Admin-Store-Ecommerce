import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import ListCategory from "./pages/categories/List";
import ListProduct from "./pages/products/List";
import ListOrder from "./pages/orders/List";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import AddProduct from "./pages/products/Add";
import EditProduct from "./pages/products/Edit";
import ListUser from "./pages/users/List";

function App() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        navigate("/");
      } else {
        navigate("/auth");
      }
    } else {
      navigate("/auth");
    }
  }, [user]);

  return (
    <>
      <Routes>
        {user && user.role === "ADMIN" ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<ListCategory />} />
            <Route path="/products" element={<ListProduct />} />
            <Route path="/product/add" element={<AddProduct />} />
            <Route path="/product/edit/:slug" element={<EditProduct />} />
            <Route path="/orders" element={<ListOrder />} />
            <Route path="/users" element={<ListUser />} />
            <Route path="*" element={<NotFound />} />
          </>
        ) : (
          <>
            <Route path="/auth" element={<Login />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
