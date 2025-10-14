
import { showToast } from "../components/Toasty/Toasty";
import { mainRoute } from "../Data/Routes";
import { logout } from "./session";

let sessionExpiredShown = false;
 
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

  if (res.status === 401 || res.status === 403) {
  if (!sessionExpiredShown) {
        sessionExpiredShown = true;
        showToast("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.", "warning");
        setTimeout(() => {
          sessionExpiredShown = false;
          logout(); 
        }, 2500);
      }
      return;
    }

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
