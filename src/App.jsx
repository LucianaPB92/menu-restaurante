import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoutesTwo from "./routes/RoutesTwo";
import LoginScreen from "./views/LoginScreen";
import NavBarApp from "./components/NavbarApp";
import PedidoDetalle from "./views/DetallePedidoScreen";
import CarritoScreen from "./views/CarritoScreen";
import { useState } from "react";

function App() {
  // Estado para el carrito, para compartirlo entre componentes
  const [carrito, setCarrito] = useState([]);

  return (
    <BrowserRouter>
      <div className="w-100">
        <NavBarApp />

        <Routes>
          <Route
            path="/*"
            element={<RoutesTwo carrito={carrito} setCarrito={setCarrito} />}
          />
          <Route
            path="/login"
            element={<LoginScreen />}
          />
          <Route
            path="/pedidos"
            element={<CarritoScreen carrito={carrito} setCarrito={setCarrito} />}
          />
          <Route
            path="/pedidos/:id"
            element={<PedidoDetalle />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
