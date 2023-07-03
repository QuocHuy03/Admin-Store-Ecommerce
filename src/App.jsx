import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import ListCategory from "./pages/categories/List";
import ListProduct from "./pages/products/List";
import ListOrder from "./pages/Order";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { message } from "antd";

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
            <Route path="/orders" element={<ListOrder />} />
            <Route path="*" element={<NotFound />} />
          </>
        ) : (
          <>
            <Route path="/auth" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
          </>
        )}
       
      </Routes>
    </>
  );
}

export default App;
