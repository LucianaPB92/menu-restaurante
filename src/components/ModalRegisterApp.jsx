import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { postUsuario } from "../helpers/apiUsuarios";

const RegisterModal = ({ id = "registerModal", defaultRole = "USER_ROLE" }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
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

      if (response.status === 201) {
        setSuccessMessage(
          response.data.msg || "Usuario registrado exitosamente."
        );
        setErrorMessage(null); // Limpiar mensaje de error si es exitoso
        reset(); // Limpiar el formulario
        // Mostrar el mensaje y cerrar el modal después de 2 segundos
        setTimeout(() => {
          closeModal();
        }, 2000);
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
      setErrorMessage(
        error.message || "Ocurrió un error inesperado al registrar el usuario."
      ); // Mostrar el error en el modal
      setSuccessMessage(null); // Limpiar mensaje de éxito si ocurre un error
    }
  };

  const closeModal = () => {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      // Remover la clase `show` y agregar `aria-hidden`
      modalElement.classList.remove("show");
      modalElement.style.display = "none";
      modalElement.setAttribute("aria-hidden", "true");
      // Eliminar backdrop si existe
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
      // Restaurar el atributo `aria-modal` y el `role` si es necesario
      modalElement.removeAttribute("aria-modal");
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      setSuccessMessage(null);
    }
  };

  useEffect(() => {
    // Limpiar el mensaje de éxito cuando el modal se cierra
    const modalElement = document.getElementById(id);

    if (modalElement) {
      const handleModalHidden = () => {
        setSuccessMessage(null);
      };

      modalElement.addEventListener("hidden.bs.modal", handleModalHidden);

      return () => {
        modalElement.removeEventListener("hidden.bs.modal", handleModalHidden);
      };
    }
  }, [id]);
  return (
    <div
      className="modal fade"
      id={id}
      tabIndex="-1"
      aria-labelledby={`${id}Label`}
      aria-hidden="true"
      // data-bs-backdrop="static"
      // data-bs-keyboard="false"
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
              {/* Mensaje de éxito global, si lo hay */}
              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
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