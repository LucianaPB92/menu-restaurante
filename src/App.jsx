import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoutesTwo from "./routes/RoutesTwo";
import LoginScreen from "./views/LoginScreen";
import NavBarApp from "./components/NavbarApp";
import PedidoDetalle from "./views/DetallePedidoScreen";

function App() {
  return (
    <BrowserRouter>
      <div className="w-100">
        <NavBarApp />
        <Routes>
          <Route path="/*" element={<RoutesTwo />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/pedidos/:id" element={<PedidoDetalle/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

