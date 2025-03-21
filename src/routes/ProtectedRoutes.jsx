import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUsuario } from "../helpers/apiUsuarios";
const ProtectedRoutes = ({ children, rolesPermitidos }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const token = JSON.parse(localStorage.getItem("token")) || null;
  const uid = JSON.parse(localStorage.getItem("uid")) || null;
  useEffect(() => {
    if (token && uid) {
      getUsuario(uid)
        .then((response) => {
          if (
            response?.usuario &&
            rolesPermitidos.includes(response.usuario.rol)
          ) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        })
        .catch((error) => {
          console.error("Error al obtener usuario:", error);
        });
    } else {
      setIsAuthorized(false);
    }
  }, [token, uid, rolesPermitidos]);

  if (isAuthorized === null) return null;
  return isAuthorized ? children : <Navigate to="/" />;
 
};

export default ProtectedRoutes;