import React, { useEffect, useState } from "react";
import {
  getPedidos,
  eliminarPedido,
  actualizarPedido,
} from "../helpers/apiPedidos";
import { useNavigate, Navigate } from "react-router-dom";
import Loader from "../components/loaderApp";
import "../css/AdminPedidoScreen.css"
const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    traerPedidos();
  }, []);

  const traerPedidos = () => {
    getPedidos().then((response) => {
      if (response?.pedidos) {
        setPedidos(response.pedidos);
        setLoading(false);
      } else {
        localStorage.removeItem("token");
        navigate("/login");
      }
    });
  };

  const handleVerDetalle = (_id) => {
    navigate(`/pedidos/${_id}`);
  };
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este pedido?"
    );
    if (confirmDelete) {
      eliminarPedido(id)
        .then(() => {
          setPedidos(pedidos.filter((pedido) => pedido._id !== id));
        })
        .catch((error) => {
          setError("Error al eliminar el pedido.");
        });
    }
  };
  const handleChangeEstado = async (id, estado) => {
    try {
      const response = await actualizarPedido(id, { estado: !estado });
      if (response?.pedido) {
        setPedidos(
          pedidos.map((pedido) =>
            pedido._id === id
              ? { ...pedido, estado: response.pedido.estado }
              : pedido
          )
        );
      }
    } catch (error) {
      setError("Error al cambiar el estado del pedido");
    }
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container margenContainer">
          <h2 className="text-center">Lista de Pedidos</h2>

          {loading ? (
            <p className="text-center">Cargando pedidos...</p>
          ) : error ? (
            <p className="text-danger text-center">{error}</p>
          ) : pedidos.length === 0 ? (
            <p className="text-center">No hay pedidos disponibles.</p>
          ) : (
            <div className="table-responsive mt-5">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th className="d-none d-sm-table-cell">ID</th>{" "}
                    {/* Se oculta en pantallas pequeñas */}
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr key={pedido._id}>
                      <td
                        className="d-none d-sm-table-cell"
                        style={{ verticalAlign: "middle" }}
                      >
                        {pedido._id}
                      </td>{" "}
                      {/* Se oculta en pantallas pequeñas */}
                      <td style={{ verticalAlign: "middle" }}>
                        {pedido.usuario?.nombre || pedido.usuario?.email}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {new Date(pedido.fecha).toLocaleDateString()}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <button
                          className={`btn btn-sm ${
                            pedido.estado ? "btn-success" : "btn-danger"
                          }`}
                          onClick={() =>
                            handleChangeEstado(pedido._id, pedido.estado)
                          }
                        >
                          {pedido.estado
                            ? "Marcar como Finalizado"
                            : "Marcar como Pendiente"}
                        </button>
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <button
                          className="btn mt-2 btn-primary btn-sm me-2 mb-2"
                          onClick={() => handleVerDetalle(pedido._id)}
                        >
                          Detalle
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(pedido._id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) }
    </>
  );
};

export default Pedidos;
