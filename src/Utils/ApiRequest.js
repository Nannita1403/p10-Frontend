
import { showToast } from "../components/Toasty/Toasty";
import { mainRoute } from "../Data/Routes";

export const apiRequest = async ({ endpoint, id = '', method, body }) => {
  const token = localStorage.getItem("token");

  const options = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    method: method.toUpperCase(),
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${mainRoute}/${endpoint}/${id}`, options);
    // Si el Token es inválido
    if (res.status === 401 || res.status === 403) {
      console.warn("Token inválido o expirado. Limpiando sesión...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      showToast("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.", "warning");
      setTimeout(() => (window.location.href = "/login"), 2500);
      return; 
    }
    //si hay otros errores
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Error en la petición");
    }

    return res;
  } catch (error) {
    console.error("Error en apiRequest:", error);
    showToast(error.message || "Error en la comunicación con el servidor", "error");
    return;
  }
};
