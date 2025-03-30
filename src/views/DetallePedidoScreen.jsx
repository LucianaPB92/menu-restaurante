import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPedidoId } from "../helpers/apiPedidos";

const PedidoDetalle = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarPedido = async () => {
      const data = await getPedidoId(id);
      console.log("Datos recibidos:", data); // Verificar la respuesta
      if (data && data.pedido) {
        setPedido(data.pedido); // Asegúrate de que la propiedad 'pedido' existe en la respuesta
      } else {
        setError("Pedido no encontrado.");
      }
    };

    cargarPedido();
  }, [id]);

  // Función para volver a la lista de pedidos
  const handleVolver = () => {
    navigate("/admin/pedidos");
  };

  if (error) {
    return <p className="text-danger text-center">{error}</p>;
  }

  if (!pedido) {
    return <p className="text-center">Cargando pedido...</p>;
  }

  // Evitar error si 'usuario' o 'nombre' no están disponibles
  const clienteNombre = pedido.usuario ? pedido.usuario.nombre : "Cliente no encontrado";
  
  // Verifica que la fecha sea válida
  const fecha = new Date(pedido.fecha);
  const fechaFormateada = fecha instanceof Date && !isNaN(fecha) ? fecha.toLocaleDateString() : "Fecha inválida";

  const totalPedido = pedido.menu.reduce((total, item) => {
    return total + (item.producto.precio || 0);
  }, 0);

  return (
    <div className="container mt-4">
      <h2>Detalles del Pedido</h2>
      <p><strong>ID:</strong> {pedido._id}</p>
      <p><strong>Cliente:</strong> {clienteNombre}</p> {/* Verificación antes de mostrar nombre */}
      <p><strong>Fecha:</strong> {fechaFormateada}</p> {/* Verificación de fecha */}
      <p><strong>Estado:</strong> {pedido.estado ? "Pendiente" : "Finalizado"}</p>
      
      <h3>Productos en el pedido</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {pedido.menu.map((item, index) => (
            <tr key={index}>
              <td>{item.producto.nombre}</td>
              <td>${item.producto.precio.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4><strong>Total: ${totalPedido.toFixed(2)}</strong></h4>
      
      <button className="btn btn-secondary" onClick={handleVolver}>Volver</button>
    </div>
  );
};

export default PedidoDetalle;
