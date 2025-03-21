const url = "https://webserver-mfl9.onrender.com/api/usuarios";

const getUsuario = async (id) => {
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

const getUsuarios = async () => {
  const resp = await fetch(url + "/", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "x-token": JSON.parse(localStorage.getItem("token")),
    },
  });

  const data = await resp.json();

  return data;
};

const postUsuario = async (userData) => {
  try {
    const resp = await fetch(url, {
      method: "POST", // Indicamos el método
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(userData),
    });

    if (!resp.ok) {
      const errorData = await resp.json();
      const errorMsg =
        errorData.errors?.[0]?.msg || data.msg || "Error en el registro";
      throw new Error(errorMsg);
    }

    const data = await resp.json(); // Parseamos la respuesta a JSON
    console.log("Respuesta exitosa:", data);
    return { status: resp.status, data };
  } catch (error) {
    console.error("Error en la solicitud POST:", error.message);
    throw error;
  }
};

const inactivarUsuario = async (id) => {
  try {
    const resp = await fetch(`${url}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-token": JSON.parse(localStorage.getItem("token")),
      },
    });

    const data = await resp.json();
    console.log("Respuesta del servidor:", data);
    if (!resp.ok) throw new Error(data.message || "Error al inactivar usuario");

    return data.usuarioBorrado;
  } catch (error) {
    console.error("Error al inactivar usuario:", error);
    throw error;
  }
};

const reactivarUsuario = async (id) => {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-token": JSON.parse(localStorage.getItem("token")),
      },
    });
    if (!response.ok) {
      throw new Error("No se pudo reactivar el usuario");
    }
    const data = await response.json();
    console.log("Datos recibidos del backend:", data);
    return data.usuario;
  } catch (error) {
    console.error("Hubo un problema al reactivar el usuario:", error.message);
    throw error;
  }
};
export {
  postUsuario,
  getUsuario,
  getUsuarios,
  inactivarUsuario,
  reactivarUsuario,
};
