import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {
  getUsuario,
  getUsuarios,
  inactivarUsuario,
  reactivarUsuario,
} from "../helpers/apiUsuarios";
import Pagination from "../components/PaginationApp";
import RegisterModal from "../components/ModalRegisterApp";
import { useCallback } from "react";
const AdminUserScreen = () => {
  const [user, setUser] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosPaginados, setUsuariosPaginados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const usuariosPorPagina = 5;
  const uid = JSON.parse(localStorage.getItem("uid")) || null;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    validar();
  }, [uid]);

  useEffect(() => {
    validar();
    if (user?.rol === "ADMIN_ROLE") {
      obtenerUsuarios();
    }
  }, [user?.rol]);

  const validar = () => {
    getUsuario(uid).then((response) => {
      setUser((prevUser) => {
        if (JSON.stringify(prevUser) !== JSON.stringify(response.usuario)) {
          return response.usuario;
        }
        return prevUser;
      });
      setLoading(false);
    });
  };
  const handleBusqueda = (e) => {
    setTerminoBusqueda(e.target.value);
    setPaginaActual(1);
  };

  const actualizarUsuariosPaginados = useCallback((nuevosUsuarios) => {
    setUsuariosPaginados(nuevosUsuarios);
  }, []);
  const obtenerUsuarios = () => {
    getUsuarios().then((response) => {
      setUsuarios(response.usuarios);
    });
  };

  const handleInactivarUsuario = async (id) => {
    console.log("UID a inactivar:", id);
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas inactivar este usuario?"
    );
    if (confirmar) {
      try {
        const usuarioActualizado = await inactivarUsuario(id);
        console.log("Respuesta de inactivarUsuario:", usuarioActualizado);
        if (!usuarioActualizado || !usuarioActualizado._id) {
          throw new Error("Respuesta inválida del servidor");
        }

        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((usuario) =>
            usuario._id === usuarioActualizado._id
              ? usuarioActualizado
              : usuario
          )
        );

        alert("Usuario inactivado correctamente");
      } catch (error) {
        console.error("Error al inactivar usuario:", error);
        alert("Hubo un problema al inactivar el usuario: " + error.message);
      }
    }
  };
  // Filtrar usuarios según búsqueda y rol
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincideTermino =
      usuario.email.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      usuario.rol.toLowerCase().includes(terminoBusqueda.toLowerCase());

    return coincideTermino;
  });

  const handleReactivarUsuario = async (id) => {
    try {
      const usuarioActualizado = await reactivarUsuario(id);
      console.log(
        "Usuario actualizado recibido en el componente:",
        usuarioActualizado
      );
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario._id === usuarioActualizado._id ? usuarioActualizado : usuario
        )
      );
      alert("Usuario reactivado correctamente");
    } catch (error) {
      alert("Error al reactivar el usuario: " + error.message);
    }
  };

  return (
    <>
      {loading ? (
        <h3>Cargando...</h3>
      ) : user?.rol === "ADMIN_ROLE" ||
        user?.rol === "MOD_ROLE" ||
        user?.rol === "VENTAS_ROLE" ? (
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
                <input
                  type="text"
                  className="form-control me-3"
                  placeholder="Buscar por email o rol..."
                  value={terminoBusqueda}
                  onChange={handleBusqueda}
                />
              </div>
            </div>
          </div>
          <table className="table mt-4">
            <thead>
              <tr>
                <th scope="col">Email</th>
                <th scope="col">Rol</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPaginados.length > 0 ? (
                usuariosPaginados.map((usuario) => (
                  <tr key={usuario._id}>
                    <td>{usuario.email}</td>
                    <td>{usuario.rol}</td>
                    <td>{usuario.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                      {usuario.estado ? (
                        <button
                          className="btn btn-danger"
                          onClick={() => handleInactivarUsuario(usuario._id)}
                        >
                          Inactivar
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleReactivarUsuario(usuario._id)}
                        >
                          Reactivar
                        </button>
                      )}
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
          <Pagination
            items={usuariosFiltrados}
            itemsPerPage={usuariosPorPagina}
            currentPage={paginaActual}
            setCurrentPage={setPaginaActual}
            setPaginatedItems={actualizarUsuariosPaginados}
          />
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default AdminUserScreen;
