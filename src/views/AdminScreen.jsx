import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getUsuario } from "../helpers/apiUsuarios";
import RegisterModal from "../components/ModalRegisterApp";

export const AdminScreen = () => {
  const [user, setUser] = useState(null);
  const uid = JSON.parse(localStorage.getItem("uid")) || null;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    validar();
  }, [uid]);
  const validar = () => {
    getUsuario(uid).then((response) => {
      setUser(response.usuario);
      setLoading(false);
    });
  };
  return (
    <>
      {loading ? (
        <h3>Cargando...</h3>
      ) : user.rol === "ADMIN_ROLE" ? (
        <div>
          <h1>Gestión de Usuarios</h1>
          <button
            type="button"
            className="btn btn-primary mt-3"
            data-bs-toggle="modal"
            data-bs-target="#modRegisterModal"
          >
            Registrar Nuevo moderador
          </button>

          
          <RegisterModal id="modRegisterModal" defaultRole="MOD_ROLE" />
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default AdminScreen;