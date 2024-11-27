const url = "https://webserver-mfl9.onrender.com/api/usuarios"; //Definimos la url de la API

const getUsuario = async (id) => {
  const resp = await fetch(url + "/" + id, {
    //petición fetch a la API con la ruta como definimos en el backend
    method: "GET", //indicamos el método
    headers: {
      "Content-type": "application/json; charset=UTF-8", //header básico
      "x-token": JSON.parse(localStorage.getItem("token")), // información del token que guardamos en localstorage
    },
  });
   // Validar la respuesta sin usar try-catch
   if (!resp.ok) {
    if (resp.status === 401) {
      console.error("Token expirado o no autorizado");
      return null; // Retornar `null` si el token es inválido
    }

    console.error("Error en la solicitud:", resp.status);
    return null; // Retornar `null` para otros errores
  }

  // Parsear y retornar los datos si la respuesta es válida
  const data = await resp.json();
  return data;
}
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
      method: "POST", // Indicamos el método
      headers: {
        "Content-type": "application/json; charset=UTF-8", // Header para datos JSON
      },
      body: JSON.stringify(userData), // Convertimos el objeto a JSON
    });

    if (!resp.ok) {
      const errorData = await resp.json();
      const errorMsg = errorData.errors?.[0]?.msg || "Error en el registro";
      throw new Error(errorMsg); // Lanzamos el error con el mensaje
      // throw new Error(errorData.msg || "Error en el registro");
    }

    const data = await resp.json(); // Parseamos la respuesta a JSON
    return data; // Retornamos los datos de la respuesta
  } catch (error) {
    console.error("Error en la solicitud POST:", error.message);
    throw error; // Relanzamos el error para manejarlo desde el componente
  }
};

export { postUsuario, getUsuario,getUsuarios }; // Exportamos la función
