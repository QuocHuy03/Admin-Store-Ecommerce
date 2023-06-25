import { Route, Routes } from "react-router-dom";
import Web from "./routes/web";

function App() {
  return (
    <Routes>
      <Route path="*" element={<Web />} />
    </Routes>
  );
}

export default App;
