const URL_PRODUCTOS = "https://webserver-mfl9.onrender.com/api/productos";

const obtenerProductos = async ({ estado, limite = 27 } = {}) => {
  let url = `${URL_PRODUCTOS}?limite=${limite}`;

  if (estado !== undefined) {
    url += `&estado=${estado}`;
  }

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  const data = await resp.json();
  console.log(data);

  if (data && Array.isArray(data.productos)) {
    return {
      productos: data.productos,
      total: data.total || 0,
    };
  } else {
    console.error("Los productos no tienen el formato esperado:", data);
    return { productos: [], total: 0 };
  }
};

const postProducto = async (productoData) => {
  try {
    const response = await fetch(`${URL_PRODUCTOS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-token": JSON.parse(localStorage.getItem("token")),
      },
      body: JSON.stringify(productoData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || "Error al agregar producto");
    }

    return data;
  } catch (error) {
    console.error("Error en postProducto:", error.message);
    throw error;
  }
};

const actualizarProducto = async (id, producto) => {
  const token = JSON.parse(localStorage.getItem("token"));
  console.log(token);

  if (!token) {
    throw new Error("No se encontró un token de autenticación");
  }

  console.log("Enviando actualización con ID:", id);
  console.log("Datos del producto a enviar:", producto);

  const { usuario, _id, __v, ...productoData } = {
    ...producto,
    precio: Number(producto.precio),
    stock: producto.stock ? Number(producto.stock) : 0,
  };
  console.log("Datos del producto a enviar después de limpieza:", productoData);
  try {
    const response = await fetch(`${URL_PRODUCTOS}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
      },
      body: JSON.stringify(productoData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || "Error al actualizar el producto");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al actualizar producto", error);
    throw error;
  }
};

const borrarProducto = async (id) => {
  try {
    const response = await fetch(`${URL_PRODUCTOS}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-token": JSON.parse(localStorage.getItem("token")),
      },
    });
    const data = await response.json();
    return data.productoBorrado;
  } catch (error) {
    console.error("Error al borrar producto", error);
    throw error;
  }
};

const reactivarProducto = async (id) => {
  try {
    const response = await fetch(`${URL_PRODUCTOS}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-token": JSON.parse(localStorage.getItem("token")),
      },
    });

    if (!response.ok) {
      throw new Error("No se pudo reactivar el producto");
    }

    const data = await response.json();
    console.log("Datos recibidos del backend:", data);
    return data.producto;
  } catch (error) {
    console.error("Hubo un problema al reactivar el producto:", error.message);
    throw error;
  }
};

export {
  obtenerProductos,
  postProducto,
  actualizarProducto,
  borrarProducto,
  reactivarProducto,
};
