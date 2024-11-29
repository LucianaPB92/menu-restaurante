import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {
  getUsuario,
  getUsuarios,
  inactivarUsuario,
} from "../helpers/apiUsuarios";

import RegisterModal from "../components/ModalRegisterApp";

export const AdminScreen = () => {
  const [user, setUser] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const usuariosPorPagina = 5; // Cantidad de usuarios por página
  const uid = JSON.parse(localStorage.getItem("uid")) || null;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    validar();
  }, [uid]);

  useEffect(() => {
    validar();
    if (user?.rol === "ADMIN_ROLE") {
      obtenerUsuarios(); // Obtener los usuarios si el rol es admin
    }
  }, [uid, user?.rol]);

  const validar = () => {
    getUsuario(uid).then((response) => {
      setUser(response.usuario);
      setLoading(false);
    });
  };

  const obtenerUsuarios = () => {
    getUsuarios().then((response) => {
      setUsuarios(response.usuarios); // Asumimos que la respuesta tiene un campo 'usuarios'
    });
  };

  const handleInactivarUsuario = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas inactivar este usuario?"
    );
    if (confirmar) {
      try {
        const usuarioActualizado = await inactivarUsuario(id);

        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((usuario) =>
            usuario._id === usuarioActualizado._id
              ? usuarioActualizado
              : usuario
          )
        );

        alert("Usuario inactivado correctamente");
      } catch (error) {
        alert("Hubo un problema al inactivar el usuario: " + error.message);
      }
    }
  };
  // Filtrar usuarios según búsqueda y rol
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincideTermino =
      usuario.email.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      usuario.rol.toLowerCase().includes(terminoBusqueda.toLowerCase()); // Filtrar por rol también

    return coincideTermino;
  });

  // Paginación basada en usuarios filtrados
  const indiceUltimoUsuario = paginaActual * usuariosPorPagina;
  const indicePrimerUsuario = indiceUltimoUsuario - usuariosPorPagina;
  const usuariosAMostrar = usuariosFiltrados.slice(
    indicePrimerUsuario,
    indiceUltimoUsuario
  );
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };
  return (
    <>
      {loading ? (
        <h3>Cargando...</h3>
      ) : (user.rol === "ADMIN_ROLE" || user.rol === "MOD_ROLE" || user.rol === "VENTAS_ROLE") ? (
        <div className="container mt-4 px-3">
          <h1>Gestión de Usuarios</h1>
          <button
            type="button"
            className="btn btn-primary mt-3"
            data-bs-toggle="modal"
            data-bs-target="#modRegisterModal"
            disabled={user?.rol !== "ADMIN_ROLE"}
          >
            Registrar Nuevo moderador
          </button>

          {/* Modal para registrar usuarios como ADMIN_ROLE */}
          <RegisterModal id="modRegisterModal" defaultRole="MOD_ROLE" />

          {/* Buscador y filtro */}
          <div className="row mb-3">
            <div className="col-12 col-md-6 mb-3 mb-md-0">
              <div className="d-flex justify-content-end">
                {/* Campo de búsqueda para email y rol */}
                <input
                  type="text"
                  className="form-control me-3"
                  placeholder="Buscar por email o rol..."
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* Tabla para mostrar los usuarios */}
          <table className="table mt-4">
            <thead>
              <tr>
                <th scope="col">Email</th>
                <th scope="col">Rol</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody>
              {usuariosAMostrar.length > 0 ? (
                usuariosAMostrar.map((usuario) => (
                  <tr key={usuario._id}>
                    <td>{usuario.email}</td>
                    <td>{usuario.rol}</td>
                    <td>{usuario.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                      <button
                        className={`btn ${
                          usuario.estado ? "btn-danger" : "btn-secondary"
                        }`}
                        disabled={user?.rol !== "ADMIN_ROLE" || !usuario.estado}
                        onClick={() => handleInactivarUsuario(usuario._id)}
                      >
                        {usuario.estado ? "Inactivar" : "Reactivar"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    <strong>No se encontró el email o rol solicitado</strong>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-primary"
              onClick={paginaAnterior}
              disabled={paginaActual === 1}
            >
              Anterior
            </button>
            <span>
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              className="btn btn-primary"
              onClick={paginaSiguiente}
              disabled={paginaActual === totalPaginas}
            >
              Siguiente
            </button>
          </div>
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default AdminScreen;