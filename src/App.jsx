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

function App() {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  // const persistedState = store.getState();
  // console.log(persistedState)

  useEffect(() => {
    if (!isLoggedIn) navigate("/auth");
    else navigate("/");
  }, [isLoggedIn]);
  return (
    <>
      {isLoggedIn ? (
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/categories" element={<ListCategory />} />
          <Route path="/products" element={<ListProduct />} />
          <Route path="/orders" element={<ListOrder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/auth" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
        </Routes>
      )}
    </>
  );
}

export default App;
