import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import HomeScreen from "../views/HomeScreen";
import AdminUserScreen from "../views/AdminUserScreen.jsx";
import AdminProductoScreen from "../views/AdminProductoScreen.jsx";
import AdminPedidoScreen from "../views/AdminPedidoScreen.jsx";
import PedidoDetalle from "../views/DetallePedidoScreen.jsx";
import CarritoScreen from "../views/CarritoScreen";

const RoutesTwo = ({ carrito, setCarrito }) => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<HomeScreen carrito={carrito} setCarrito={setCarrito} />}
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoutes rolesPermitidos={["ADMIN_ROLE"]}>
              <AdminUserScreen />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/admin/productos"
          element={
            <ProtectedRoutes
              rolesPermitidos={["ADMIN_ROLE", "MOD_ROLE", "VENTAS_ROLE"]}
            >
              <AdminProductoScreen />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/admin/pedidos"
          element={
            <ProtectedRoutes
              rolesPermitidos={["ADMIN_ROLE", "VENTAS_ROLE", "MOD_ROLE"]}
            >
              <AdminPedidoScreen />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/pedidos"
          element={
            <ProtectedRoutes
              rolesPermitidos={
                ["USER_ROLE", "ADMIN_ROLE", "VENTAS_ROLE", "MOD_ROLE"]
              }
            >
              <CarritoScreen carrito={carrito} setCarrito={setCarrito} />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/pedidos/:id"
          element={
            <ProtectedRoutes
              rolesPermitidos={
                ["USER_ROLE", "ADMIN_ROLE", "VENTAS_ROLE", "MOD_ROLE"]
              }
            >
              <PedidoDetalle />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </div>
  );
};

export default RoutesTwo;
