const URL_PRODUCTOS =
  "https://proyecto-menu-de-restaurante.onrender.com/api/productos";

const obtenerProductos = async (pagina, limite) => {
  const resp = await fetch(
    `${URL_PRODUCTOS}?limite=${limite}&desde=${pagina * limite}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-token": JSON.parse(localStorage.getItem("token")),
      },
    }
  );

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

export { obtenerProductos };
