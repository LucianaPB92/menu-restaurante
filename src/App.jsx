import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoutesTwo from "./routes/RoutesTwo";
import LoginScreen from "./views/LoginScreen";
import NavBarApp from "./components/NavbarApp";
import PedidoDetalle from "./views/DetallePedidoScreen";

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
       
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
