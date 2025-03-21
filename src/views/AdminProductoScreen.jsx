import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  obtenerProductos,
  postProducto,
  borrarProducto,
  actualizarProducto,
  reactivarProducto,
} from "../helpers/apiProductos.js";
import FormularioProducto from "../components/InputFormApp.jsx";
import Pagination from "../components/PaginationApp.jsx";

const AdminProductoScreen = () => {
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productosPaginados, setProductosPaginados] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 5;
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const {
    register: registerAgregar,
    handleSubmit: handleSubmitAgregar,
    reset: resetAgregar,
    watch: watchAgregar,
    formState: { errors: errorsAgregar },
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      precio: "",
      categoria: "",
      img: "",
      stock: "",
    },
  });

  const {
    register: registerEditar,
    handleSubmit: handleSubmitEditar,
    reset: resetEditar,
    setValue,
    watch: watchEditar,
    formState: { errors: errorsEditar },
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      precio: "",
      categoria: "",
      img: "",
      stock: "",
    },
  });

  useEffect(() => {
    const cargarProductos = async () => {
      const data = await obtenerProductos({});
      console.log("Productos cargados desde la API:", data.productos);

      if (Array.isArray(data.productos)) {
        setProductos(data.productos);
      } else {
        console.error("Error: 'productos' no es un array", data.productos);
      }
    };
    cargarProductos();
  }, []);

  useEffect(() => {
    if (!mensaje) return;
    const timer = setTimeout(() => setMensaje(""), 2000);
    return () => clearTimeout(timer);
  }, [mensaje]);

  //maneja busqueda
  const handleBusqueda = (e) => {
    setTerminoBusqueda(e.target.value);
    setPaginaActual(1);
  };

  const productosFiltrados = productos.filter((producto) => {
    const categoriaNombre = producto.categoria?.nombre || "";
    const coincideTermino =
      categoriaNombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      producto.nombre
        .toLowerCase()
        .includes(terminoBusqueda.toLocaleLowerCase());

    return coincideTermino;
  });
  const actualizarProductosPaginados = useCallback((nuevosProductos) => {
    setProductosPaginados(nuevosProductos);
  }, []);

  const handleFormSubmit = async (data) => {
    try {
      const productoData = {
        ...data,
        nombre: data.nombre.toUpperCase(),
        precio: Number(data.precio),
        stock: Number(data.stock),
      };

      await postProducto(productoData);
      setMensaje("Producto agregado correctamente");

      // Recargar los productos después de agregar uno nuevo
      const dataActualizada = await obtenerProductos();
      if (Array.isArray(dataActualizada.productos)) {
        setProductos(dataActualizada.productos);
      } else {
        console.error(
          "Error: 'productos' no es un array",
          dataActualizada.productos
        );
      }

      resetAgregar();
    } catch (error) {
      setMensaje(error.response?.data?.msg || "Error en la operación");
    }
  };

  const cargarProductoParaEditar = (producto) => {
    resetEditar(); // Limpia los valores anteriores
    setProductoSeleccionado(producto);

    Object.keys(producto).forEach((key) => {
      if (producto[key] !== null && producto[key] !== undefined) {
        if (key === "categoria") {
          // Si la categoría es un objeto, asignar su ID
          setValue(key, producto[key]._id || producto[key]);
        } else {
          setValue(key, producto[key]);
        }
      }
    });

    setTimeout(() => {
      const modalElement = document.getElementById("modalEditar");
      if (modalElement) {
        const modalInstance = new bootstrap.Modal(modalElement, {
          backdrop: "static",
          keyboard: false,
        });
        modalInstance.show();
      }
    }, 100);
  };
  const cerrarModal = () => {
    const modalInstance = bootstrap.Modal.getInstance(
      document.getElementById("modalEditar")
    );
    if (modalInstance) modalInstance.hide();

    setTimeout(() => {
      document
        .querySelectorAll(".modal-backdrop")
        .forEach((backdrop) => backdrop.remove());
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
    }, 500);
  };

  const handleActualizarProducto = async (data) => {
    try {
      const productoActualizado = {
        ...data,
        nombre: data.nombre.toUpperCase(),
        precio: Number(data.precio),
        stock: Number(data.stock),
      };

      await actualizarProducto(productoSeleccionado._id, productoActualizado);
      setMensaje("Producto actualizado correctamente");

      resetEditar();
      setProductoSeleccionado(null);

      const dataActualizada = await obtenerProductos();
      if (Array.isArray(dataActualizada.productos)) {
        setProductos(dataActualizada.productos);
      } else {
        console.error(
          "Error: 'productos' no es un array",
          dataActualizada.productos
        );
      }

      setTimeout(() => {
        setMensaje("");
        resetEditar();
        setProductoSeleccionado(null);
        cerrarModal();
      }, 1500);
    } catch (error) {
      setMensaje(error.response?.data?.msg || "Error al actualizar");
    }
  };

  const handleBorrar = async (id) => {
    if (window.confirm("¿Seguro que deseas borrar este producto?")) {
      const productoBorrado = await borrarProducto(id);
      console.log(productoBorrado);

      setProductos((prevProductos) =>
        prevProductos.map((producto) =>
          producto._id === productoBorrado.id ? productoBorrado : producto
        )
      );

      alert("Producto deshabilitado exitosamente.");
    }
  };
  const handleReactivarProducto = (id) => {
    reactivarProducto(id)
      .then((productoActualizado) => {
        console.log("Producto reactivado correctamente:", productoActualizado);

        setProductos((prevProductos) =>
          prevProductos.map((producto) =>
            producto._id === productoActualizado._id
              ? productoActualizado
              : producto
          )
        );
      })
      .catch((error) => {
        console.error("Error al reactivar el producto:", error);
      });
  };
  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h3>Agregar Producto</h3>
      <form onSubmit={handleSubmitAgregar(handleFormSubmit)}>
        <FormularioProducto
          register={registerAgregar}
          errors={errorsAgregar}
          watch={watchAgregar}
        />
        <button type="submit" className="btn btn-primary">
          Agregar Producto
        </button>

        {mensaje && <p className="mt-3 text-success">{mensaje}</p>}
      </form>

      <hr />
      {/* Buscador */}
      <div className="row mb-3">
        <div className="col-12 col-md-6 mb-3 mb-md-0">
          <div className="d-flex justify-content-end">
            <input
              type="text"
              className="form-control me-3"
              placeholder="Buscar por nombre o categoría..."
              value={terminoBusqueda}
              onChange={handleBusqueda}
            />
          </div>
        </div>
      </div>

      <h3>Lista de Productos</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th></th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosPaginados.length > 0 ? (
            productosPaginados.map((producto) => (
              <tr key={producto._id}>
                <td>{producto.nombre}</td>
                <td>${producto.precio}</td>
                <td>{producto.categoria?.nombre || "Sin categoría"}</td>
                <td>{producto.estado ? "Disponible" : "No disponible"}</td>
                <td>
                  {producto.estado ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm mx-3"
                        data-bs-toggle="modal"
                        data-bs-target="#modalEditar"
                        onClick={() => cargarProductoParaEditar(producto)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleBorrar(producto._id)}
                      >
                        Borrar
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-secondary" disabled>
                        Editar
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={() => handleReactivarProducto(producto._id)}
                      >
                        Reactivar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                <strong>No se encontró el producto solicitado</strong>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        items={productosFiltrados}
        itemsPerPage={productosPorPagina}
        currentPage={paginaActual}
        setCurrentPage={setPaginaActual}
        setPaginatedItems={actualizarProductosPaginados}
      />

      {/* Modal de edición */}
      <div
        className="modal fade"
        id="modalEditar"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="modalEditarLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="modalEditarLabel">
                Editar producto
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={cerrarModal}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitEditar(handleActualizarProducto)}>
                <FormularioProducto
                  register={registerEditar}
                  errors={errorsEditar}
                  watch={watchEditar}
                />
                <button type="submit" className="btn btn-primary">
                  Guardar Cambios
                </button>
                {mensaje && <p className="mt-2 text-success">{mensaje}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductoScreen;
