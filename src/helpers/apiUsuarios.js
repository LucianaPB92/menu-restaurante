const url = "https://webserver-mfl9.onrender.com/api/usuarios";
// const url = "https://proyecto-menu-de-restaurante.onrender.com/api/usuarios"
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
//funcion para traerme usuarios
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

//funcion para agregar usuarios

const postUsuario = async (userData) => {
  try {
    const resp = await fetch(url, {
      method: "POST",
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

    const data = await resp.json();
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
    if (!resp.ok) throw new Error(data.message || "Error al inactivar usuario");

    return data.usuarioBorrado;
  } catch (error) {
    console.error("Error al inactivar usuario:", error);
    throw error;
  }
};
export { postUsuario, getUsuario, getUsuarios, inactivarUsuario };
