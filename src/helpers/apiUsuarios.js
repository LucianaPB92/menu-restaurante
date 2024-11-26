const url = "https://webserver-mfl9.onrender.com/api/usuarios";

const getUsuario = async (id) => {
  const resp = await fetch(url + "/" + id, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "x-token": JSON.parse(localStorage.getItem("token")),
    },
  });
  // Validar la respuesta sin usar try-catch
  if (!resp.ok) {
    if (resp.status === 401) {
      console.error("Token expirado o no autorizado");
      return null;
    }

    console.error("Error en la solicitud:", resp.status);
    return null;
  }

  const data = await resp.json();
  return data;
};
