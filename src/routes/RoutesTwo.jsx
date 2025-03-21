import React from 'react'
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import HomeScreen from '../views/HomeScreen'
import AdminUserScreen from '../views/AdminUserScreen.jsx';
import AdminProductoScreen from '../views/AdminProductoScreen.jsx';
import AdminPedidoScreen from '../views/AdminPedidoScreen.jsx';
const RoutesTwo = () => {
  return (
    <div>
        <Routes>
          <Route path="/" element={<HomeScreen/>}/>
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
            <ProtectedRoutes rolesPermitidos={["ADMIN_ROLE", "MOD_ROLE", "VENTAS_ROLE"]}>
              <AdminProductoScreen />
            </ProtectedRoutes>
          }
        />
         <Route
          path="/admin/pedidos"
          element={
            <ProtectedRoutes rolesPermitidos={["ADMIN_ROLE", "VENTAS_ROLE", "MOD_ROLE"]}>
              <AdminPedidoScreen />
            </ProtectedRoutes>
          }
        />
        </Routes>
        
    </div>
  )
}

export default RoutesTwo