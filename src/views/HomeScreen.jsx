import React, { useEffect, useState } from "react";
import { obtenerCategorias } from "../helpers/apiCategorias";
import { obtenerProductos } from "../helpers/apiProductos";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../css/HomeScreen.css";
import "bootstrap/dist/css/bootstrap.min.css";
import bannerDesktop from "../assets/banner-desktop.jpg";
import bannerMobile from "../assets/banner-mobile.jpg";

const HomeScreen = ({ carrito, setCarrito }) => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

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

  // Función para agregar productos al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => [...prevCarrito, producto]);
  };

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

      {/* Secciones por categorías */}
      <div className="container px-0">
        {categorias.map((categoria) => (
          <div key={categoria._id} className="mb-5">
            <h2 className="text-center mb-4">{categoria.nombre}</h2>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={25}
              slidesPerView={1}
              breakpoints={{
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              className="swiper-container"
            >
              {productos
                .filter((producto) => producto.categoria._id === categoria._id)
                .map((producto) => (
                  <SwiperSlide key={producto._id}>
                    <div className="card-wrapper">
                      <div className="card">
                        <img
                          src={
                            producto.img || "https://via.placeholder.com/150"
                          }
                          className="card-img-top"
                          alt={producto.nombre}
                        />
                        <div className="card-body">
                          <h5 className="card-title">{producto.nombre}</h5>
                          <p className="card-text">
                            {producto.descripcion ||
                              "Descripción no disponible."}
                          </p>
                          <p className="card-text">
                            <strong>${producto.precio}</strong>
                          </p>
                          <button
                            className="btn my-1"
                            onClick={() => agregarAlCarrito(producto)} // Agregar al carrito
                          >
                            Agregar al Carrito
                          </button>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        ))}
      </div>

      <div className="text-center mt-1 mb-2 ">
        <button
          className="btn btn-success my-1 position-fixed"
          style={{
            bottom: "50px",
            right: "30px",
            zIndex: 999,
            borderRadius: "20%",
            padding: "10px", // Ajusta el tamaño del botón
            opacity: 0.9
          }}
          onClick={() => navigate("/pedidos")}
        >
          <i className="bi bi-cart" style={{ fontSize: "20px" }}></i>{" "}
          
          <span className="ms-1">{carrito.length}</span>
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;
