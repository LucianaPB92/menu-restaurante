import React, { useState } from "react";
import { crearPedido } from "../helpers/apiPedidos"; 
import "../css/CarritoScreen.css"
const CarritoScreen = ({ carrito, setCarrito }) => {
  const [loading, setLoading] = useState(false); 
  const [mensaje, setMensaje] = useState(""); 

  const handleEliminarDelCarrito = (productoId, index) => {
    // Eliminar solo el producto específico usando tanto el ID del producto como el índice
    setCarrito(carrito.filter((producto, i) => !(producto._id === productoId && i === index)));
  };

  const confirmarPedido = async () => {
    const datosPedido = {
      menu: carrito.map((item) => ({
        producto: item._id,
        cantidad: item.cantidad || 1,
      })),
      estado: true,
    };
    console.log("Datos del pedido:", datosPedido);
    setLoading(true);
  
    try {
      const respuesta = await crearPedido(datosPedido);
  
      if (!respuesta) {
        throw new Error("No se pudo crear el pedido");
      }
  
      setMensaje(
        `Pedido realizado con éxito! ID del pedido: ${respuesta.pedido._id}`
      );
      setCarrito([]);
    } catch (error) {
      
      if (error.message) {
        setMensaje("Primero debes iniciar sesión.");
      }
      console.error("Error al crear el pedido:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
    <div className="container vh-100 mt-5 px-3">
      <h2 className="text-center mb-4 mt-5">Carrito de Compras</h2>

      {mensaje && <p className="alert alert-info">{mensaje}</p>}

      {carrito.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <div>
          {carrito.map((producto, index) => (
            <div
              key={`${producto._id}-${index}`} // Clave única utilizando el ID y el índice
              className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded"
            >
              <div className="d-flex flex-column flex-sm-row w-100 centrar-boton">
                <p className="mb-1 mb-sm-0 w-75 centrar-boton mb-2">{producto.nombre} - ${producto.precio}</p>
                <button
                  className="btn btn-danger"
                  onClick={() => handleEliminarDelCarrito(producto._id, index)} // Pasamos tanto el ID como el índice
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
      
          <button
          
            className="btn btn-success mt-4 mb-4 w-100 bi bi-bag-check "
            onClick={confirmarPedido}
            disabled={loading}
          >
            {loading ? "Confirmando..." : "Confirmar Pedido"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CarritoScreen;
