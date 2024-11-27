import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { postUsuario } from "../helpers/apiUsuarios";

const RegisterModal = ({ id = "registerModal", defaultRole = "USER_ROLE" }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const registerUser = async (data) => {
    try {
      // Verificar que las contraseñas coincidan
      if (data.password !== data.confirmPassword) {
        setErrorMessage("Las contraseñas no coinciden.");
        return;
      }
      const { confirmPassword, ...userData } = data; // Excluir confirmPassword
      userData.rol = defaultRole; // Asegurar que role esté incluido

      const response = await postUsuario(userData); // Llamamos a la función para registrar el usuario
      const modal = document.getElementById(id);
      const bootstrapModal =  bootstrap.Modal.getInstance(modal);
      if (response.status === 201) {
        alert("Usuario registrado exitosamente.");
        setErrorMessage(null); // Limpiar mensaje de error si es exitoso
        reset(); // Limpiar el formulario
        if (bootstrapModal) {
          bootstrapModal.hide(); // Cerrar el modal
        }
      } // Cerrar modal después del registro exitoso
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
      setErrorMessage(
        error.message || "Ocurrió un error inesperado al registrar el usuario."
      ); // Mostrar el error en el modal
    }
  };

  return (
    <div
      className="modal fade"
      id={id}
      tabIndex="-1"
      aria-labelledby={`${id}Label`}
      aria-hidden="true"
      data-bs-backdrop="static" // Evita el cierre al hacer clic fuera del modal
      data-bs-keyboard="false" // Evita el cierre con la tecla Escape
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${id}Label`}>
              Registro de Usuario
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-hidden="true"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(registerUser)}>
              <div className="mb-3">
                <label htmlFor="regNombre" className="form-label">
                  Nombre
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="regNombre"
                  {...register("nombre", { required: true })}
                />
                {errors.nombre?.type === "required" && (
                  <p className="text-danger">El nombre es obligatorio</p>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="regEmail" className="form-label">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="regEmail"
                  {...register("email", { required: true })}
                />
                {errors.email?.type === "required" && (
                  <p className="text-danger">Correo obligatorio</p>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="regPassword" className="form-label">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="regPassword"
                  {...register("password", { required: true })}
                />
                {errors.password?.type === "required" && (
                  <p className="text-danger">Contraseña obligatoria</p>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  {...register("confirmPassword", { required: true })}
                />
                {errors.confirmPassword?.type === "required" && (
                  <p className="text-danger">
                    Confirmar contraseña es obligatorio
                  </p>
                )}
              </div>
              {/* Mensaje de error global, si lo hay */}
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              <button type="submit" className="btn btn-primary">
                Registrarse
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;