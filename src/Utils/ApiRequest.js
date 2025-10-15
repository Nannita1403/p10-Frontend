
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
  const url = id ? `${mainRoute}/${endpoint}/${id}` : `${mainRoute}/${endpoint}`;
  const res = await fetch(url, options);
  
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
