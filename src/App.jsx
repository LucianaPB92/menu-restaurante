import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoutesTwo from "./routes/RoutesTwo";
import LoginScreen from "./views/LoginScreen";

function App() {
  return (
    <BrowserRouter>
      <div className="w-100">
        <Routes>
          <Route path="/*" element={<RoutesTwo />} />
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
