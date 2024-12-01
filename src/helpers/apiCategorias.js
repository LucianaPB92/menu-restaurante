const URL_CATEGORIAS =
  "https://proyecto-menu-de-restaurante.onrender.com/api/categorias";
export const obtenerCategorias = async () => {
  try {
    const response = await fetch(URL_CATEGORIAS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-token": JSON.parse(localStorage.getItem("token")),
      },
    });
    if (!response.ok) {
      throw new Error("Error al obtener categorías");
    }
    const { categorias } = await response.json();
    return categorias;
  } catch (error) {
    console.error("Error en obtenerCategorias:", error);
    return [];
  }
};
