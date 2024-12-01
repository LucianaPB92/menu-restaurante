import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getUsuario } from "../helpers/apiUsuarios";
import "../css/NavBarApp.css";
const NavBarApp = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  const uid = JSON.parse(localStorage.getItem("uid"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (uid && token) {
      getUsuario(uid, token)
        .then((response) => {
          if (response) {
            setUserRole(response.usuario?.rol);
          } else {
            alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
            handleLogout();
          }
        })
        .catch((error) => {
          console.error("Error al obtener el rol del usuario:", error);
        });
    }
  }, [uid, token]);


  const handleLogout = () => {
    localStorage.removeItem("uid"); 
    localStorage.removeItem("token"); 
    setUserRole(null);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-secondary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Heaven's Burgers
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
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                to="/"
                end
              >
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                to="/productos"
              >
                Productos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                to="/pedidos"
              >
                Pedidos
              </NavLink>
            </li>
            
            {(userRole === "ADMIN_ROLE" || userRole === "MOD_ROLE" || userRole === "VENTAS_ROLE") && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  to="/admin"
                >
                  Administración
                </NavLink>
              </li>
            )}

           
            <li className="nav-item">
              {token ? (
                <button
                  className="nav-link btn btn-link"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              ) : (
                <NavLink
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  to="/login"
                >
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
