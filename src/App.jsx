import { Route, Routes } from "react-router-dom";
import Web from "./routes/Web";

function App() {
  return (
    <Routes>
      <Route path="*" element={<Web />} />
    </Routes>
  );
}

export default App;
