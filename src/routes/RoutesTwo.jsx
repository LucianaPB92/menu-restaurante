import React from 'react'
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from './ProtectedRoutes';
import HomeScreen from '../views/HomeScreen'
import NavBarApp from '../components/NavbarApp';
import AdminScreen from '../views/AdminScreen';
const RoutesTwo = () => {
  return (
    <div>
        <NavBarApp />
        <Routes>
          <Route path="/" element={<HomeScreen/>}/>
          <Route
          path="/admin"
          element={
            <ProtectedRoutes>
              <AdminScreen />
            </ProtectedRoutes>
          }
        />
        </Routes>
    </div>
  )
}

export default RoutesTwo