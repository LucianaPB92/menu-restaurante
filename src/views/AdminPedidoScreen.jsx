import React, { useEffect, useState } from "react";
import { getPedidos, eliminarPedido, actualizarPedido } from "../helpers/apiPedidos";
import { useNavigate } from "react-router-dom";

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    traerPedidos();
  }, []);

  const traerPedidos = () => {
    getPedidos().then((response) => {
      if (response?.pedidos) {
        setPedidos(response.pedidos);
        setCargando(false);
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
          setPedidos(pedidos.filter((pedido) => pedido._id !== id))
        })
        .catch((error) => {
          setError("Error al eliminar el pedido.");
        });
    }
  };
  const handleChangeEstado = async (id, estado) => {
    try {
      const response = await actualizarPedido(id, { estado: !estado }); // Cambia el estado del pedido (true/false)
      if (response?.pedido) {
        setPedidos(pedidos.map((pedido) =>
          pedido._id === id ? { ...pedido, estado: response.pedido.estado } : pedido
        ));
      }
    } catch (error) {
      setError("Error al cambiar el estado del pedido");
    }
  };
  return (
    <div className="container mt-4">
      <h2 className="text-center">Lista de Pedidos</h2>

      {cargando ? (
        <p className="text-center">Cargando pedidos...</p>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : pedidos.length === 0 ? (
        <p className="text-center">No hay pedidos disponibles.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="">
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido._id}>
                  <td>{pedido._id}</td>
                  <td>{pedido.usuario?.nombre || pedido.usuario?.email}</td>
                  <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                  <td><button
                      className={`btn btn-sm ${pedido.estado ? "btn-success":"btn-danger"}`}
                      onClick={() => handleChangeEstado(pedido._id, pedido.estado)} // Cambiar el estado del pedido
                    >
                      {pedido.estado ? "Marcar como Finalizado" : "Marcar como Pendiente"}
                    </button></td>

                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleVerDetalle(pedido._id)}
                    >
                      Ver Detalle
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
  );
};

export default Pedidos;
