
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
    credentials: "include", 
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
  const url = id ? `${mainRoute}/${endpoint}/${id}` : `${mainRoute}/${endpoint}`;
  const res = await fetch(url, options);
  console.log(url, options);
  
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

    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    return data;


  } catch (error) {
    console.error("Error en apiRequest:", error);
    showToast(error.message || "Error en la comunicación con el servidor", "error");
    return;
  }
};
