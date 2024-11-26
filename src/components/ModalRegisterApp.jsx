import React from "react";
import { useForm } from "react-hook-form";
import { postUsuario } from "../helpers/apiUsuarios";

const RegisterModal = ({ id = "registerModal", defaultRole = "USER_ROLE" }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const registerUser = async (data) => {
    try {
      const userData = {
        ...data,
        role: defaultRole,
        
    };
    console.log(userData);

      const response = await postUsuario(userData); // Llamamos a la función para registrar el usuario
      console.log("Usuario registrado exitosamente:", response);
      alert("Usuario registrado exitosamente");
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
      alert("Ocurrió un error al registrar el usuario.");
    }
  };

  return (
    <div
      className="modal fade"
      id={id}
      tabIndex="-1"
      aria-labelledby={`${id}Label`}
      aria-hidden="true"
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
              aria-label="Close"
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
              <button
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
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