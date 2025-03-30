import React, { useEffect, useState } from "react";
import { obtenerCategorias } from "../helpers/apiCategorias";
import { obtenerProductos } from "../helpers/apiProductos";
import "../css/HomeScreen.css";
import "bootstrap/dist/css/bootstrap.min.css";
import bannerDesktop from "../assets/banner-desktop.jpg";
import bannerMobile from "../assets/banner-mobile.jpg";

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
      {/* Banner principal */}
      <div className="banner-container">
        <img
          src={bannerDesktop}
          srcSet={`${bannerMobile} 600w, ${bannerDesktop} 1200w`}
          sizes="(max-width: 768px) 600px, 1200px"
          alt="Banner principal"
          className="banner-img"
        />
      </div>

      <div className="container">
        {categorias.map((categoria) => (
          <div key={categoria._id} className="mb-5">
            <h2 className="text-center mb-4">{categoria.nombre}</h2>
            <div
              id={`carousel-${categoria._id}`}
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {productos
                  .filter(
                    (producto) => producto.categoria._id === categoria._id
                  )
                  .reduce((acc, producto, index) => {
                    if (index % 4 === 0) {
                      acc.push([]);
                    }
                    acc[acc.length - 1].push(producto);
                    return acc;
                  }, [])
                  .map((grupo, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                    >
                      <div className="row">
                        {grupo.map((producto) => (
                          <div key={producto._id} className="col-md-3">
                            <div className="card h-100">
                              <img
                                src={
                                  producto.img ||
                                  "https://via.placeholder.com/150"
                                }
                                className="card-img-top"
                                alt={producto.nombre}
                              />
                              <div className="card-body">
                                <h5 className="card-title">
                                  {producto.nombre}
                                </h5>
                                <p className="card-text">
                                  {producto.descripcion ||
                                    "Descripción no disponible."}
                                </p>
                                <p className="card-text">
                                  <strong>Precio:</strong> ${producto.precio}
                                </p>
                                <button className="btn btn-primary">
                                  Comprar
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#carousel-${categoria._id}`}
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Anterior</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#carousel-${categoria._id}`}
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Siguiente</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
