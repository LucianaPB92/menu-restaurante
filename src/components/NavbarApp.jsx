import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getUsuario } from "../helpers/apiUsuarios";
import "../css/NavBarApp.css";
import logoDesktop from "../assets/logo-desktop.png";
import logoMobile from "../assets/logo-mobile.png";

const NavBarApp = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  const uid = JSON.parse(localStorage.getItem("uid"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;
    if (uid && token) {
      getUsuario(uid, token)
        .then((response) => {
          if (isMounted) {
            if (response?.usuario) {
              setUserRole(response.usuario.rol);
            } else {
              alert(
                "Tu sesión ha expirado o es inválida. Por favor, inicia sesión nuevamente."
              );
              handleLogout();
            }
          }
        })
        .catch((error) => {
          if (isMounted) {
            if (error.response?.status === 401) {
              alert("No estás autorizado. Tu sesión pudo haber expirado.");
            } else {
              console.error("Error al obtener el rol del usuario:", error);
            }
            handleLogout();
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [uid, token]);

  const handleLogout = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("token");
    setUserRole(null);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-secondary fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src={logoDesktop}
            alt="Logo"
            className="logo d-none d-md-block"
            style={{ height: "50px" }}
          />
          <img
            src={logoMobile}
            alt="Logo"
            className="logo d-block d-md-none"
            style={{ height: "40px" }}
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/" end>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/pedidos">
                Pedidos
              </NavLink>
            </li>
            {(userRole === "ADMIN_ROLE" || userRole === "MOD_ROLE" || userRole === "VENTAS_ROLE") && (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  id="adminDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Administración
                </button>
                <ul className="dropdown-menu" aria-labelledby="adminDropdown">
                  {userRole === "ADMIN_ROLE" && (
                    <li>
                      <NavLink className="dropdown-item" to="/admin/usuarios">
                        Usuarios
                      </NavLink>
                    </li>
                  )}
                  <li>
                    <NavLink className="dropdown-item" to="/admin/productos">
                      Productos
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/admin/pedidos">
                      Pedidos
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}
            <li className="nav-item">
              {token ? (
                <button className="nav-link btn btn-link" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              ) : (
                <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/login">
                  Login
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBarApp;
