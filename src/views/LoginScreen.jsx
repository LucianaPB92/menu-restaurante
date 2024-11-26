import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { auth } from "../helpers/fetchApi";
import RegisterModal from "../components/ModalRegisterApp";
import "../css/LoginScreen.css";
const LoginScreen = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm();

  const logIn = (data, e) => {
    e.preventDefault();

    const { correo, pass } = data;
    auth(correo, pass).then((response) => {
      if (response?.token) {
        localStorage.setItem("token", JSON.stringify(response.token));
        localStorage.setItem("uid", JSON.stringify(response.uid));
        navigate("/");
      } else {
        setMessage(response);
      }
    });
  };

  return (
    <div>
      <div className="login-container d-flex flex-column justify-content-center align-items-center">
        <h2 className="mb-4">Iniciar Sesión</h2>
        <form className="login-form" onSubmit={handleLoginSubmit(logIn)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <input
              type="email"
              className={
                loginErrors.correo?.type === "required"
                  ? "form-control bg-danger"
                  : "form-control"
              }
              id="email"
              placeholder="Ingresa tu correo electrónico"
              {...loginRegister("correo", { required: true })}
            />
            {loginErrors.correo?.type === "required" && (
              <p className="text-danger">Correo obligatorio</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Ingresa tu contraseña"
              {...loginRegister("pass", { required: true })}
            />
            {loginErrors.pass?.type === "required" && (
              <p className="text-danger">Contraseña obligatoria</p>
            )}
          </div>
          <button type="submit" className="btn btn-primary">
            Iniciar Sesión
          </button>
        </form>
        {message && (
          <div className="alert alert-danger mx-2" role="alert">
            {message.msg}
          </div>
        )}
        <button
          type="button"
          className="btn btn-link mt-3"
          data-bs-toggle="modal"
          data-bs-target="#userRegisterModal"
        >
          ¿No tienes una cuenta? Regístrate aquí
        </button>
      </div>

      <RegisterModal id="userRegisterModal" defaultRole="USER_ROLE" />
    </div>
  );
};

export default LoginScreen;
