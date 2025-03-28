const url = "https://webserver-qcd7.onrender.com/api/pedidos";
const getPedidos = async () => {
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "x-token": JSON.parse(localStorage.getItem("token")),
    },
  });
  const data = await resp.json();
  console.log(data);
  
  return data;
  
};
const getPedidoId = async (id) => {
  const resp = await fetch(url + "/" + id, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "x-token": JSON.parse(localStorage.getItem("token")),
    },
  });
  const data = await resp.json();
  return data;
};
const crearPedido = async (datos) => {
  const resp = await fetch(url, {
    method: "POST",
    body: JSON.stringify(datos),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "x-token": JSON.parse(localStorage.getItem("token")),
    },
  });
  const data = await resp.json();
  return data;
};
const actualizarPedido = async (id, datos) => {
  const resp = await fetch(url + "/" + id, {
    method: "POST",
    body: JSON.stringify(datos),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "x-token": JSON.parse(localStorage.getItem("token")),
    },
  });
  const data = await resp.json();
  return data;
};
const eliminarPedido = async (id) => {
  const resp = await fetch(url + "/" + id, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "x-token": JSON.parse(localStorage.getItem("token")),
    },
  });
};
export {
  getPedidoId,
  getPedidos,
  crearPedido,
  actualizarPedido,
  eliminarPedido,
};
