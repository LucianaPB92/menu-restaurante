const url = "https://webserver-mfl9.onrender.com/api/pedidos";
const getToken = () => JSON.parse(localStorage.getItem("token"));
const getPedidos = async () => {
  try {
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-token": getToken()
      },
    });

    if (!resp.ok) throw new Error("Error al obtener pedidos");

    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error en getPedidos:", error);
    return null;
  }
};

const getPedidoId = async (id) => {
  try {
    const resp = await fetch(url + "/" + id, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-token": getToken(),
      },
    });

    if (!resp.ok) throw new Error("No se encontró el pedido");

    return await resp.json();
  } catch (error) {
    console.error("Error en getPedidoId:", error);
    return null;
  }
};

const crearPedido = async (datos) => {
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-token": getToken(),
      },
      body: JSON.stringify(datos), // Mueve esto fuera de headers
    });

    if (!resp.ok) throw new Error(`Error al crear el pedido: ${resp.statusText}`);

    const data = await resp.json();
    
    if (data.msg && data.pedido) {
      return data;
    } else {
      throw new Error("Respuesta del servidor inesperada");
    }
  } catch (error) {
    console.error("Error al crear el pedido", error);
    return null;  
  }
};
const actualizarPedido = async (id, datos) => {
  try {
    const resp = await fetch(url + "/" + id, {
      method: "PUT",
      body: JSON.stringify(datos),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-token": getToken(),
      },
    });
    if (!resp.ok) throw new Error("Error al actualizar el pedido");
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("error al actualizar el pedido", error);
    return null;
  }
};

const eliminarPedido = async (id) => {
  try {
    const resp = await fetch(url + "/" + id, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-token": getToken(),
      },
    });

    if (!resp.ok) throw new Error("No se pudo eliminar el pedido");

    return { success: true };
  } catch (error) {
    console.error("Error en eliminarPedido:", error);
    return { success: false };
  }
};
export {
  getPedidoId,
  getPedidos,
  crearPedido,
  actualizarPedido,
  eliminarPedido,
};
