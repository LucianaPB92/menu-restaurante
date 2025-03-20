import { useState, useEffect } from "react";
import { obtenerCategorias } from "../helpers/apiCategorias.js";

const FormularioProducto = ({ register, errors, producto = {}, watch }) => {
  const [categorias, setCategorias] = useState([]);
  const [imagenPreview, setImagenPreview] = useState(producto.img || "");

  useEffect(() => {
    const cargarCategorias = async () => {
      const data = await obtenerCategorias();
      setCategorias(data);
    };
    cargarCategorias();
  }, []);

  useEffect(() => {
    const imagenUrl = watch("img");
    setImagenPreview(imagenUrl || "");
  }, [watch("img")]);

  return (
    <>
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">
          Nombre del Producto
        </label>
        <input
          type="text"
          className="form-control"
          id="nombre"
          defaultValue={producto.nombre || ""}
          {...register("nombre", { required: "El nombre es obligatorio" })}
        />
        {errors.nombre && (
          <p className="text-danger">{errors.nombre.message}</p>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="descripcion" className="form-label">
          Descripción
        </label>
        <textarea
          className="form-control"
          id="descripcion"
          rows={3}
          defaultValue={producto.descripcion || ""}
          {...register("descripcion", {
            required: "La descripción es obligatoria",
          })}
        ></textarea>
        {errors.descripcion && (
          <p className="text-danger">{errors.descripcion.message}</p>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="precio" className="form-label">
          Precio ($)
        </label>
        <input
          type="number"
          className="form-control"
          id="precio"
          defaultValue={producto.precio || ""}
          {...register("precio", {
            required: "El precio es obligatorio",
            min: 1,
          })}
        />
        {errors.precio && (
          <p className="text-danger">{errors.precio.message}</p>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="stock" className="form-label">
          Stock
        </label>
        <input
          type="number"
          className="form-control"
          id="stock"
          defaultValue={producto.stock || ""}
          {...register("stock", {
            required: "El stock es obligatorio",
            min: 0,
          })}
        />
        {errors.stock && <p className="text-danger">{errors.stock.message}</p>}
      </div>
      <div className="mb-3">
        <label htmlFor="categoria" className="form-label">
          Categoría
        </label>
        <select
          className="form-select"
          id="categoria"
          defaultValue={producto.categoria || ""}
          {...register("categoria", { required: "Seleccione una categoría" })}
        >
          <option value="">Seleccione una categoría</option>
          {categorias.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.nombre}
            </option>
          ))}
        </select>
        {errors.categoria && (
          <p className="text-danger">{errors.categoria.message}</p>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="imagen" className="form-label">
          Imagen (URL)
        </label>
        <input
          type="text"
          className="form-control"
          id="imagen"
          defaultValue={producto.img || ""}
          {...register("img", {
            required: "La URL de la imagen es obligatoria",
          })}
        />
        {errors.img && <p className="text-danger">{errors.img.message}</p>}

        {imagenPreview && (
          <div className="mt-3">
            <p>Vista previa de la imagen:</p>
            <img
              src={imagenPreview}
              alt="Vista previa"
              className="img-thumbnail"
              style={{ maxWidth: "200px" }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default FormularioProducto;
