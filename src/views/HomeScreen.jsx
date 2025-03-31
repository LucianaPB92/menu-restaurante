import React, { useEffect, useState } from "react";
import { obtenerCategorias } from "../helpers/apiCategorias";
import { obtenerProductos } from "../helpers/apiProductos";
import { getUsuario } from "../helpers/apiUsuarios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../css/HomeScreen.css";
import "bootstrap/dist/css/bootstrap.min.css";
import bannerDesktop from "../assets/banner-desktop.jpg";
import bannerMobile from "../assets/banner-mobile.jpg";

const HomeScreen = () => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [usuario, setUsuario] = useState(null);

  const verificarSesion = () => {
    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("token");

    if (uid && token) {
      getUsuario(uid)
        .then(setUsuario)
        .catch(() => setUsuario(null));
    } else {
      setUsuario(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriasData = await obtenerCategorias();
        setCategorias(categoriasData);

        const { productos } = await obtenerProductos({ estado: true });
        setProductos(productos);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setProductos([]);
      }
    };

    fetchData();
    verificarSesion();

    const interval = setInterval(verificarSesion, 1000);
    return () => clearInterval(interval);
  }, []);
  const handleComprar = () => {
    if (!usuario) {
      alert("Debe iniciar sesión para realizar un pedido.");
      return;
    }
  };
  return (
    <div>
      <div className="banner-container">
        <img
          src={bannerDesktop}
          srcSet={`${bannerMobile} 600w, ${bannerDesktop} 1200w`}
          sizes="(max-width: 768px) 600px, 1200px"
          alt="Banner principal"
          className="banner-img"
        />
      </div>

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
                          <button className="btn my-1" onClick={handleComprar}>
                            Comprar
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
    </div>
  );
};

export default HomeScreen;
