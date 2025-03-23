import React, { useEffect, useState } from "react";
import { obtenerCategorias } from "../helpers/apiCategorias";
import { obtenerProductos } from "../helpers/apiProductos";
import "../css/HomeScreen.css";


const HomeScreen = () => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriasData = await obtenerCategorias();
        setCategorias(categoriasData);

        const { productos, total } = await obtenerProductos({ estado: true });
        setProductos(productos);
        console.log(`Total productos: ${total}`);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setProductos([]);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="home-container d-flex flex-column justify-content-center align-items-center text-center">
        <h1>Bienvenidos a nuestra tienda</h1>
        <img
          src="https://www.vitalbodyplus.de/cdn/shop/articles/ungesundes-fast-food-burger-und-pommes-150946.jpg?v=1702709841"
          alt="Imagen principal"
          className="img-fluid mb-4"
        />
      </div>
      <div className="container">
        {categorias.map((categoria) => (
          <div key={categoria._id} className="mb-5">
            <h2 className="text-center mb-4">{categoria.nombre}</h2>
            <div className="row">
              {productos
                .filter((producto) => producto.categoria._id === categoria._id)
                .map((producto) => (
                  <div key={producto._id} className="col-md-4">
                    <div className="card ">
                      <img
                        src={producto.img || "https://via.placeholder.com/150"}
                        className="card-img-top"
                        alt={producto.nombre}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{producto.nombre}</h5>
                        <p className="card-text">
                          {producto.descripcion || "Descripción no disponible."}
                        </p>
                        <p className="card-text">
                          <strong>Precio:</strong> ${producto.precio}
                        </p>
                        <button className="btn btn-primary">Comprar</button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
